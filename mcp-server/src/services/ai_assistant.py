"""AI Assistant service with OpenAI integration and RAG capabilities."""

import json
import logging
import time
from typing import AsyncGenerator, Literal, Optional

from openai import AsyncOpenAI, OpenAIError

from config import settings
from models.schemas import ChatResponse, DocumentChunk
from services.knowledge_base import KnowledgeBase
from services.conversation_store import conversation_store

logger = logging.getLogger(__name__)


class AIAssistant:
    """AI Assistant with RAG capabilities for SMART on FHIR platform."""

    def __init__(self) -> None:
        """Initialize the AI Assistant with knowledge base and OpenAI client."""
        self.knowledge_base = KnowledgeBase()
        self.conversation_store = conversation_store
        self.openai_client: Optional[AsyncOpenAI] = None

        if settings.is_openai_configured():
            self.openai_client = AsyncOpenAI(api_key=settings.openai_api_key)
            logger.info("OpenAI client initialized successfully")
        else:
            logger.warning("OpenAI API key not configured, using rule-based fallback only")

    def is_openai_available(self) -> bool:
        """Check if OpenAI is available."""
        return self.openai_client is not None

    async def generate_response(
        self, 
        message: str, 
        conversation_id: Optional[str] = None
    ) -> ChatResponse:
        """
        Generate AI response using RAG (Retrieval Augmented Generation) with semantic search.

        Args:
            message: User message/question
            conversation_id: Optional conversation ID for context

        Returns:
            ChatResponse with answer, sources, confidence, and mode
        """
        # Store user message in conversation history
        if conversation_id:
            self.conversation_store.add_message(conversation_id, "user", message)
        
        # Search for relevant documents using semantic search
        search_start = time.time()
        relevant_docs = await self.knowledge_base.search_by_semantic(
            message, max_results=settings.max_search_results
        )
        search_time = time.time() - search_start
        logger.info(f"Semantic search completed in {search_time:.2f}s - found {len(relevant_docs)} documents")

        # If no relevant documents found, provide general help
        if not relevant_docs:
            answer = self._get_general_help_message()
            response = ChatResponse(
                answer=answer,
                sources=[],
                confidence=0.5,
                mode="rule-based",
            )
            
            # Store assistant response
            if conversation_id:
                self.conversation_store.add_message(conversation_id, "assistant", answer)
            
            return response

        # Try OpenAI if available
        if self.openai_client:
            try:
                openai_start = time.time()
                response = await self._generate_openai_response(
                    message, 
                    relevant_docs,
                    conversation_id
                )
                openai_time = time.time() - openai_start
                logger.info(f"OpenAI response generation completed in {openai_time:.2f}s")
                
                # Store assistant response
                if conversation_id:
                    self.conversation_store.add_message(conversation_id, "assistant", response.answer)
                
                return response
            except OpenAIError as e:
                logger.error(f"OpenAI API error: {e}")
                # Fall through to rule-based response

        # Fallback to enhanced rule-based responses
        response = self._generate_rule_based_response(message, relevant_docs)
        
        # Store assistant response
        if conversation_id:
            self.conversation_store.add_message(conversation_id, "assistant", response.answer)
        
        return response

    async def generate_response_stream(
        self, 
        message: str,
        conversation_id: Optional[str] = None
    ) -> AsyncGenerator[str, None]:
        """
        Generate AI response with streaming (yields SSE-formatted chunks).

        Args:
            message: User message/question
            conversation_id: Optional conversation ID for context

        Yields:
            SSE-formatted strings with incremental response data
        """
        # Store user message in conversation history
        if conversation_id:
            self.conversation_store.add_message(conversation_id, "user", message)
        
        # Search for relevant documents using semantic search
        search_start = time.time()
        relevant_docs = await self.knowledge_base.search_by_semantic(
            message, max_results=settings.max_search_results
        )
        search_time = time.time() - search_start
        logger.info(f"Semantic search completed in {search_time:.2f}s - found {len(relevant_docs)} documents")

        # Send sources as first event
        yield f"data: {json.dumps({'type': 'sources', 'sources': [doc.model_dump() for doc in relevant_docs]})}\n\n"

        # If no relevant documents found, send general help message
        if not relevant_docs:
            answer = self._get_general_help_message()
            yield f"data: {json.dumps({'type': 'content', 'content': answer})}\n\n"
            yield f"data: {json.dumps({'type': 'done', 'mode': 'rule-based', 'confidence': 0.5})}\n\n"
            
            # Store assistant response
            if conversation_id:
                self.conversation_store.add_message(conversation_id, "assistant", answer)
            
            return

        # Try OpenAI streaming if available
        if self.openai_client:
            try:
                full_response = ""
                async for chunk in self._generate_openai_response_stream(
                    message, 
                    relevant_docs,
                    conversation_id
                ):
                    yield chunk
                    # Accumulate response content for storing
                    try:
                        chunk_data = json.loads(chunk.removeprefix("data: ").strip())
                        if chunk_data.get("type") == "content" and chunk_data.get("content"):
                            full_response += chunk_data["content"]
                    except:
                        pass
                
                # Store complete assistant response
                if conversation_id and full_response:
                    self.conversation_store.add_message(conversation_id, "assistant", full_response)
                
                return
            except OpenAIError as e:
                logger.error(f"OpenAI streaming API error: {e}", exc_info=True)
                error_str = str(e).lower()
                
                # Check if streaming is not supported
                if "stream" in error_str and ("unsupported" in error_str or "not supported" in error_str):
                    logger.info("Streaming not supported, falling back to non-streaming response")
                    # Fall through to non-streaming response below
                else:
                    # For other errors, show user-friendly message
                    error_message = "I encountered an issue processing your request. Please try again."
                    if "rate limit" in error_str or "quota" in error_str:
                        error_message = "I'm currently experiencing high demand. Please try again in a moment."
                    elif "timeout" in error_str:
                        error_message = "The request took too long. Please try a shorter question."
                    
                    yield f"data: {json.dumps({'type': 'error', 'error': error_message})}\n\n"
                    return
            except Exception as e:
                logger.error(f"Unexpected streaming error: {e}", exc_info=True)
                yield f"data: {json.dumps({'type': 'error', 'error': 'An unexpected error occurred. Please try again.'})}\n\n"
                return

        # Fallback to rule-based response (or non-streaming if OpenAI streaming failed)
        if self.openai_client and not relevant_docs:
            # If we got here from streaming failure, try non-streaming OpenAI
            try:
                openai_start = time.time()
                response = await self._generate_openai_response(message, relevant_docs)
                openai_time = time.time() - openai_start
                logger.info(f"Non-streaming fallback completed in {openai_time:.2f}s")
                yield f"data: {json.dumps({'type': 'content', 'content': response.answer})}\n\n"
                yield f"data: {json.dumps({'type': 'done', 'mode': response.mode, 'confidence': response.confidence})}\n\n"
                return
            except Exception as e:
                logger.error(f"Non-streaming fallback also failed: {e}", exc_info=True)
                # Continue to rule-based fallback
        
        # Final fallback: rule-based response
        response = self._generate_rule_based_response(message, relevant_docs)
        yield f"data: {json.dumps({'type': 'content', 'content': response.answer})}\n\n"
        yield f"data: {json.dumps({'type': 'done', 'mode': response.mode, 'confidence': response.confidence})}\n\n"

    async def _generate_openai_response_stream(
        self, 
        message: str, 
        relevant_docs: list[DocumentChunk],
        conversation_id: Optional[str] = None
    ) -> AsyncGenerator[str, None]:
        """Generate streaming response using OpenAI Responses API."""
        # Build context from relevant documents and conversation history
        context = self._build_rag_context(relevant_docs, conversation_id)
        instructions = self._build_system_prompt(context)

        # Build API parameters for streaming
        api_params = {
            "model": settings.openai_model,
            "instructions": instructions,
            "input": message,
            "max_output_tokens": settings.openai_max_tokens,
            "stream": True,
        }
        
        if settings.openai_temperature != 1.0:
            api_params["temperature"] = settings.openai_temperature

        try:
            openai_start = time.time()
            stream = await self.openai_client.responses.create(**api_params)  # type: ignore
            
            async for chunk in stream:
                # Handle different chunk types from Responses API
                if hasattr(chunk, 'type'):
                    if chunk.type == "response.output_item.added":
                        # New output item started
                        continue
                    elif chunk.type == "response.output_item.done":
                        # Output item completed
                        continue
                    elif chunk.type == "response.content_part.added":
                        # New content part
                        continue
                    elif chunk.type == "response.content_part.delta":
                        # Incremental content delta
                        if hasattr(chunk, 'delta') and hasattr(chunk.delta, 'text'):
                            yield f"data: {json.dumps({'type': 'content', 'content': chunk.delta.text})}\n\n"
                    elif chunk.type == "response.done":
                        # Streaming completed
                        openai_time = time.time() - openai_start
                        logger.info(f"OpenAI streaming completed in {openai_time:.2f}s")
                        yield f"data: {json.dumps({'type': 'done', 'mode': 'openai', 'confidence': 0.9})}\n\n"
                        break
                        
        except Exception as e:
            logger.error(f"OpenAI streaming failed: {e}", exc_info=True)
            # Provide user-friendly error message, log details separately
            error_message = "I'm sorry, I encountered an issue generating a response. Please try again."
            
            # Check for specific error types to provide better feedback
            error_str = str(e).lower()
            if "timeout" in error_str or "timed out" in error_str:
                error_message = "The request took too long to complete. Please try again with a shorter question."
            elif "rate limit" in error_str or "quota" in error_str:
                error_message = "I'm currently experiencing high demand. Please try again in a moment."
            elif "unsupported" in error_str or "not supported" in error_str:
                error_message = "This feature is temporarily unavailable. Using a different response method..."
                
            yield f"data: {json.dumps({'type': 'error', 'error': error_message})}\n\n"

    async def _generate_openai_response(
        self, 
        message: str, 
        relevant_docs: list[DocumentChunk],
        conversation_id: Optional[str] = None
    ) -> ChatResponse:
        """Generate response using OpenAI Responses API with RAG context."""
        # Build context from relevant documents and conversation history
        context = self._build_rag_context(relevant_docs, conversation_id)

        instructions = self._build_system_prompt(context)

        # Build API parameters for Responses API
        api_params = {
            "model": settings.openai_model,
            "instructions": instructions,
            "input": message,
            "max_output_tokens": settings.openai_max_tokens,
        }
        
        # Only include temperature if it's not the default
        if settings.openai_temperature != 1.0:
            api_params["temperature"] = settings.openai_temperature

        try:
            response = await self.openai_client.responses.create(**api_params)  # type: ignore
        except Exception as e:
            logger.error(f"OpenAI API call failed: {e}")
            raise

        # Extract answer from response using the output_text helper
        answer = response.output_text if hasattr(response, 'output_text') else None
        
        # Fallback to parsing output items if output_text is not available
        if not answer and hasattr(response, 'output'):
            for item in response.output:
                if item.type == "message" and hasattr(item, 'content'):
                    for content_item in item.content:
                        if content_item.type == "output_text":
                            answer = content_item.text
                            break
                if answer:
                    break
        
        # Log if we got an empty response
        if not answer:
            logger.warning(f"OpenAI returned empty content. Response ID: {response.id if hasattr(response, 'id') else 'unknown'}")
            answer = "I'm sorry, I couldn't generate a response."

        return ChatResponse(
            answer=answer,
            sources=relevant_docs,
            confidence=0.9,
            mode="openai",
        )

    def _build_rag_context(
        self, 
        relevant_docs: list[DocumentChunk],
        conversation_id: Optional[str] = None
    ) -> str:
        """Build context string from relevant documents and conversation history."""
        context_parts = []
        
        # Add conversation history if available
        if conversation_id:
            conversation_context = self.conversation_store.get_conversation_context(
                conversation_id, 
                max_pairs=3  # Include last 3 exchanges
            )
            if conversation_context:
                context_parts.append(conversation_context)
                logger.info(f"Added conversation history to RAG context for {conversation_id}")
        
        # Add relevant documents
        for doc in relevant_docs:
            relevance = (doc.relevance_score or 0) * 100
            context_parts.append(
                f"Source: {doc.title}\n"
                f"Relevance: {relevance:.1f}%\n"
                f"{doc.content}"
            )
        return "\n\n".join(context_parts)

    def _build_system_prompt(self, context: str) -> str:
        """Build system prompt with RAG context."""
        return f"""You are a SMART on FHIR platform assistant with comprehensive knowledge of healthcare application management. Use the provided context to answer questions accurately and helpfully.

Key platform sections:
- Dashboard: System overview and health monitoring
- User Management: Healthcare users and FHIR Person associations  
- SMART Apps: Application registration with scopes and launch contexts
- FHIR Servers: Multi-server configuration and monitoring
- Scope Management: Permission templates and access control
- Launch Context: Clinical workflow context injection
- OAuth Monitoring: Real-time authorization flow analytics
- Identity Providers: SAML/OIDC authentication configuration

Provide helpful, accurate responses with step-by-step guidance when appropriate. Include relevant navigation instructions (e.g., "Go to the Users section") and mention specific features when relevant.

Context (with relevance scores):
{context}"""

    def _generate_rule_based_response(
        self, message: str, relevant_docs: list[DocumentChunk]
    ) -> ChatResponse:
        """Generate enhanced rule-based response with semantic context."""
        message_lower = message.lower()
        primary_doc = relevant_docs[0] if relevant_docs else None
        confidence = 0.7 if primary_doc else 0.6

        # Navigation queries
        if any(word in message_lower for word in ["navigate", "go to", "section", "where"]):
            if any(word in message_lower for word in ["user", "healthcare", "practitioner"]):
                return ChatResponse(
                    answer=self._get_user_management_help(),
                    sources=relevant_docs,
                    confidence=confidence,
                    mode="rule-based",
                )
            elif any(word in message_lower for word in ["app", "smart", "application"]):
                return ChatResponse(
                    answer=self._get_smart_apps_help(),
                    sources=relevant_docs,
                    confidence=confidence,
                    mode="rule-based",
                )
            elif any(word in message_lower for word in ["server", "fhir"]):
                return ChatResponse(
                    answer=self._get_fhir_servers_help(),
                    sources=relevant_docs,
                    confidence=confidence,
                    mode="rule-based",
                )

        # Identity Provider queries
        if any(word in message_lower for word in ["idp", "identity", "authentication", "provider", "saml", "oidc"]):
            return ChatResponse(
                answer=self._get_identity_provider_help(),
                sources=relevant_docs,
                confidence=confidence,
                mode="rule-based",
            )

        # Scope queries
        if any(word in message_lower for word in ["scope", "permission", "access"]):
            return ChatResponse(
                answer=self._get_scope_management_help(),
                sources=relevant_docs,
                confidence=confidence,
                mode="rule-based",
            )

        # Launch context queries
        if any(word in message_lower for word in ["launch", "context"]):
            return ChatResponse(
                answer=self._get_launch_context_help(),
                sources=relevant_docs,
                confidence=confidence,
                mode="rule-based",
            )

        # OAuth monitoring queries
        if any(word in message_lower for word in ["oauth", "monitor", "flow"]):
            return ChatResponse(
                answer=self._get_oauth_monitoring_help(),
                sources=relevant_docs,
                confidence=confidence,
                mode="rule-based",
            )

        # Dashboard queries
        if any(word in message_lower for word in ["dashboard", "overview", "status"]):
            return ChatResponse(
                answer=self._get_dashboard_help(),
                sources=relevant_docs,
                confidence=confidence,
                mode="rule-based",
            )

        # Use primary document for contextual response
        if primary_doc:
            contextual_answer = self._generate_contextual_response(primary_doc, message)
            if contextual_answer:
                return ChatResponse(
                    answer=contextual_answer,
                    sources=relevant_docs,
                    confidence=confidence,
                    mode="rule-based",
                )

        # Default response
        return ChatResponse(
            answer=self._get_general_help_message(),
            sources=relevant_docs,
            confidence=0.6,
            mode="rule-based",
        )

    def _generate_contextual_response(self, doc: DocumentChunk, message: str) -> Optional[str]:
        """Generate contextual response based on the most relevant document."""
        if doc.category == "admin-ui":
            preview = doc.content[:300]
            return (
                f"Based on the {doc.title} documentation:\n\n"
                f"{preview}...\n\n"
                f"Would you like specific guidance on any particular aspect?"
            )
        elif doc.category == "smart-on-fhir":
            preview = doc.content[:300]
            return (
                f"According to the {doc.title} documentation:\n\n"
                f"{preview}...\n\n"
                f"Need help with specific OAuth flows or configuration?"
            )
        return None

    # Helper methods for different sections
    def _get_general_help_message(self) -> str:
        """Get general help message."""
        return """I'm your SMART on FHIR platform assistant! I can help you with:

🎯 **Platform Administration:**
• User management and FHIR associations
• SMART app registration and configuration
• FHIR server setup and monitoring
• OAuth flows and security management

📚 **Specific Topics:**
• Scope configuration and permissions
• Launch context setup for clinical workflows
• Identity provider integration
• System monitoring and troubleshooting

🤖 **AI Status:** Enhanced rule-based responses active

Ask me about any specific aspect you'd like to explore!"""

    def _get_user_management_help(self) -> str:
        """Get user management help message."""
        return """To manage healthcare users, go to the **Users** section in the navigation. There you can:

• Add new healthcare users with professional details
• Associate users with FHIR Person resources across multiple servers
• Configure role-based permissions and access control
• Monitor user activity, sessions, and login patterns
• Manage user lifecycle from activation to termination

💡 *Tip: Each user can have FHIR Person associations on multiple servers for cross-system identity linking.*"""

    def _get_smart_apps_help(self) -> str:
        """Get SMART apps help message."""
        return """To manage SMART applications, go to the **SMART Apps** section. Here you can:

• Register new SMART on FHIR applications with detailed configuration
• Configure OAuth scopes for granular resource access control
• Set up launch contexts for different clinical workflows
• Monitor application usage, performance, and error rates
• Manage application lifecycle, versions, and security settings

🔑 *Key: Proper scope configuration is crucial for security and functionality.*"""

    def _get_fhir_servers_help(self) -> str:
        """Get FHIR servers help message."""
        return """To manage FHIR servers, go to the **FHIR Servers** section. You can:

• Add and configure FHIR server endpoints with authentication
• Monitor server health, performance, and response times
• Test server connectivity and validate FHIR compliance
• Configure security settings and access controls
• View usage analytics and troubleshoot issues

🏥 *Multi-server support allows unified management across your healthcare ecosystem.*"""

    def _get_identity_provider_help(self) -> str:
        """Get identity provider help message."""
        return """To manage Identity Providers, go to the **Identity Providers** section. Here you can:

🔐 **Supported Protocols:**
• **SAML 2.0** - Enterprise single sign-on integration
• **OpenID Connect (OIDC)** - Modern OAuth-based authentication
• **LDAP** - Directory service integration
• **Local Authentication** - Platform-native user accounts

⚙️ **Configuration Options:**
• SSO endpoint configuration and metadata import
• User attribute mapping for FHIR Person associations
• Role-based access control and group mappings
• Multi-factor authentication (MFA) requirements

🏥 *Identity providers enable seamless integration with existing healthcare organization authentication systems.*"""

    def _get_scope_management_help(self) -> str:
        """Get scope management help message."""
        return """SMART scopes control access to FHIR resources. Go to **Scope Management** to configure:

🎯 **Scope Contexts:**
• **patient/** - Patient-specific data access (e.g., patient/Patient.read)
• **user/** - User-accessible resources (e.g., user/Observation.read)
• **system/** - System-wide access (e.g., system/Patient.cruds)
• **agent/** - Autonomous agent access (e.g., agent/Device.read)

📋 **Scope Templates:**
• Role-based templates for different user types
• Specialty-specific scope combinations
• Custom scope sets for organizational needs

💡 *Scopes use CRUD operations (Create, Read, Update, Delete, Search) with 'cruds' for full access.*"""

    def _get_launch_context_help(self) -> str:
        """Get launch context help message."""
        return """Launch contexts provide clinical workflow context to applications. Go to **Launch Context** to:

🏥 **Clinical Contexts:**
• Patient contexts (patient selection, encounters, episodes)
• Provider contexts (practitioner, care team, location)
• Workflow contexts (order entry, results review, documentation)

⚙️ **Configuration:**
• Pre-configured workflow templates
• Custom context builders for specific needs
• Dynamic context resolution at runtime

🚀 *Launch contexts are injected as parameters during application initialization to provide immediate clinical relevance.*"""

    def _get_oauth_monitoring_help(self) -> str:
        """Get OAuth monitoring help message."""
        return """For OAuth monitoring and troubleshooting, go to **OAuth Monitoring** section:

📊 **Real-time Monitoring:**
• Live authorization flow tracking via WebSocket
• Success/failure rate analytics with trending
• Performance metrics and bottleneck identification
• Token usage patterns and refresh analytics

🔧 **Debugging Tools:**
• Flow-by-flow error analysis
• Security violation detection
• Integration testing capabilities

⚡ *The dashboard provides WebSocket-based real-time updates for immediate insight into OAuth activities.*"""

    def _get_dashboard_help(self) -> str:
        """Get dashboard help message."""
        return """The **Dashboard** provides comprehensive platform oversight:

🏥 **System Health:**
• OAuth Server, FHIR Proxy, WebSocket status monitoring
• Performance metrics with response time tracking
• Alert management and maintenance notifications

⚡ **Quick Actions:**
• One-click access to common administrative tasks
• Fast navigation to all platform sections

📈 **Analytics:**
• User, application, and server statistics
• OAuth flow analytics with trend visualization
• Real-time updates every 30 seconds

🎨 *Fully responsive design optimized for desktop, tablet, and mobile usage.*"""


# Singleton instance
ai_assistant = AIAssistant()
