#!/usr/bin/env python3
"""
Script to extract inline response schemas from route files and replace them with imports
"""

import re
import os

# Map of files to process with their replacement patterns
replacements = {
    r"C:\Users\MaximilianNussbaumer\Workspace\smart-on-fhir-proxy\backend\src\routes\admin\roles.ts": [
        {
            "search": r"""response: {
      200: t.Array\(t\.Object\({
        id: t\.Optional\(t\.String\({ description: 'Role ID' }\)\),
        name: t\.Optional\(t\.String\({ description: 'Role name' }\)\),
        description: t\.Optional\(t\.String\({ description: 'Role description' }\)\),
        attributes: t\.Optional\(t\.Record\(t\.String\(\), t\.Array\(t\.String\(\)\)\)\),
      }\)\),
      \.\.\.CommonErrorResponses
    },""",
            "replace": """response: {
      200: t.Array(Role),
      ...CommonErrorResponses
    },"""
        },
        {
            "search": r"""response: {
      200: t\.Object\({
        id: t\.Optional\(t\.String\({ description: 'Role ID' }\)\),
        name: t\.Optional\(t\.String\({ description: 'Role name' }\)\),
        description: t\.Optional\(t\.String\({ description: 'Role description' }\)\),
        attributes: t\.Optional\(t\.Record\(t\.String\(\), t\.Array\(t\.String\(\)\)\)\),
      }\),
      \.\.\.CommonErrorResponses
    },""",
            "replace": """response: {
      200: Role,
      ...CommonErrorResponses
    },"""
        },
        {
            "search": r"""response: {
      200: t\.Object\({
        success: t\.Boolean\({ description: 'Whether the update was successful' }\)
      }\),
      \.\.\.CommonErrorResponses
    },""",
            "replace": """response: {
      200: SuccessResponse,
      ...CommonErrorResponses
    },"""
        },
        {
            "search": r"""response: {
      200: t\.Object\({
        success: t\.Boolean\({ description: 'Whether the delete was successful' }\)
      }\),
      \.\.\.CommonErrorResponses
    },""",
            "replace": """response: {
      200: SuccessResponse,
      ...CommonErrorResponses
    },"""
        }
    ]
}

def read_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        return f.read()

def write_file(filepath, content):
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def process_file(filepath, patterns):
    """Process a file with given patterns"""
    try:
        content = read_file(filepath)
        original_content = content
        
        for pattern in patterns:
            # Try literal string replacement first
            if pattern["search"] in content:
                content = content.replace(pattern["search"], pattern["replace"])
                print(f"✓ Replaced literal pattern in {os.path.basename(filepath)}")
            else:
                # Try regex replacement
                try:
                    content = re.sub(pattern["search"], pattern["replace"], content)
                    print(f"✓ Replaced regex pattern in {os.path.basename(filepath)}")
                except Exception as e:
                    print(f"✗ Failed regex replacement in {filepath}: {e}")
        
        if content != original_content:
            write_file(filepath, content)
            print(f"📝 Updated {filepath}")
        else:
            print(f"⚠️  No changes made to {filepath}")
            
    except Exception as e:
        print(f"✗ Error processing {filepath}: {e}")

# Process all files
for filepath, patterns in replacements.items():
    print(f"\nProcessing {filepath}...")
    process_file(filepath, patterns)

print("\n✅ Script completed!")
