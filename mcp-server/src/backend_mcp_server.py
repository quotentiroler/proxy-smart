"""
FastMCP server that exposes backend API tools for the AI assistant.

This server runs alongside the main FastAPI server and provides
MCP protocol access to backend operations like user management,
SMART app configuration, etc.

Run directly: python src/backend_mcp_server.py
Or via uv: uv run python src/backend_mcp_server.py
"""

import logging
import sys
from pathlib import Path
from typing import Any

from mcp.server.fastmcp import Context, FastMCP

# Add the api_client to the Python path
api_client_path = Path(__file__).parent / "api_client"
if str(api_client_path) not in sys.path:
    sys.path.insert(0, str(api_client_path))

from api_client import (
    ApiClient,
    ApiException,
    Configuration,
    HealthcareUsersApi,
    PostAdminHealthcareUsersRequest,
    RolesApi,
    ServersApi,
    SmartAppsApi,
)

from config import settings

logger = logging.getLogger(__name__)

# Create FastMCP server
mcp = FastMCP(
    name="SMART on FHIR Backend",
    instructions=(
        "This server provides tools to manage the SMART on FHIR proxy backend, "
        "including healthcare users, SMART apps, FHIR servers, and roles."
    ),
)

# Initialize API client
config = Configuration(host=settings.backend_api_url)
if settings.backend_api_token:
    config.access_token = settings.backend_api_token

api_client = ApiClient(configuration=config)

# Initialize API instances
healthcare_users_api = HealthcareUsersApi(api_client)
smart_apps_api = SmartAppsApi(api_client)
servers_api = ServersApi(api_client)
roles_api = RolesApi(api_client)


@mcp.tool()
async def list_healthcare_users(ctx: Context) -> dict[str, Any]:
    """
    List all healthcare users in the system.
    
    Returns a list of all healthcare professionals and administrative users
    with their details including username, email, roles, and status.
    """
    try:
        await ctx.info("Fetching healthcare users from backend...")
        response = healthcare_users_api.get_admin_healthcare_users()
        users = [user.to_dict() for user in response]
        await ctx.info(f"Retrieved {len(users)} users")
        return {"users": users, "count": len(users)}
    except ApiException as e:
        error_msg = _format_api_error(e)
        await ctx.error(f"Failed to list users: {error_msg}")
        return {"error": error_msg, "status": e.status}


@mcp.tool()
async def get_healthcare_user(user_id: str, ctx: Context) -> dict[str, Any]:
    """
    Get details of a specific healthcare user by their ID.
    
    Args:
        user_id: The unique identifier of the healthcare user
    """
    try:
        await ctx.info(f"Fetching user {user_id}...")
        response = healthcare_users_api.get_admin_healthcare_users_user_id(user_id)
        await ctx.info(f"Retrieved user: {response.username}")
        return {"user": response.to_dict()}
    except ApiException as e:
        error_msg = _format_api_error(e)
        await ctx.error(f"Failed to get user: {error_msg}")
        return {"error": error_msg, "status": e.status}


@mcp.tool()
async def create_healthcare_user(
    username: str,
    email: str,
    first_name: str,
    last_name: str,
    password: str,
    ctx: Context,
    roles: list[str] | None = None,
) -> dict[str, Any]:
    """
    Create a new healthcare user in the system.
    
    Args:
        username: Unique username for the user
        email: User's email address
        first_name: User's first name
        last_name: User's last name
        password: Initial password (must meet security requirements)
        roles: Optional list of role IDs to assign to the user
    """
    try:
        await ctx.info(f"Creating user {username}...")
        
        user_data = PostAdminHealthcareUsersRequest(
            username=username,
            email=email,
            first_name=first_name,
            last_name=last_name,
            password=password,
            roles=roles or [],
        )
        
        response = healthcare_users_api.post_admin_healthcare_users(
            post_admin_healthcare_users_request=user_data
        )
        
        await ctx.info(f"Successfully created user: {username}")
        return {"user": response.to_dict(), "message": f"User '{username}' created successfully"}
    except ApiException as e:
        error_msg = _format_api_error(e)
        await ctx.error(f"Failed to create user: {error_msg}")
        return {"error": error_msg, "status": e.status}


@mcp.tool()
async def list_smart_apps(ctx: Context) -> dict[str, Any]:
    """
    List all registered SMART apps in the system.
    
    Returns a list of all SMART on FHIR applications registered with the proxy,
    including their client IDs, redirect URIs, and configuration details.
    """
    try:
        await ctx.info("Fetching SMART apps...")
        response = smart_apps_api.get_admin_smart_apps()
        apps = [app.to_dict() for app in response]
        await ctx.info(f"Retrieved {len(apps)} SMART apps")
        return {"apps": apps, "count": len(apps)}
    except ApiException as e:
        error_msg = _format_api_error(e)
        await ctx.error(f"Failed to list SMART apps: {error_msg}")
        return {"error": error_msg, "status": e.status}


@mcp.tool()
async def list_fhir_servers(ctx: Context) -> dict[str, Any]:
    """
    List all configured FHIR servers.
    
    Returns a list of all FHIR servers configured in the proxy, including
    their URLs, FHIR versions, and connection status.
    """
    try:
        await ctx.info("Fetching FHIR servers...")
        response = servers_api.get_fhir_servers()
        servers = [server.to_dict() for server in response]
        await ctx.info(f"Retrieved {len(servers)} FHIR servers")
        return {"servers": servers, "count": len(servers)}
    except ApiException as e:
        error_msg = _format_api_error(e)
        await ctx.error(f"Failed to list FHIR servers: {error_msg}")
        return {"error": error_msg, "status": e.status}


@mcp.tool()
async def list_roles(ctx: Context) -> dict[str, Any]:
    """
    List all available roles in the system.
    
    Returns a list of all roles that can be assigned to users,
    including their names, descriptions, and permissions.
    """
    try:
        await ctx.info("Fetching roles...")
        response = roles_api.get_admin_roles()
        roles = [role.to_dict() for role in response]
        await ctx.info(f"Retrieved {len(roles)} roles")
        return {"roles": roles, "count": len(roles)}
    except ApiException as e:
        error_msg = _format_api_error(e)
        await ctx.error(f"Failed to list roles: {error_msg}")
        return {"error": error_msg, "status": e.status}


def _format_api_error(e: ApiException) -> str:
    """Format API exception into user-friendly error message."""
    if e.status == 401:
        return "Authentication required. Please configure BACKEND_API_TOKEN."
    elif e.status == 403:
        return "Permission denied. Check your authentication token."
    elif e.status == 404:
        return "Resource not found."
    elif e.status == 500:
        return "Backend server error."
    else:
        return f"API error (status {e.status}): {e.reason}"


def main():
    """Run the FastMCP backend tools server."""
    # Run with stdio transport for AI assistant integration
    # Can also use streamable-http for web/Claude Desktop integration
    mcp.run(transport="stdio")


if __name__ == "__main__":
    main()
