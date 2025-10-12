"""Knowledge base service for storing and searching documentation."""

import hashlib
import logging
from functools import lru_cache
from typing import List, Optional
import numpy as np
from openai import AsyncOpenAI

from models.schemas import DocumentChunk
from config import settings

logger = logging.getLogger(__name__)


class KnowledgeBase:
    """Manages the documentation knowledge base for RAG with semantic search."""

    def __init__(self) -> None:
        """Initialize the knowledge base with documentation chunks."""
        self.documents: List[DocumentChunk] = self._load_documents()
        self.embeddings: Optional[np.ndarray] = None
        self.openai_client: Optional[AsyncOpenAI] = None
        self._embedding_cache: dict[str, np.ndarray] = {}  # Cache for query embeddings
        self._cache_max_size: int = 100  # Keep last 100 queries
        
        if settings.is_openai_configured():
            self.openai_client = AsyncOpenAI(api_key=settings.openai_api_key)
            logger.info("OpenAI client initialized for embeddings")

    async def initialize_embeddings(self) -> None:
        """Generate embeddings for all documents (called once at startup)."""
        if not self.openai_client or self.embeddings is not None:
            return
            
        try:
            logger.info(f"Generating embeddings for {len(self.documents)} documents...")
            texts = [doc.content for doc in self.documents]
            
            # Generate embeddings in batch
            response = await self.openai_client.embeddings.create(
                model=settings.openai_embedding_model,
                input=texts,
                dimensions=settings.openai_embedding_dimensions
            )
            
            # Convert to numpy array for efficient similarity computation
            self.embeddings = np.array([item.embedding for item in response.data])
            logger.info(f"Successfully generated {len(self.embeddings)} embeddings")
            
        except Exception as e:
            logger.error(f"Failed to generate embeddings: {e}")
            self.embeddings = None

    def _get_cache_key(self, text: str) -> str:
        """Generate a cache key for a text query."""
        # Normalize: lowercase and strip whitespace
        normalized = text.lower().strip()
        # Use hash for consistent key length
        return hashlib.md5(normalized.encode()).hexdigest()

    async def _get_or_generate_embedding(self, query: str) -> Optional[np.ndarray]:
        """Get cached embedding or generate new one for query."""
        if not self.openai_client:
            return None
        
        cache_key = self._get_cache_key(query)
        
        # Check cache first
        if cache_key in self._embedding_cache:
            logger.info(f"✓ Embedding cache HIT for query: {query[:50]}...")
            return self._embedding_cache[cache_key]
        
        # Generate new embedding
        try:
            logger.info(f"✗ Embedding cache MISS, generating for: {query[:50]}...")
            response = await self.openai_client.embeddings.create(
                model=settings.openai_embedding_model,
                input=[query],
                dimensions=settings.openai_embedding_dimensions
            )
            embedding = np.array(response.data[0].embedding)
            
            # Cache the embedding
            self._embedding_cache[cache_key] = embedding
            
            # Maintain cache size limit (simple LRU: remove oldest if full)
            if len(self._embedding_cache) > self._cache_max_size:
                # Remove first item (oldest in dict order for Python 3.7+)
                oldest_key = next(iter(self._embedding_cache))
                del self._embedding_cache[oldest_key]
                logger.debug(f"Cache full, removed oldest entry")
            
            return embedding
            
        except Exception as e:
            logger.error(f"Failed to generate query embedding: {e}")
            return None

    def _load_documents(self) -> List[DocumentChunk]:
        """Load all documentation chunks into memory."""
        return [
            # Dashboard Documentation
            DocumentChunk(
                id="dashboard-overview",
                title="Dashboard Overview",
                category="admin-ui",
                source="docs/admin-ui/dashboard.md",
                content=(
                    "The Dashboard is the central hub providing comprehensive overview of "
                    "healthcare platform status, metrics, and quick access to all management "
                    "functions. It displays real-time system health indicators including active "
                    "components (OAuth Server, FHIR Proxy, WebSocket), performance metrics, "
                    "alerts, and last update timestamps. The dashboard provides quick actions "
                    "for adding users, registering apps, adding FHIR servers, configuring "
                    "scopes, managing launch contexts, and monitoring OAuth flows."
                ),
                relevance_score=None,
            ),
            # User Management
            DocumentChunk(
                id="user-management-overview",
                title="User Management",
                category="admin-ui",
                source="docs/admin-ui/user-management.md",
                content=(
                    "User Management provides comprehensive tools for managing healthcare users "
                    "including practitioners, administrative staff, system users, and external "
                    "users. It supports user registration with personal details, professional "
                    "info, and account configuration. Key features include FHIR Person "
                    "associations across multiple servers, role-based access control with "
                    "administrator and user roles, user activity tracking, and lifecycle "
                    "management including activation, password management, and termination."
                ),
                relevance_score=None,
            ),
            # SMART Apps
            DocumentChunk(
                id="smart-apps-management",
                title="SMART Apps Management",
                category="admin-ui",
                source="docs/admin-ui/smart-apps.md",
                content=(
                    "SMART Apps section manages SMART on FHIR applications including "
                    "patient-facing apps, provider apps, EHR integrated apps, research apps, "
                    "agent apps, and backend services. It supports EHR launch, standalone "
                    "launch, backend services, and agent launch types. Application registration "
                    "includes basic information, technical configuration, and scope configuration "
                    "with FHIR resource scopes for patient, user, system, and agent contexts."
                ),
                relevance_score=None,
            ),
            # SMART on FHIR Framework
            DocumentChunk(
                id="smart-app-launch-framework",
                title="SMART App Launch Framework",
                category="smart-on-fhir",
                source="docs/smart-on-fhir/smart-app-launch.md",
                content=(
                    "SMART App Launch Framework enables secure integration of healthcare "
                    "applications with EHR systems using OAuth 2.0. It supports different launch "
                    "types: EHR launch from within EHR systems, standalone launch for "
                    "independent applications, and backend services for server-to-server "
                    "communication. The framework provides clinical context through launch "
                    "parameters including patient, encounter, user, and organization context."
                ),
                relevance_score=None,
            ),
            # OAuth Flows
            DocumentChunk(
                id="oauth-flows",
                title="OAuth 2.0 Flows",
                category="smart-on-fhir",
                source="docs/smart-on-fhir/oauth-flows.md",
                content=(
                    "OAuth 2.0 flows in SMART on FHIR include Authorization Code flow for "
                    "interactive applications, Client Credentials flow for backend services, "
                    "and Agent flow for autonomous systems. Each flow has specific security "
                    "requirements including PKCE for public clients, client authentication for "
                    "confidential clients, and scope validation for resource access control."
                ),
                relevance_score=None,
            ),
            # Scopes and Permissions
            DocumentChunk(
                id="scopes-permissions",
                title="Scopes and Permissions",
                category="smart-on-fhir",
                source="docs/smart-on-fhir/scopes-permissions.md",
                content=(
                    "SMART scopes define access permissions for FHIR resources using context "
                    "prefixes: patient/ for patient-specific data, user/ for user-accessible "
                    "resources, system/ for system-wide access, and agent/ for autonomous agent "
                    "access. Scopes include resource type and operation (read, write, cruds). "
                    "Examples: patient/Patient.read, user/Observation.read, system/Patient.cruds, "
                    "agent/Device.read."
                ),
                relevance_score=None,
            ),
            # Launch Contexts
            DocumentChunk(
                id="launch-contexts",
                title="Launch Contexts",
                category="smart-on-fhir",
                source="docs/smart-on-fhir/launch-contexts.md",
                content=(
                    "Launch contexts provide clinical workflow context to SMART applications. "
                    "Context types include patient context (specific patient, patient list, "
                    "encounter, episode), provider context (practitioner, care team, "
                    "organization, location), and workflow context (order entry, results review, "
                    "documentation, research). Contexts are injected via launch parameters during "
                    "application initialization."
                ),
                relevance_score=None,
            ),
            # Agent Scopes
            DocumentChunk(
                id="agent-scopes",
                title="Agent Scopes for Autonomous Systems",
                category="smart-on-fhir",
                source="docs/smart-on-fhir/agent-scopes.md",
                content=(
                    "Agent scopes (agent/) are designed for autonomous systems including AI "
                    "assistants, robots, and automated decision tools. Unlike system/ scopes "
                    "which are deterministic and scheduled, agent/ scopes support "
                    "non-deterministic, self-initiated actions. Agent identity is resolved to "
                    "Device resources at runtime. Examples: agent/Patient.read for AI patient "
                    "analysis, agent/ClinicalImpression.write for AI-generated assessments."
                ),
                relevance_score=None,
            ),
            # Identity Providers
            DocumentChunk(
                id="identity-providers",
                title="Identity Providers Management",
                category="admin-ui",
                source="docs/admin-ui/identity-providers.md",
                content=(
                    "Identity Providers (IdP) section manages authentication systems for "
                    "healthcare organizations. Supports SAML 2.0 for enterprise SSO, OpenID "
                    "Connect (OIDC) for modern OAuth-based authentication, LDAP for directory "
                    "services, and local authentication. Features include SSO endpoint "
                    "configuration, metadata import/export, user attribute mapping for FHIR "
                    "Person associations, role-based access control, group mappings, multi-factor "
                    "authentication (MFA) requirements, and session management. Enables seamless "
                    "integration with existing organizational authentication infrastructure."
                ),
                relevance_score=None,
            ),
            # Platform Navigation
            DocumentChunk(
                id="platform-navigation",
                title="Platform Navigation and Features",
                category="admin-ui",
                source="docs/admin-ui/navigation.md",
                content=(
                    "The platform provides comprehensive navigation with sections for Dashboard "
                    "(system overview), SMART Apps (application management), Users (healthcare "
                    "user management), FHIR Servers (server configuration), Identity Providers "
                    "(IdP management), Scope Management (permission templates), Launch Context "
                    "(context configuration), and OAuth Monitoring (real-time analytics). Each "
                    "section provides specialized tools for healthcare platform administration."
                ),
                relevance_score=None,
            ),
            # Getting Started Guide
            DocumentChunk(
                id="getting-started-guide",
                title="Getting Started with SMART on FHIR Platform",
                category="tutorials",
                source="docs/tutorials/getting-started.md",
                content=(
                    "Getting started guide covers platform setup and configuration. Key steps: "
                    "1) Review Dashboard for system health, 2) Configure FHIR servers with base "
                    "URL and authentication, 3) Set up identity providers (SAML, OIDC), 4) Create "
                    "user accounts and associate with FHIR Person resources, 5) Register SMART "
                    "apps with scopes and launch contexts, 6) Test OAuth flows and FHIR access. "
                    "Includes security best practices, monitoring setup, and go-live checklist. "
                    "Use AI Assistant for help with specific tasks."
                ),
                relevance_score=None,
            ),
            # FHIR Servers
            DocumentChunk(
                id="fhir-servers-management",
                title="FHIR Servers Management",
                category="admin-ui",
                source="docs/admin-ui/fhir-servers.md",
                content=(
                    "FHIR Servers section manages FHIR server connections, health monitoring, "
                    "and configuration. Supports EHR systems (Epic, Cerner), cloud FHIR services, "
                    "open source servers, and test environments. Features include server "
                    "registration with base URL and FHIR version, authentication methods (API "
                    "key, OAuth 2.0, client certificates), health monitoring with real-time "
                    "checks, performance metrics tracking, and security settings. Provides bulk "
                    "data operations, SMART launch context support, and comprehensive "
                    "troubleshooting tools."
                ),
                relevance_score=None,
            ),
            # Scope Management
            DocumentChunk(
                id="scope-management-detailed",
                title="Scope Management and Permissions",
                category="admin-ui",
                source="docs/admin-ui/scope-management.md",
                content=(
                    "Scope Management provides granular FHIR resource permissions using "
                    "context/resource.operations pattern. Context prefixes include patient/ "
                    "(patient-specific), user/ (user-accessible), system/ (backend system), and "
                    "agent/ (autonomous AI). Common resources include Patient, Observation, "
                    "MedicationRequest, DiagnosticReport, Condition, Procedure. Operations are "
                    "read, write, cruds, search. Features role-based templates for clinical roles "
                    "(physicians, nurses) and administrative roles, custom template creation, "
                    "organizational scope management, and compliance reporting."
                ),
                relevance_score=None,
            ),
            # Common Administrative Tasks
            DocumentChunk(
                id="common-administrative-tasks",
                title="Common Administrative Tasks",
                category="tutorials",
                source="docs/tutorials/common-tasks.md",
                content=(
                    "Common tasks include: 1) Registering SMART apps with appropriate scopes and "
                    "launch contexts, 2) Adding healthcare users and associating with FHIR Person "
                    "resources, 3) Configuring FHIR servers with health monitoring, 4) Setting up "
                    "scope templates for different user roles, 5) Creating launch contexts for "
                    "clinical workflows, 6) Monitoring OAuth flows for troubleshooting, 7) "
                    "Managing identity providers for authentication."
                ),
                relevance_score=None,
            ),
            # Troubleshooting
            DocumentChunk(
                id="troubleshooting-guide",
                title="Troubleshooting Common Issues",
                category="tutorials",
                source="docs/tutorials/troubleshooting.md",
                content=(
                    "Common issues and solutions: 1) OAuth authorization failures - check "
                    "redirect URIs, scopes, and client configuration, 2) FHIR server connectivity "
                    "- verify endpoints, certificates, and network access, 3) User authentication "
                    "problems - check IdP configuration and user status, 4) Application launch "
                    "failures - verify launch contexts and required parameters, 5) Scope access "
                    "denied - review user permissions and application scopes, 6) Performance "
                    "issues - check system health and resource utilization."
                ),
                relevance_score=None,
            ),
        ]

    def search_by_keyword(self, query: str, max_results: int = 5) -> List[DocumentChunk]:
        """
        Search knowledge base using keyword matching.

        Args:
            query: Search query string
            max_results: Maximum number of results to return

        Returns:
            List of relevant DocumentChunk objects with relevance scores
        """
        query_lower = query.lower()
        search_terms = query_lower.split()

        scored_docs: List[tuple[DocumentChunk, float]] = []

        for doc in self.documents:
            score = 0.0
            content_lower = doc.content.lower()
            title_lower = doc.title.lower()

            # Score based on title matches (higher weight)
            for term in search_terms:
                if term in title_lower:
                    score += 10.0

                # Count occurrences in content
                score += float(content_lower.count(term))

            if score > 0:
                doc_copy = doc.model_copy()
                doc_copy.relevance_score = score
                scored_docs.append((doc_copy, score))

        # Sort by score and return top results
        scored_docs.sort(key=lambda x: x[1], reverse=True)
        return [doc for doc, _ in scored_docs[:max_results]]

    async def search_by_semantic(self, query: str, max_results: int = 5) -> List[DocumentChunk]:
        """
        Search knowledge base using semantic similarity (embeddings + cosine similarity).

        Args:
            query: Search query string
            max_results: Maximum number of results to return

        Returns:
            List of relevant DocumentChunk objects with relevance scores
        """
        if not self.openai_client or self.embeddings is None:
            logger.warning("Embeddings not available, falling back to keyword search")
            return self.search_by_keyword(query, max_results)
        
        try:
            # Get or generate embedding for the query (with caching)
            query_embedding = await self._get_or_generate_embedding(query)
            
            if query_embedding is None:
                logger.warning("Failed to get query embedding, falling back to keyword search")
                return self.search_by_keyword(query, max_results)
            
            # Compute cosine similarity with all document embeddings
            # cosine_similarity = dot(A, B) / (norm(A) * norm(B))
            similarities = np.dot(self.embeddings, query_embedding) / (
                np.linalg.norm(self.embeddings, axis=1) * np.linalg.norm(query_embedding)
            )
            
            # Get top-k indices
            top_indices = np.argsort(similarities)[::-1][:max_results]
            
            # Return documents with relevance scores
            results = []
            for idx in top_indices:
                doc_copy = self.documents[idx].model_copy()
                doc_copy.relevance_score = float(similarities[idx])
                results.append(doc_copy)
            
            logger.info(f"Semantic search found {len(results)} results for query: {query[:50]}...")
            return results
            
        except Exception as e:
            logger.error(f"Semantic search failed: {e}, falling back to keyword search")
            return self.search_by_keyword(query, max_results)

    def get_all_categories(self) -> List[str]:
        """Get all unique categories in the knowledge base."""
        return list(set(doc.category for doc in self.documents))

    def get_stats(self) -> dict:
        """Get knowledge base statistics."""
        return {
            "total_documents": len(self.documents),
            "categories": self.get_all_categories(),
            "sources": list(set(doc.source for doc in self.documents)),
            "embedding_cache_size": len(self._embedding_cache),
            "embedding_cache_max_size": self._cache_max_size,
            "embeddings_initialized": self.embeddings is not None,
        }
