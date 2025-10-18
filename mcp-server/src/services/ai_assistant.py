"""AI Assistant service with OpenAI integration and RAG capabilities."""

import asyncio
import json
import logging
import time
from typing import Any, AsyncGenerator, Dict, Literal, Optional

from openai import AsyncOpenAI, OpenAIError

from config import settings
from models.schemas import ChatResponse, DocumentChunk
from services.knowledge_base import KnowledgeBase
from services.conversation_store import conversation_store
from services.backend_mcp_client import get_backend_client, BackendMCPClient

logger = logging.getLogger(__name__)


def add_additional_properties(schema: Dict[str, Any]) -> Dict[str, Any]:
    """
    Recursively add 'additionalProperties': false to all object schemas
    and ensure 'required' includes all properties for OpenAI strict mode.
    
    OpenAI's structured outputs require:
    1. 'additionalProperties': false at every object level
    2. 'required' array must include ALL properties (no optional fields in strict mode)
    """
    if not isinstance(schema, dict):
        return schema
    
    # Create a copy to avoid modifying the original
    result = schema.copy()
    
    # If this is an object type, add additionalProperties: false
    if result.get("type") == "object":
        result["additionalProperties"] = False
        
        # Ensure 'required' includes all properties for strict mode
        if "properties" in result:
            all_property_keys = list(result["properties"].keys())
            
            # If required array exists but is incomplete, add all properties
            if "required" in result:
                result["required"] = all_property_keys
            # If no required array, create one with all properties
            elif all_property_keys:
                result["required"] = all_property_keys
            
            # Recursively process properties
            result["properties"] = {
                key: add_additional_properties(value)
                for key, value in result["properties"].items()
            }
    
    # Recursively process array items
    if "items" in result:
        result["items"] = add_additional_properties(result["items"])
    
    # Recursively process anyOf, oneOf, allOf
    for key in ["anyOf", "oneOf", "allOf"]:
        if key in result:
            result[key] = [add_additional_properties(item) for item in result[key]]
    
    return result


