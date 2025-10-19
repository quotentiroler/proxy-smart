"""Deprecated shim for backwards compatibility.

Use ``services.auth`` instead. This module remains temporarily so older imports
continue to function during the transition away from Keycloak-specific naming.
"""

from warnings import warn

from .auth import BackendServicesAuth, get_backend_services_auth

warn(
    "services.keycloak_auth is deprecated; import services.auth instead.",
    DeprecationWarning,
    stacklevel=2,
)

__all__ = ["BackendServicesAuth", "get_backend_services_auth"]
