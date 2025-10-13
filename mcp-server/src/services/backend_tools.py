"""Backend API tool wrapper for OpenAI function calling."""

import logging
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional

# Add the api_client to the Python path
api_client_path = Path(__file__).parent.parent / "api_client"
if str(api_client_path) not in sys.path:
    sys.path.insert(0, str(api_client_path))

from api_client import (
    ApiClient,
    ApiException,
    Configuration,
    HealthcareUsersApi,
    SmartAppsApi,
    ServersApi,
    RolesApi,
    IdentityProvidersApi,
    AdminApi,
    PostAdminHealthcareUsersRequest,
)

logger = logging.getLogger(__name__)


class BackendAPITools:
    """
    Wrapper class for backend API endpoints that can be registered as OpenAI tools/functions.
    
    This class provides a bridge between OpenAI function calling and the backend API,
    allowing the AI assistant to perform actions on behalf of users.
    """

    def __init__(self, backend_url: str, access_token: Optional[str] = None):
        """
        Initialize the backend API tools.
        
        Args:
            backend_url: Base URL of the backend API
            access_token: Optional JWT token for authenticated requests
        """
        self.backend_url = backend_url
        self.access_token = access_token
        
        # Configure API client
        config = Configuration(host=backend_url)
        if access_token:
            config.access_token = access_token
        
        self.api_client = ApiClient(configuration=config)
        
        # Initialize API instances
        self.healthcare_users_api = HealthcareUsersApi(api_client=self.api_client)
        self.smart_apps_api = SmartAppsApi(api_client=self.api_client)
        self.servers_api = ServersApi(api_client=self.api_client)
        self.roles_api = RolesApi(api_client=self.api_client)
        self.identity_providers_api = IdentityProvidersApi(api_client=self.api_client)
        self.admin_api = AdminApi(api_client=self.api_client)

    def get_function_definitions(self) -> List[Dict[str, Any]]:
        """
        Get OpenAI function definitions for all available backend API tools.
        
        Returns:
            List of function definition dictionaries for OpenAI
        """
        return [
            {
                "type": "function",
                "name": "list_healthcare_users",
                "description": "Retrieve a list of all healthcare users in the system. Use this when the user asks to see users, list users, or show all users.",
                "parameters": {
                    "type": "object",
                    "properties": {},
                    "required": [],
                    "additionalProperties": False
                },
                "strict": True
            },
            {
                "type": "function",
                "name": "get_healthcare_user",
                "description": "Get detailed information about a specific healthcare user by their user ID.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "user_id": {
                            "type": "string",
                            "description": "The unique identifier of the healthcare user"
                        }
                    },
                    "required": ["user_id"],
                    "additionalProperties": False
                },
                "strict": True
            },
            {
                "type": "function",
                "name": "create_healthcare_user",
                "description": "Create a new healthcare user in the system. Use this when the user wants to add a new user or register a new healthcare professional.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "username": {
                            "type": "string",
                            "description": "Unique username for the new user"
                        },
                        "email": {
                            "type": "string",
                            "description": "Email address of the new user"
                        },
                        "firstName": {
                            "type": "string",
                            "description": "First name of the user"
                        },
                        "lastName": {
                            "type": "string",
                            "description": "Last name of the user"
                        },
                        "password": {
                            "type": "string",
                            "description": "Initial password for the user"
                        },
                        "roles": {
                            "type": ["array", "null"],
                            "items": {"type": "string"},
                            "description": "Array of role names to assign to the user"
                        }
                    },
                    "required": ["username", "email", "firstName", "lastName", "password", "roles"],
                    "additionalProperties": False
                },
                "strict": True
            },
            {
                "type": "function",
                "name": "list_smart_apps",
                "description": "Retrieve a list of all registered SMART on FHIR applications. Use this when the user asks about available apps, registered applications, or SMART apps.",
                "parameters": {
                    "type": "object",
                    "properties": {},
                    "required": [],
                    "additionalProperties": False
                },
                "strict": True
            },
            {
                "type": "function",
                "name": "list_fhir_servers",
                "description": "Retrieve a list of all configured FHIR servers. Use this when the user asks about available FHIR servers or backend systems.",
                "parameters": {
                    "type": "object",
                    "properties": {},
                    "required": [],
                    "additionalProperties": False
                },
                "strict": True
            },
            {
                "type": "function",
                "name": "list_roles",
                "description": "Retrieve a list of all available roles in the system. Use this when the user asks about permissions, roles, or access levels.",
                "parameters": {
                    "type": "object",
                    "properties": {},
                    "required": [],
                    "additionalProperties": False
                },
                "strict": True
            }
        ]

    async def execute_function(self, function_name: str, arguments: Dict[str, Any]) -> Any:
        """
        Execute a backend API function based on the function name and arguments.
        
        Args:
            function_name: Name of the function to execute
            arguments: Dictionary of arguments for the function
            
        Returns:
            Result from the backend API
            
        Raises:
            ValueError: If function name is not recognized
        """
        logger.info(f"Executing backend API function: {function_name} with args: {arguments}")
        
        try:
            if function_name == "list_healthcare_users":
                response = self.healthcare_users_api.get_admin_healthcare_users()
                return {"users": [user.to_dict() for user in response]}
            
            elif function_name == "get_healthcare_user":
                user_id = arguments.get("user_id")
                response = self.healthcare_users_api.get_admin_healthcare_users_by_user_id(user_id=user_id)
                return {"user": response.to_dict()}
            
            elif function_name == "create_healthcare_user":
                user_data = PostAdminHealthcareUsersRequest(
                    username=arguments.get("username"),
                    email=arguments.get("email"),
                    first_name=arguments.get("firstName"),
                    last_name=arguments.get("lastName"),
                    password=arguments.get("password"),
                    roles=arguments.get("roles", [])
                )
                response = self.healthcare_users_api.post_admin_healthcare_users(
                    post_admin_healthcare_users_request=user_data
                )
                return {"user": response.to_dict()}
            
            elif function_name == "list_smart_apps":
                response = self.smart_apps_api.get_admin_smart_apps()
                return {"apps": [app.to_dict() for app in response]}
            
            elif function_name == "list_fhir_servers":
                response = self.servers_api.get_fhir_servers()
                return {"servers": [server.to_dict() for server in response]}
            
            elif function_name == "list_roles":
                response = self.roles_api.get_admin_roles()
                return {"roles": [role.to_dict() for role in response]}
            
            else:
                raise ValueError(f"Unknown function: {function_name}")
                
        except ApiException as e:
            # Handle API errors gracefully
            error_msg = f"Backend API error: {e.status}"
            if e.status == 401:
                error_msg = "Authentication required. Please configure BACKEND_API_TOKEN in .env file."
            elif e.status == 403:
                error_msg = "Permission denied. Check your authentication token."
            elif e.status == 404:
                error_msg = "Resource not found."
            elif e.status == 500:
                error_msg = "Backend server error."
            
            logger.error(f"{error_msg} - {e.reason}")
            return {"error": error_msg, "function": function_name, "status": e.status}
        except Exception as e:
            logger.error(f"Error executing function {function_name}: {e}", exc_info=True)
            return {"error": str(e), "function": function_name}