class AIAssistant:
    """AI Assistant with RAG capabilities for SMART on FHIR platform."""

    def __init__(self) -> None:
        """Initialize the AI Assistant with knowledge base and OpenAI client."""
        self.knowledge_base = KnowledgeBase()
        self.conversation_store = conversation_store
        self.openai_client: Optional[AsyncOpenAI] = None
        self.backend_mcp_client: Optional[BackendMCPClient] = None

        if settings.is_openai_configured():
            self.openai_client = AsyncOpenAI(api_key=settings.openai_api_key)
            logger.info("OpenAI client initialized successfully")
            
            # Backend MCP client will be initialized on first use
            logger.info(f"Backend MCP client will connect to: {settings.backend_api_url}")
        else:
            logger.warning(
                "OpenAI API key not configured, using rule-based fallback only"
            )

    def is_openai_available(self) -> bool:
        """Check if OpenAI is available."""
        return self.openai_client is not None

    async def generate_response(
        self, message: str, conversation_id: Optional[str] = None
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
        logger.info(
            f"Semantic search completed in {search_time:.2f}s - found {len(relevant_docs)} documents"
        )

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
                self.conversation_store.add_message(
                    conversation_id, "assistant", answer
                )

            return response

        # Try OpenAI if available
        if self.openai_client:
            try:
                openai_start = time.time()
                response = await self._generate_openai_response(
                    message, relevant_docs, conversation_id
                )
                openai_time = time.time() - openai_start
                logger.info(
                    f"OpenAI response generation completed in {openai_time:.2f}s"
                )

                # Store assistant response
                if conversation_id:
                    self.conversation_store.add_message(
                        conversation_id, "assistant", response.answer
                    )

                return response
            except OpenAIError as e:
                logger.error(f"OpenAI API error: {e}")
                # Fall through to rule-based response

        # Fallback to enhanced rule-based responses
        response = self._generate_rule_based_response(message, relevant_docs)

        # Store assistant response
        if conversation_id:
            self.conversation_store.add_message(
                conversation_id, "assistant", response.answer
            )

        return response

    async def generate_response_stream(
        self,
        message: str,
        conversation_id: Optional[str] = None,
        page_context: Optional[str] = None,
    ) -> AsyncGenerator[str, None]:
        """
        Generate AI response with streaming (yields SSE-formatted chunks).
        
        Implements proper multi-turn function calling:
        1. Stream initial response with function calls
        2. Execute functions
        3. Make second API call with function outputs
        4. Stream final response

        Args:
            message: User message/question
            conversation_id: Optional conversation ID for context
            page_context: Optional page context (visible content, forms, buttons)

        Yields:
            SSE-formatted strings with incremental response data
        """
        # Store user message in conversation history
        if conversation_id:
            self.conversation_store.add_message(conversation_id, "user", message)

        # Enhance message with page context if provided
        enhanced_message = message
        if page_context:
            enhanced_message = f"{message}\n\n[Current Page Context]\n{page_context}"
            logger.info(
                f"Enhanced message with page context ({len(page_context)} chars)"
            )

        # Search for relevant documents using semantic search
        search_start = time.time()
        relevant_docs = await self.knowledge_base.search_by_semantic(
            enhanced_message, max_results=settings.max_search_results
        )
        search_time = time.time() - search_start
        logger.info(
            f"Semantic search completed in {search_time:.2f}s - found {len(relevant_docs)} documents"
        )

        # Check if backend MCP tools are available
        has_backend_tools = False
        try:
            if self.backend_mcp_client is None:
                self.backend_mcp_client = await get_backend_client()
            
            mcp_tools = await self.backend_mcp_client.list_tools()
            has_backend_tools = len(mcp_tools) > 0
            
            if has_backend_tools:
                logger.info(f"Backend MCP tools available ({len(mcp_tools)} tools), skipping sources in response")
        except Exception as e:
            logger.debug(f"Backend MCP tools not available: {e}")
        
        # Send sources only if NOT using function calls
        # When function calls are available, they provide the data directly,
        # so documentation sources are not relevant
        if not has_backend_tools:
            yield f"data: {json.dumps({'type': 'sources', 'sources': [doc.model_dump() for doc in relevant_docs]})}\n\n"

        # If no relevant documents found, send general help message
        if not relevant_docs:
            answer = self._get_general_help_message()
            yield f"data: {json.dumps({'type': 'content', 'content': answer})}\n\n"
            yield f"data: {json.dumps({'type': 'done', 'mode': 'rule-based', 'confidence': 0.5})}\n\n"

            # Store assistant response
            if conversation_id:
                self.conversation_store.add_message(
                    conversation_id, "assistant", answer
                )

            return

        # Try OpenAI streaming if available
        if self.openai_client:
            try:
                full_response = ""
                async for chunk in self._generate_openai_response_stream_with_tools(
                    enhanced_message, relevant_docs, conversation_id
                ):
                    yield chunk
                    # Accumulate response content for storing
                    try:
                        chunk_data = json.loads(chunk.removeprefix("data: ").strip())
                        if chunk_data.get("type") == "content" and chunk_data.get(
                            "content"
                        ):
                            full_response += chunk_data["content"]
                    except:
                        pass

                # Store complete assistant response
                if conversation_id and full_response:
                    self.conversation_store.add_message(
                        conversation_id, "assistant", full_response
                    )

                return
            except OpenAIError as e:
                logger.error(f"OpenAI streaming API error: {e}", exc_info=True)
                error_str = str(e).lower()

                # Check if streaming is not supported
                if "stream" in error_str and (
                    "unsupported" in error_str or "not supported" in error_str
                ):
                    logger.info(
                        "Streaming not supported, falling back to non-streaming response"
                    )
                    # Fall through to non-streaming response below
                else:
                    # For other errors, show user-friendly message
                    error_message = "I encountered an issue processing your request. Please try again."
                    if "rate limit" in error_str or "quota" in error_str:
                        error_message = "I'm currently experiencing high demand. Please try again in a moment."
                    elif "timeout" in error_str:
                        error_message = (
                            "The request took too long. Please try a shorter question."
                        )

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

    async def _generate_openai_response_stream_with_tools(
        self,
        message: str,
        relevant_docs: list[DocumentChunk],
        conversation_id: Optional[str] = None,
    ) -> AsyncGenerator[str, None]:
        """
        Generate streaming response using OpenAI Responses API with proper multi-turn function calling.
        
        Implements the correct flow from OpenAI documentation:
        1. First API call with tools → stream response and collect function calls
        2. Execute all functions
        3. Second API call with function outputs → stream final response
        """
        # Build context from relevant documents and conversation history
        context = self._build_rag_context(relevant_docs, conversation_id, message)
        instructions = self._build_system_prompt(context)

        # Get backend MCP client and list available tools
        tools = []
        try:
            if self.backend_mcp_client is None:
                self.backend_mcp_client = await get_backend_client()
            
            # Get tools from MCP server
            mcp_tools = await self.backend_mcp_client.list_tools()
            
            # Convert MCP tool format to OpenAI function format
            for tool in mcp_tools:
                # Add additionalProperties: false to schema for OpenAI strict mode
                parameters = add_additional_properties(tool["inputSchema"])
                
                tools.append({
                    "type": "function",
                    "name": tool["name"],
                    "description": tool["description"],
                    "parameters": parameters,
                    "strict": True,
                })
            
            if tools:
                logger.info(f"Added {len(tools)} backend MCP tools to request")
        except Exception as e:
            logger.warning(f"Could not load backend MCP tools: {e}")
            # Continue without tools if MCP connection fails

        # Build input list for first API call
        input_list = [{"role": "user", "content": message}]

        # Build API parameters for first turn
        api_params = {
            "model": settings.openai_model,
            "instructions": instructions,
            "input": input_list,
            "max_output_tokens": settings.openai_max_tokens,
            "stream": True,
        }
        
        # Add reasoning configuration for GPT-5 models
        if "gpt-5" in settings.openai_model.lower() or "o1" in settings.openai_model.lower():
            reasoning_config = {"effort": settings.openai_reasoning_effort}
            if settings.openai_reasoning_summary != "none":
                reasoning_config["summary"] = settings.openai_reasoning_summary
            api_params["reasoning"] = reasoning_config

        if tools:
            api_params["tools"] = tools
        
        if settings.openai_temperature != 1.0:
            api_params["temperature"] = settings.openai_temperature

        try:
            openai_start = time.time()
            stream = await self.openai_client.responses.create(**api_params)  # type: ignore

            # Track first turn
            chunk_count = 0
            function_calls = {}  # Track function call details by item_id
            all_output_items = []  # Collect ALL output items including reasoning
            stream_completed = False

            try:
                async for event in stream:
                    chunk_count += 1
                    
                    if hasattr(event, "type"):
                        event_type = event.type
                    else:
                        continue

                    # Collect ALL output items for second turn (including reasoning)
                    if event_type == "response.output_item.added":
                        if hasattr(event, "item"):
                            item = event.item
                            
                            if item.type == "function_call":
                                # Track function call
                                item_id = item.id
                                function_calls[item_id] = {
                                    "name": item.name if hasattr(item, "name") else None,
                                    "call_id": item.call_id if hasattr(item, "call_id") else None,
                                    "arguments": "",
                                    "complete_item": None,  # Will store complete item later
                                }
                                
                                # Notify user
                                yield f"data: {json.dumps({'type': 'function_calling', 'name': function_calls[item_id]['name']})}\n\n"
                    
                    # Stream reasoning summaries as they arrive
                    elif event_type == "response.reasoning.summary.delta":
                        if hasattr(event, "delta"):
                            reasoning_text = event.delta
                            # Stream reasoning as "thinking" indicator
                            yield f"data: {json.dumps({'type': 'reasoning', 'content': reasoning_text})}\n\n"
                    
                    elif event_type == "response.reasoning.summary.done":
                        if hasattr(event, "summary"):
                            # Mark reasoning as complete
                            yield f"data: {json.dumps({'type': 'reasoning_done'})}\n\n"
                    
                    # Capture complete output items (including reasoning)
                    elif event_type == "response.output_item.done":
                        if hasattr(event, "item"):
                            item = event.item
                            # Use exclude_none to avoid passing fields like status
                            item_dict = item.model_dump(exclude_none=True, exclude_unset=True)
                            all_output_items.append(item_dict)
                            
                            # Store complete function call items
                            if item.type == "function_call" and hasattr(item, "id"):
                                item_id = item.id
                                if item_id in function_calls:
                                    function_calls[item_id]["complete_item"] = item_dict
                    
                    # Accumulate function arguments
                    elif event_type == "response.function_call_arguments.delta":
                        if hasattr(event, "item_id") and hasattr(event, "delta"):
                            item_id = event.item_id
                            if item_id in function_calls:
                                function_calls[item_id]["arguments"] += event.delta
                    
                    # Function call complete
                    elif event_type == "response.function_call_arguments.done":
                        if hasattr(event, "item_id") and hasattr(event, "arguments"):
                            item_id = event.item_id
                            if item_id in function_calls:
                                function_calls[item_id]["arguments"] = event.arguments
                    
                    # Stream text from first turn
                    elif event_type == "response.output_text.delta":
                        if hasattr(event, "delta"):
                            delta_value = event.delta
                            if delta_value:
                                yield f"data: {json.dumps({'type': 'content', 'content': delta_value})}\n\n"
                    
                    # First turn complete
                    elif event_type == "response.completed":
                        stream_completed = True
                        break
            
            except Exception as stream_error:
                logger.error(f"[TURN 1] Error during stream iteration: {stream_error}", exc_info=True)
                raise
            
            # If no function calls, we're done
            if not function_calls:
                yield f"data: {json.dumps({'type': 'done', 'mode': 'openai', 'confidence': 0.9})}\n\n"
                return

            # TURN 2: Execute functions
            logger.info(f"[TURN 2] Executing {len(function_calls)} function(s)")
            
            function_outputs = []
            for item_id, fc_data in function_calls.items():
                try:
                    func_name = fc_data["name"]
                    args_str = fc_data["arguments"]
                    
                    logger.info(f"Executing: {func_name}({args_str})")
                    
                    # Parse arguments
                    args = json.loads(args_str) if args_str else {}
                    
                    # Execute function via MCP client
                    if self.backend_mcp_client is None:
                        self.backend_mcp_client = await get_backend_client()
                    
                    result = await self.backend_mcp_client.call_tool(func_name, args)
                    
                    logger.info(f"Function {func_name} returned: {result}")
                    
                    # Notify user
                    yield f"data: {json.dumps({'type': 'function_executed', 'name': func_name, 'success': True})}\n\n"
                    
                    # Build function output
                    function_outputs.append({
                        "type": "function_call_output",
                        "call_id": fc_data["call_id"],
                        "output": json.dumps({"result": result})
                    })
                    
                except Exception as e:
                    error_msg = f"Error: {str(e)}"
                    logger.error(f"Function execution failed: {error_msg}", exc_info=True)
                    
                    yield f"data: {json.dumps({'type': 'function_executed', 'name': fc_data['name'], 'success': False, 'error': error_msg})}\n\n"
                    
                    function_outputs.append({
                        "type": "function_call_output",
                        "call_id": fc_data["call_id"],
                        "output": json.dumps({"error": error_msg})
                    })

            # Build input for second API call
            # For reasoning models (GPT-5), ALL output items from first turn must be included
            # This includes reasoning items that function calls depend on
            second_input = input_list.copy()
            
            # Add ALL output items exactly as received (required for reasoning models)
            # Per OpenAI docs: "any reasoning items returned in model responses with tool calls 
            # must also be passed back with tool call outputs"
            second_input.extend(all_output_items)
            
            # Add function outputs
            second_input.extend(function_outputs)
            
            # Second API call parameters
            second_params = {
                "model": settings.openai_model,
                "instructions": instructions,
                "input": second_input,
                "max_output_tokens": settings.openai_max_tokens,
                "stream": True,
            }
            
            # Add reasoning configuration for GPT-5 models (second turn)
            if "gpt-5" in settings.openai_model.lower() or "o1" in settings.openai_model.lower():
                reasoning_config = {"effort": settings.openai_reasoning_effort}
                if settings.openai_reasoning_summary != "none":
                    reasoning_config["summary"] = settings.openai_reasoning_summary
                second_params["reasoning"] = reasoning_config
            
            if tools:
                second_params["tools"] = tools
            
            if settings.openai_temperature != 1.0:
                second_params["temperature"] = settings.openai_temperature

            # Make second API call
            logger.info(f"[TURN 2] About to create second stream...")
            second_stream = await self.openai_client.responses.create(**second_params)  # type: ignore
            logger.info(f"[TURN 2] Second stream created: {type(second_stream)}")

            # Stream final response
            chunk_count_turn2 = 0
            has_content = False
            last_10_event_types = []  # Track last 10 event types for debugging
            stream_completed_turn2 = False
            
            try:
                async for event in second_stream:
                    chunk_count_turn2 += 1
                    
                    if hasattr(event, "type"):
                        event_type = event.type
                    
                    # Track event types for debugging
                    last_10_event_types.append(event_type)
                    if len(last_10_event_types) > 10:
                        last_10_event_types.pop(0)
                    
                    # Log first few events and every 50th event for debugging
                    if chunk_count_turn2 <= 5 or chunk_count_turn2 % 50 == 0:
                        logger.debug(f"[TURN 2] Event {chunk_count_turn2}: {event_type}")
                    
                    # Stream reasoning summaries (second turn)
                    if event_type == "response.reasoning.summary.delta":
                        if hasattr(event, "delta"):
                            reasoning_text = event.delta
                            logger.debug(f"[TURN 2] Reasoning summary delta: {reasoning_text[:50]}...")
                            yield f"data: {json.dumps({'type': 'reasoning', 'content': reasoning_text})}\n\n"
                    
                    elif event_type == "response.reasoning.summary.done":
                        logger.info(f"[TURN 2] Reasoning summary complete")
                        yield f"data: {json.dumps({'type': 'reasoning_done'})}\n\n"
                    
                    # Stream final text - handle both output_text and content deltas
                    elif event_type == "response.output_text.delta":
                        if hasattr(event, "delta"):
                            delta_value = event.delta
                            if delta_value:
                                has_content = True
                                logger.debug(f"[TURN 2] Got output_text.delta: {delta_value[:50] if len(delta_value) > 50 else delta_value}")
                                yield f"data: {json.dumps({'type': 'content', 'content': delta_value})}\n\n"
                    
                    # Handle output item added (may contain initial content)
                    elif event_type == "response.output_item.added":
                        logger.debug(f"[TURN 2] Output item added: {getattr(event, 'item', {})}")
                    
                    # Handle output item done (may contain complete content)
                    elif event_type == "response.output_item.done":
                        if hasattr(event, "item"):
                            item = event.item
                            # Check if this is a text/message item with content
                            if hasattr(item, "type") and item.type in ["message", "text"]:
                                if hasattr(item, "content"):
                                    # Content might be a list or string
                                    content = item.content
                                    if isinstance(content, list):
                                        for content_part in content:
                                            if hasattr(content_part, "text"):
                                                text = content_part.text
                                                if text and not has_content:  # Only use if we haven't streamed yet
                                                    logger.info(f"[TURN 2] Extracting text from output_item.done ({len(text)} chars)")
                                                    yield f"data: {json.dumps({'type': 'content', 'content': text})}\n\n"
                                                    has_content = True
                                    elif isinstance(content, str):
                                        if content and not has_content:
                                            logger.info(f"[TURN 2] Extracting string content from output_item.done ({len(content)} chars)")
                                            yield f"data: {json.dumps({'type': 'content', 'content': content})}\n\n"
                                            has_content = True
                                elif hasattr(item, "text"):
                                    text = item.text
                                    if text and not has_content:
                                        logger.info(f"[TURN 2] Extracting text from output_item.done.text ({len(text)} chars)")
                                        yield f"data: {json.dumps({'type': 'content', 'content': text})}\n\n"
                                        has_content = True
                    
                    # Final response complete
                    elif event_type == "response.completed":
                        logger.info(f"[TURN 2] Final response complete (has_content={has_content})")
                        logger.info(f"[TURN 2] Last 10 event types: {last_10_event_types}")
                        openai_time = time.time() - openai_start
                        logger.info(f"Total OpenAI streaming completed in {openai_time:.2f}s")
                        logger.info(f"[TURN 2] Total events processed: {chunk_count_turn2}")
                        
                        # If no content was streamed, check if there's content in the completed event
                        if not has_content:
                            logger.warning("[TURN 2] No content streamed, checking completed event for content")
                            if hasattr(event, "response"):
                                response_obj = event.response
                                logger.debug(f"[TURN 2] Response object: {response_obj}")
                                
                                if hasattr(response_obj, "output"):
                                    logger.debug(f"[TURN 2] Found output array with {len(response_obj.output)} items")
                                    for idx, output_item in enumerate(response_obj.output):
                                        logger.debug(f"[TURN 2] Output item {idx}: type={getattr(output_item, 'type', 'unknown')}")
                                        
                                        # Check for text in various possible locations
                                        if hasattr(output_item, "content"):
                                            content = output_item.content
                                            if isinstance(content, list):
                                                for content_part in content:
                                                    if hasattr(content_part, "text"):
                                                        text = content_part.text
                                                        if text:
                                                            logger.info(f"[TURN 2] Yielding complete response text from output[{idx}].content[].text ({len(text)} chars)")
                                                            yield f"data: {json.dumps({'type': 'content', 'content': text})}\n\n"
                                                            has_content = True
                                            elif isinstance(content, str):
                                                logger.info(f"[TURN 2] Yielding complete response text from output[{idx}].content ({len(content)} chars)")
                                                yield f"data: {json.dumps({'type': 'content', 'content': content})}\n\n"
                                                has_content = True
                                        
                                        # Also check for direct text property
                                        if not has_content and hasattr(output_item, "text"):
                                            text = output_item.text
                                            if text:
                                                logger.info(f"[TURN 2] Yielding complete response text from output[{idx}].text ({len(text)} chars)")
                                                yield f"data: {json.dumps({'type': 'content', 'content': text})}\n\n"
                                                has_content = True
                                
                                # Check for output_text property
                                if not has_content and hasattr(response_obj, "output_text"):
                                    text = response_obj.output_text
                                    if text:
                                        logger.info(f"[TURN 2] Yielding complete response from output_text ({len(text)} chars)")
                                        yield f"data: {json.dumps({'type': 'content', 'content': text})}\n\n"
                                        has_content = True
                        
                        if not has_content:
                            logger.error("[TURN 2] ERROR: No content found in completed response!")
                            yield f"data: {json.dumps({'type': 'error', 'error': 'No content received from AI after function execution'})}\n\n"
                        
                        stream_completed_turn2 = True
                        yield f"data: {json.dumps({'type': 'done', 'mode': 'openai-with-tools', 'confidence': 0.9})}\n\n"
                        break
            
            except Exception as stream_error:
                logger.error(f"[TURN 2] Error during stream iteration: {stream_error}", exc_info=True)
                raise
            
            if not stream_completed_turn2:
                logger.warning(f"[TURN 2] Stream ended without response.completed event after {chunk_count_turn2} events")
            
            logger.info(f"[TURN 2] Finished iterating stream, processed {chunk_count_turn2} events total, has_content={has_content}")

        except Exception as e:
            logger.error(f"OpenAI streaming failed: {e}", exc_info=True)
            error_message = "I'm sorry, I encountered an issue generating a response. Please try again."

            error_str = str(e).lower()
            if "timeout" in error_str or "timed out" in error_str:
                error_message = "The request took too long to complete. Please try again with a shorter question."
            elif "rate limit" in error_str or "quota" in error_str:
                error_message = "I'm currently experiencing high demand. Please try again in a moment."

            yield f"data: {json.dumps({'type': 'error', 'error': error_message})}\n\n"

    async def _generate_openai_response(
        self,
        message: str,
        relevant_docs: list[DocumentChunk],
        conversation_id: Optional[str] = None,
    ) -> ChatResponse:
        """Generate response using OpenAI Responses API with RAG context."""
        # Build context from relevant documents and conversation history
        context = self._build_rag_context(relevant_docs, conversation_id, message)

        instructions = self._build_system_prompt(context)

        # Build API parameters for Responses API
        api_params = {
            "model": settings.openai_model,
            "instructions": instructions,
            "input": message,
            "max_output_tokens": settings.openai_max_tokens,
        }
        
        # Add function calling tools if backend MCP client is available
        try:
            if self.backend_mcp_client is None:
                self.backend_mcp_client = await get_backend_client()
            
            mcp_tools = await self.backend_mcp_client.list_tools()
            if mcp_tools:
                # Convert MCP tool format to OpenAI function format
                tools = []
                for tool in mcp_tools:
                    # Add additionalProperties: false to schema for OpenAI strict mode
                    parameters = add_additional_properties(tool["inputSchema"])
                    
                    tools.append({
                        "type": "function",
                        "name": tool["name"],
                        "description": tool["description"],
                        "parameters": parameters,
                        "strict": True,
                    })
                api_params["tools"] = tools
                logger.info(f"Added {len(tools)} backend MCP tools to OpenAI request")
        except Exception as e:
            logger.warning(f"Could not load backend MCP tools: {e}")

        # Only include temperature if it's not the default
        if settings.openai_temperature != 1.0:
            api_params["temperature"] = settings.openai_temperature

        try:
            response = await self.openai_client.responses.create(**api_params)  # type: ignore

            # Log token usage if available
            if hasattr(response, "usage") and response.usage:
                usage = response.usage
                logger.info(
                    f"OpenAI token usage - "
                    f"Input: {usage.input_tokens if hasattr(usage, 'input_tokens') else 'N/A'}, "
                    f"Output: {usage.output_tokens if hasattr(usage, 'output_tokens') else 'N/A'}, "
                    f"Total: {usage.total_tokens if hasattr(usage, 'total_tokens') else 'N/A'}"
                )
        except Exception as e:
            logger.error(f"OpenAI API call failed: {e}")
            raise

        # Extract answer from response using the output_text helper
        answer = response.output_text if hasattr(response, "output_text") else None

        # Fallback to parsing output items if output_text is not available
        if not answer and hasattr(response, "output"):
            for item in response.output:
                if item.type == "message" and hasattr(item, "content"):
                    for content_item in item.content:
                        if content_item.type == "output_text":
                            answer = content_item.text
                            break
                if answer:
                    break

        # Log if we got an empty response
        if not answer:
            logger.warning(
                f"OpenAI returned empty content. Response ID: {response.id if hasattr(response, 'id') else 'unknown'}"
            )
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
        conversation_id: Optional[str] = None,
        current_message: str = ""
    ) -> str:
        """Build context string from relevant documents and conversation history."""
        context_parts = []

        # Add conversation history if available
        if conversation_id:
            # Check if conversation needs summarization based on context pressure
            if self.conversation_store.check_needs_summarization(conversation_id, current_message):
                logger.info(f"Conversation {conversation_id} has context pressure - triggering AI summary")
                asyncio.create_task(self._summarize_conversation_async(conversation_id))
            
            conversation_context = self.conversation_store.get_conversation_context(
                conversation_id,
                current_input=current_message
            )
            if conversation_context:
                context_parts.append(conversation_context)
                logger.info(
                    f"Added conversation history to RAG context for {conversation_id}"
                )

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
        return f"""You are a helpful SMART on FHIR platform assistant with comprehensive knowledge of healthcare application management. Use the provided context to answer questions accurately and concisely.

IMPORTANT PAGE CONTEXT RULES:
- Page context is provided automatically but should ONLY be used when the user's question is DIRECTLY ABOUT THE CURRENT PAGE
- DO NOT describe or summarize the current page unless the user explicitly asks about it (e.g., "what's on this page?", "what can I do here?")

CONVERSATION MEMORY:
- Remember the full conversation history - if the user says "again" or refers to a previous question, recall what they asked before
- When a user asks for something "again", repeat your PREVIOUS ANSWER
- Long messages are automatically summarized in conversation history with [index] numbers
- If you see a message like "[5] User asked: ...", the full content of message #5 can be retrieved if needed
- You have access to get_full_message(conversation_id, message_index) to retrieve complete message content
- Use this when you need more detail about a previous exchange that was summarized

ACTION EXECUTION:
When the user asks you to perform an action (create, update, delete, modify), DO IT IMMEDIATELY using the available tools. Don't ask for confirmation unless:
- The action is destructive (deletion, disabling accounts)
- The request is ambiguous or missing required information

When the user says "yes" or confirms an action, execute it right away. Be proactive and helpful.

INTERACTIVE ACTIONS - IMPORTANT:
You can provide interactive buttons, links, and forms in your responses! Use these special syntax patterns or check the knowledge base for examples:

1. NAVIGATION (to different tabs in the app):
   [action:navigate:Button Label:tab-name]
   Valid tabs: dashboard, smart-apps, users, fhir-servers, idp, scopes, launch-context, oauth-monitoring
   Example: "You can manage users here: [action:navigate:Go to Users:users]"

2. REFRESH PAGE:
   [action:refresh:Button Label]
   Example: "After making changes, [action:refresh:Refresh Page] to see updates"

3. EXTERNAL LINKS (opens in new tab):
   [action:external:Button Label:URL]
   Example: "See the [action:external:SMART App Launch Spec:https://hl7.org/fhir/smart-app-launch/] for details"

4. API CALLS (simple GET/POST/PUT/DELETE):
   [action:api:Button Label:METHOD:endpoint]
   Example: "[action:api:Fetch Stats:GET:/admin/oauth/stats]"

5. API CALLS WITH FORMS (collect user input first):
   [action:api:Button Label:METHOD:endpoint:field1|type|label|required,field2|type|label|required]
   Field types: text, email, number, select
   Example: "[action:api:Create User:POST:/admin/users:name|text|Full Name|true,email|email|Email|true,role|select|Role|true|admin;user;viewer]"

6. STANDALONE FORMS:
   [action:form:Button Label:field1|type|label|required,field2|type|label|required]
   
EXAMPLE:

Q: "How do I add a user?"
A: "I can create a user for you or help you create a new user. Please provide the details:

[action:api:Create User:POST:/admin/users:name|text|Full Name|true,email|email|Email Address|true,role|select|User Role|true|admin;user]

Or manage users manually: [action:navigate:Go to User Management:users]"

Key platform sections:
- Dashboard: System overview and health monitoring
- User Management: Healthcare users and FHIR Person associations  
- SMART Apps: Application registration with scopes and launch contexts
- FHIR Servers: Multi-server configuration and monitoring
- Scope Management: Permission templates and access control
- Launch Context: Clinical workflow context injection
- OAuth Monitoring: Real-time authorization flow analytics
- Identity Providers: SAML/OIDC authentication configuration

Provide helpful, accurate responses. Be concise and direct. Use interactive actions to make your responses actionable!

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
        if any(
            word in message_lower for word in ["navigate", "go to", "section", "where"]
        ):
            if any(
                word in message_lower for word in ["user", "healthcare", "practitioner"]
            ):
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
        if any(
            word in message_lower
            for word in [
                "idp",
                "identity",
                "authentication",
                "provider",
                "saml",
                "oidc",
            ]
        ):
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

    def _generate_contextual_response(
        self, doc: DocumentChunk, message: str
    ) -> Optional[str]:
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

    async def _summarize_conversation_async(self, conversation_id: str) -> None:
        """
        Generate AI summary of conversation history (background task).
        
        This runs asynchronously to avoid blocking the main response.
        Summary is stored and will be used in future context windows.
        """
        try:
            if not self.openai_client:
                logger.warning("OpenAI not available - cannot generate conversation summary")
                return
            
            # Get messages that need summarization
            messages_to_summarize = self.conversation_store.get_messages_for_summarization(
                conversation_id
            )
            
            if not messages_to_summarize:
                logger.debug(f"No messages to summarize for {conversation_id}")
                return
            
            # Build conversation text
            conversation_text = "\n\n".join([
                f"[{msg.index}] {msg.role.title()}: {msg.content}"
                for msg in messages_to_summarize
            ])
            
            # Call OpenAI to generate summary
            logger.info(f"Generating AI summary for {len(messages_to_summarize)} messages...")
            
            response = await self.openai_client.chat.completions.create(
                model=settings.openai_model,
                messages=[
                    {
                        "role": "system",
                        "content": """Summarize this conversation history concisely. 
Extract key topics discussed, decisions made, and important context.
Keep it under 500 words. Use bullet points for clarity."""
                    },
                    {
                        "role": "user",
                        "content": f"Summarize this conversation:\n\n{conversation_text}"
                    }
                ],
                max_tokens=800,
                temperature=0.3  # Low temperature for consistent summaries
            )
            
            summary = response.choices[0].message.content
            if summary:
                up_to_index = messages_to_summarize[-1].index or 0
                self.conversation_store.store_summary(
                    conversation_id, 
                    summary, 
                    up_to_index
                )
                logger.info(
                    f"AI summary generated and stored for conversation {conversation_id} "
                    f"(messages 1-{up_to_index})"
                )
            
        except Exception as e:
            logger.error(f"Failed to generate conversation summary: {e}", exc_info=True)


# Singleton instance
ai_assistant = AIAssistant()
