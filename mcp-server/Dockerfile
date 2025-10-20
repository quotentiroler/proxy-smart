# Multi-stage build for SMART on FHIR MCP Server
# Optimized for Northflank deployment

# Stage 1: Build stage with dependencies
FROM python:3.11-slim as builder

# Set working directory
WORKDIR /app

# Install system dependencies required for building Python packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    g++ \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy only dependency files first for better layer caching
COPY pyproject.toml ./

# Install uv for faster dependency resolution and installation
RUN pip install --no-cache-dir uv

# Install dependencies
RUN uv pip install --system --no-cache -e .

# Stage 2: Runtime stage
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install runtime dependencies only
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user for security
RUN useradd -m -u 1000 mcpserver && chown -R mcpserver:mcpserver /app

# Copy Python packages from builder
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Copy application code
COPY --chown=mcpserver:mcpserver src/ ./src/
COPY --chown=mcpserver:mcpserver run.py ./

# Create necessary directories
RUN mkdir -p keys && chown -R mcpserver:mcpserver keys

# Switch to non-root user
USER mcpserver

# Expose port (Northflank will map this)
EXPOSE 8081

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8081/health || exit 1

# Environment variables (override these in Northflank)
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    MCP_SERVER_HOST=0.0.0.0 \
    MCP_SERVER_PORT=8081 \
    LOG_LEVEL=INFO

# Start the server
CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8081", "--log-level", "info"]
