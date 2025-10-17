"""
Generate MCP tools from the generated OpenAPI client.

This script introspects the generated API client classes and automatically
generates MCP tool wrappers for all available operations.

This is simpler than parsing the OpenAPI spec because we work directly
with the Python client that's already generated and typed.
"""

import inspect
import json
import re
from pathlib import Path
from typing import Any, get_type_hints, get_origin, get_args


def get_api_modules():
    """Import all API modules from the generated client dynamically."""
    import sys
    import importlib
    
    # Add generated folder to path (so we can import api_client as a package)
    generated_path = Path(__file__).parent / "generated"
    if str(generated_path) not in sys.path:
        sys.path.insert(0, str(generated_path))
    
    # Import the api_client package
    import api_client
    
    # Dynamically discover all API classes (classes ending with 'Api')
    api_modules = {}
    
    for name in dir(api_client):
        if name.endswith('Api') and not name.startswith('_'):
            api_class = getattr(api_client, name)
            
            # Verify it's actually a class (not a module or other object)
            if isinstance(api_class, type):
                # Convert class name to snake_case variable name
                # e.g., HealthcareUsersApi -> healthcare_users_api
                var_name = re.sub(r'([a-z0-9])([A-Z])', r'\1_\2', name).lower()
                var_name = var_name.replace('_api', '_api')  # Keep the _api suffix
                
                api_modules[var_name] = api_class
    
    return api_modules


def sanitize_name(name: str) -> str:
    """
    Convert API method name to MCP tool name.
    
    Keeps HTTP method prefixes when they provide semantic meaning:
    - get_users → list_users (for collection endpoints)
    - get_user_by_id → get_user_by_id (for singular endpoints)
    - post_users → create_users
    - put_user_by_id → update_user_by_id
    - delete_user_by_id → delete_user_by_id
    
    Also ensures names fit within OpenAI's 64-character limit.
    """
    # Map HTTP verbs to semantic action verbs
    verb_mapping = {
        'get': 'list',  # GET collection
        'post': 'create',
        'put': 'update',
        'patch': 'update',
        'delete': 'delete',
    }
    
    # Extract HTTP verb prefix if present
    match = re.match(r'^(get|post|put|delete|patch)_(.+)$', name)
    if match:
        verb, rest = match.groups()
        
        # Keep 'by_' parts (they indicate specific resource)
        # For GET without 'by_', it's a list operation
        if verb == 'get' and '_by_' not in name:
            # GET collection → list
            semantic_verb = 'list'
        elif verb == 'get' and '_by_' in name:
            # GET specific resource → get
            semantic_verb = 'get'
        else:
            # POST/PUT/DELETE → use mapping
            semantic_verb = verb_mapping.get(verb, verb)
        
        name = f"{semantic_verb}_{rest}"
    
    # Convert camelCase to snake_case
    name = re.sub(r'([a-z0-9])([A-Z])', r'\1_\2', name)
    name = name.lower()
    
    # Apply abbreviations if name is too long (OpenAI has 64 char limit)
    if len(name) > 64:
        abbreviations = {
            # General abbreviations
            'admin_launch_contexts': 'lc',
            'launch_contexts': 'lc',
            'healthcare_users': 'users',
            'smart_apps': 'apps',
            'fhir_servers': 'servers',
            'identity_providers': 'idps',
            'monitoring_oauth': 'oauth',
            'client_registration': 'client_reg',
            'cache_refresh': 'refresh',
            'proxy_smart_backend': 'proxy_backend',
            # Resource-specific abbreviations (with by_)
            'encounter_by_encounter_id': 'encounter',
            'fhir_user_by_fhir_user_id': 'fhir_user',
            'patient_by_patient_id': 'patient',
            'by_server_name': 'by_server',
            'by_fhir_version': 'by_version',
            'by_user_id_': 'by_user_',
        }
        
        for long_form, short_form in abbreviations.items():
            name = name.replace(long_form, short_form)
            # Stop early if we're under the limit
            if len(name) <= 64:
                break
    
    return name


def get_pydantic_model_schema(model_class) -> dict[str, Any] | None:
    """Extract schema information from a Pydantic model."""
    try:
        # Check if it's a Pydantic model
        if not hasattr(model_class, 'model_fields'):
            return None
        
        schema = {
            "fields": {},
            "required": [],
            "example": {}
        }
        
        # Extract field information
        for field_name, field_info in model_class.model_fields.items():
            field_schema = {
                "type": str(field_info.annotation),
                "description": field_info.description or "",
                "required": field_info.is_required(),
                "alias": field_info.alias or field_name
            }
            
            schema["fields"][field_name] = field_schema
            
            if field_info.is_required():
                schema["required"].append(field_name)
            
            # Build example value
            if field_info.is_required():
                if 'str' in str(field_info.annotation).lower():
                    if 'email' in field_name.lower():
                        schema["example"][field_info.alias or field_name] = "user@example.com"
                    elif 'name' in field_name.lower():
                        schema["example"][field_info.alias or field_name] = "Example Name"
                    elif 'username' in field_name.lower():
                        schema["example"][field_info.alias or field_name] = "username"
                    else:
                        schema["example"][field_info.alias or field_name] = f"<{field_name}>"
                elif 'bool' in str(field_info.annotation).lower():
                    schema["example"][field_info.alias or field_name] = False
                elif 'int' in str(field_info.annotation).lower():
                    schema["example"][field_info.alias or field_name] = 0
        
        return schema
    except Exception as e:
        return None


