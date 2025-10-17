"""Generate RSA key pair for Backend Services JWT authentication."""

import os
from pathlib import Path
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.backends import default_backend


def generate_keypair(output_dir: Path) -> tuple[str, str]:
    """
    Generate RSA key pair for JWT signing.
    
    Returns:
        Tuple of (private_key_path, public_key_path)
    """
    # Generate private key
    private_key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=2048,
        backend=default_backend()
    )
    
    # Serialize private key to PEM format
    private_pem = private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption()
    )
    
    # Serialize public key to PEM format
    public_key = private_key.public_key()
    public_pem = public_key.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    )
    
    # Create output directory if it doesn't exist
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Write private key
    private_key_path = output_dir / "ai_assistant_private.pem"
    with open(private_key_path, "wb") as f:
        f.write(private_pem)
    os.chmod(private_key_path, 0o600)  # Secure permissions
    
    # Write public key
    public_key_path = output_dir / "ai_assistant_public.pem"
    with open(public_key_path, "wb") as f:
        f.write(public_pem)
    
    print(f"✅ Private key saved to: {private_key_path}")
    print(f"✅ Public key saved to: {public_key_path}")
    print(f"\n⚠️  Keep the private key secure! Add it to .gitignore")
    print(f"\n📋 Public key content (for SMART App registration):")
    print("=" * 70)
    print(public_pem.decode('utf-8'))
    print("=" * 70)
    
    return str(private_key_path), str(public_key_path)


if __name__ == "__main__":
    # Generate keys in the mcp-server directory
    script_dir = Path(__file__).parent.parent
    keys_dir = script_dir / "keys"
    
    print("🔐 Generating RSA key pair for AI Assistant Backend Services auth...")
    private_path, public_path = generate_keypair(keys_dir)
    
    print(f"\n📝 Next steps:")
    print(f"1. Add 'keys/' to .gitignore")
    print(f"2. Set BACKEND_SERVICE_PRIVATE_KEY_PATH={private_path} in .env")
    print(f"3. Register AI Assistant as Backend Service SMART App using the public key above")
