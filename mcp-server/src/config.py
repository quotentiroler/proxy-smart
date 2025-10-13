"""Configuration management for MCP server."""

from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # OpenAI Configuration
    openai_api_key: str = "your-openai-api-key-here"
    openai_model: str = "gpt-5-nano"
    openai_max_tokens: int = 4000  # Increased for reasoning models that use tokens for thinking
    openai_temperature: float = 1.0  # Default value (some models don't support custom values)
    
    # Embedding Configuration
    openai_embedding_model: str = "text-embedding-3-small"  # Fast and cost-effective
    openai_embedding_dimensions: int = 1536  # Default dimensions for text-embedding-3-small

    # Server Configuration
    mcp_server_host: str = "0.0.0.0"
    mcp_server_port: int = 8081

    # CORS Configuration (comma-separated string in .env)
    cors_origins: str = "http://localhost:5173,http://localhost:3000"

    # Logging
    log_level: str = "INFO"

    # RAG Configuration
    max_search_results: int = 5
    relevance_threshold: float = 0.3
    
    # Backend API Configuration
    backend_api_url: str = "http://localhost:3001"
    backend_api_token: str = ""  # Optional JWT token for authenticated API calls

    def get_cors_origins_list(self) -> List[str]:
        """Get CORS origins as a list."""
        if isinstance(self.cors_origins, str):
            return [origin.strip() for origin in self.cors_origins.split(",")]
        return self.cors_origins  # type: ignore

    def is_openai_configured(self) -> bool:
        """Check if OpenAI API key is properly configured."""
        return self.openai_api_key != "your-openai-api-key-here" and bool(
            self.openai_api_key
        )


# Singleton settings instance
settings = Settings()