def format_parameter_description(param_name: str, param_type: Any, method) -> tuple[str, str | None]:
    """
    Generate enhanced parameter description with schema details.
    Returns (description, example_json)
    """
    type_str = str(param_type)
    
    # Try to extract the actual type from annotations
    try:
        hints = get_type_hints(method)
        if param_name in hints:
            hint = hints[param_name]
            
            # Check if it's a Pydantic model (has model_fields)
            origin = get_origin(hint)
            if origin is None:
                # Direct type, might be a Pydantic model
                if hasattr(hint, 'model_fields'):
                    schema = get_pydantic_model_schema(hint)
                    if schema:
                        # Build detailed description
                        desc_parts = [f"JSON object with the following fields:"]
                        
                        for field_name, field_info in schema["fields"].items():
                            req = "REQUIRED" if field_info["required"] else "optional"
                            alias = field_info["alias"]
                            field_desc = field_info["description"]
                            desc_parts.append(f"  - {alias} ({req}): {field_desc}" if field_desc else f"  - {alias} ({req})")
                        
                        description = "\n".join(desc_parts)
                        example_json = json.dumps(schema["example"], indent=2)
                        
                        return description, example_json
    except Exception as e:
        pass
    
    # Fallback to simple description
    return f"Parameter: {param_name}", None


def generate_tool_for_method(api_var_name: str, method_name: str, method) -> str:
    """Generate MCP tool function for a single API method."""
    
    # Skip internal methods
    if method_name.startswith('_') or 'with_http_info' in method_name or 'without_preload' in method_name:
        return ""
    
    tool_name = sanitize_name(method_name)
    
    # Get method signature and type hints
    sig = inspect.signature(method)
    try:
        hints = get_type_hints(method)
    except:
        hints = {}
    
    params = []
    required_params = []
    param_descriptions = []
    param_examples = {}
    pydantic_params = {}  # Track which params need JSON->Pydantic conversion
    
    for param_name, param in sig.parameters.items():
        if param_name in ['self', 'kwargs']:
            continue
        
        # Skip internal OpenAPI parameters (FastMCP doesn't allow params starting with _)
        if param_name.startswith('_'):
            continue
        
        # Get type hint
        param_type = hints.get(param_name, str)
        
        # Check if this is a Pydantic model parameter
        is_pydantic = False
        if hasattr(param_type, 'model_fields'):
            is_pydantic = True
            pydantic_params[param_name] = param_type
        
        # Generate enhanced description
        param_desc, example_json = format_parameter_description(param_name, param_type, method)
        if param_desc:
            param_descriptions.append(f"    {param_name}: {param_desc}")
        if example_json:
            param_examples[param_name] = example_json
        
        # Determine if required (no default value)
        if param.default == inspect.Parameter.empty:
            required_params.append(param_name)
            params.append(f"{param_name}: str")
        else:
            params.append(f"{param_name}: str | None = None")
    
    # Get docstring
    doc = inspect.getdoc(method) or f"Call {method_name}"
    doc_lines = doc.split('\n')
    description = doc_lines[0] if doc_lines else f"Execute {method_name}"
    
    # Build enhanced docstring
    enhanced_doc = [description, ""]
    
    if param_descriptions:
        enhanced_doc.append("Parameters:")
        enhanced_doc.extend(param_descriptions)
        enhanced_doc.append("")
    
    if param_examples:
        enhanced_doc.append("Example JSON for parameters:")
        for param_name, example in param_examples.items():
            enhanced_doc.append(f"  {param_name}:")
            for line in example.split('\n'):
                enhanced_doc.append(f"    {line}")
        enhanced_doc.append("")
    
    enhanced_doc.append(f"Auto-generated from: {api_var_name}.{method_name}()")
    
    # Build function signature
    func_params = ["ctx: Context"] + params
    
    # Build parameter conversion code for Pydantic models
    param_conversion_code = ""
    if pydantic_params:
        for param_name, model_class in pydantic_params.items():
            model_class_name = model_class.__name__
            param_conversion_code += f"""
        # Convert JSON string to Pydantic model
        import json
        {param_name}_data = json.loads({param_name}) if isinstance({param_name}, str) else {param_name}
        {param_name}_obj = {model_class_name}(**{param_name}_data)
"""
    
    # Build method call arguments - use converted objects for Pydantic params
    call_args_list = []
    for p in required_params + [p.split(':')[0].split('=')[0].strip() for p in params if '=' in p]:
        if p in pydantic_params:
            call_args_list.append(f"{p}={p}_obj")
        else:
            call_args_list.append(f"{p}={p}")
    call_args = ", ".join(call_args_list)
    
    # Format docstring
    docstring = "\n    ".join(enhanced_doc)
    
    # Import Pydantic model classes
    model_imports = ""
    if pydantic_params:
        model_names = [model.__name__ for model in pydantic_params.values()]
        model_imports = f"\n        from api_client.models import {', '.join(set(model_names))}"
    
    code = f'''
@mcp.tool()
async def {tool_name}({", ".join(func_params)}) -> dict[str, Any]:
    """
    {docstring}
    """
    try:
        await ctx.info(f"Calling {tool_name}..."){model_imports}{param_conversion_code}
        
        response = {api_var_name}.{method_name}({call_args})
        
        # Convert response to dict if it has to_dict method
        if hasattr(response, 'to_dict'):
            result = response.to_dict()
        elif isinstance(response, list) and response and hasattr(response[0], 'to_dict'):
            result = [item.to_dict() for item in response]
        else:
            result = response
        
        await ctx.info(f"{tool_name} completed successfully")
        return {{"result": result}}
        
    except ApiException as e:
        error_msg = _format_api_error(e)
        await ctx.error(f"Failed to execute {tool_name}: {{error_msg}}")
        return {{"error": error_msg, "status": e.status}}
    except Exception as e:
        await ctx.error(f"Unexpected error in {tool_name}: {{str(e)}}")
        return {{"error": str(e)}}
'''
    
    return code


def generate_mcp_server() -> tuple[str, int]:
    """Generate complete MCP server code from API client classes.
    
    Returns:
        tuple[str, int]: (generated_code, tool_count)
    """
    
    # Get API modules dynamically
    api_modules = get_api_modules()
    
    # Build dynamic imports for API classes
    api_class_names = [api_class.__name__ for api_class in api_modules.values()]
    api_imports = ",\n    ".join(sorted(api_class_names))
    
    # Build dynamic API instance initialization
    api_instances = "\n".join([
        f"{var_name} = {api_class.__name__}(api_client)"
        for var_name, api_class in sorted(api_modules.items())
    ])
    
    # Header
    code = f'''"""
Auto-generated FastMCP server from OpenAPI client.

This file is generated by generate_mcp_tools.py and provides
MCP protocol access to all backend API operations.

DO NOT EDIT MANUALLY - regenerate using: python src/generate_mcp_tools.py
"""

import logging
import sys
from pathlib import Path
from typing import Any

from mcp.server.fastmcp import Context, FastMCP

# Add the generated folder to the Python path (so api_client can be imported as a package)
generated_path = Path(__file__).parent / "generated"
if str(generated_path) not in sys.path:
    sys.path.insert(0, str(generated_path))

from api_client import (
    ApiClient,
    ApiException,
    Configuration,
    {api_imports},
)

from config import settings

logger = logging.getLogger(__name__)

# Create FastMCP server
mcp = FastMCP(
    name="SMART on FHIR Backend",
    instructions=(
        "This server provides tools to manage the SMART on FHIR proxy backend. "
        "Auto-generated from OpenAPI client."
    ),
)

# Initialize API client
config = Configuration(host=settings.backend_api_url)
if settings.backend_api_token:
    config.access_token = settings.backend_api_token

api_client = ApiClient(configuration=config)

# Initialize API instances (auto-discovered)
{api_instances}


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
        return f"API error (status {{e.status}}): {{e.reason}}"


# Generated tool functions below
# ============================================================================

'''
    
    # Generate tools for each API
    tool_count = 0
    for api_var_name, api_class in api_modules.items():
        code += f"\n\n# {api_class.__name__} tools\n"
        code += f"# {'=' * 70}\n"
        
        # Get all public methods
        for method_name in dir(api_class):
            if method_name.startswith('_'):
                continue
            
            method = getattr(api_class, method_name)
            if not callable(method):
                continue
            
            tool_code = generate_tool_for_method(api_var_name, method_name, method)
            if tool_code:
                code += tool_code
                tool_count += 1
    
    # Footer
    code += f'''

# Generated {tool_count} tools from {len(api_modules)} API classes

def main():
    """Run the FastMCP backend tools server."""
    mcp.run(transport="stdio")


if __name__ == "__main__":
    main()
'''
    
    return code, tool_count


def main():
    """Main entry point for the generator."""
    print("🔧 Generating MCP tools from OpenAPI client...")
    
    try:
        # Generate code
        print("🏗️  Introspecting API client classes...")
        server_code, tool_count = generate_mcp_server()
        
        # Write to file
        output_file = Path(__file__).parent / "backend_mcp_server_generated.py"
        with open(output_file, "w") as f:
            f.write(server_code)
        
        print(f"✅ Generated MCP server: {output_file}")
        print(f"📝 Generated {tool_count} tool functions")
        print("\n🎉 Done! You can now use the generated server.")
        print(f"   Run: python {output_file}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        raise


if __name__ == "__main__":
    main()
