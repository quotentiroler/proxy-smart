#!/usr/bin/env python3
"""
Quick test runner script for MCP server tests.

Usage:
    python run_tests.py              # Run all tests
    python run_tests.py --unit       # Run unit tests only
    python run_tests.py --integration # Run integration tests only
    python run_tests.py --coverage   # Run with coverage report
"""

import argparse
import os
import subprocess
import sys
from pathlib import Path
from typing import Optional


def run_command(cmd: list[str], env: Optional[dict] = None) -> int:
    """Run a command and return exit code."""
    print(f"\n{'='*60}")
    print(f"Running: {' '.join(cmd)}")
    print(f"{'='*60}\n")
    
    result = subprocess.run(cmd, env=env or os.environ.copy())
    return result.returncode


def main():
    parser = argparse.ArgumentParser(description="Run MCP server tests")
    parser.add_argument(
        "--unit",
        action="store_true",
        help="Run unit tests only (no integration)"
    )
    parser.add_argument(
        "--integration",
        action="store_true",
        help="Run integration tests only"
    )
    parser.add_argument(
        "--coverage",
        action="store_true",
        help="Generate coverage report"
    )
    parser.add_argument(
        "--verbose", "-v",
        action="store_true",
        help="Verbose output"
    )
    parser.add_argument(
        "--file",
        type=str,
        help="Run specific test file"
    )
    parser.add_argument(
        "--test",
        type=str,
        help="Run specific test (e.g., TestClass::test_method)"
    )
    
    args = parser.parse_args()
    
    # Build pytest command
    cmd = ["pytest"]
    
    # Add test path
    if args.file:
        cmd.append(args.file)
    elif args.test:
        cmd.append(f"test/{args.test}")
    else:
        cmd.append("test/")
    
    # Add markers
    if args.unit:
        cmd.extend(["-m", "not integration"])
    elif args.integration:
        cmd.extend(["-m", "integration"])
    
    # Add coverage
    if args.coverage:
        cmd.extend([
            "--cov=src",
            "--cov-report=html",
            "--cov-report=term"
        ])
    
    # Add verbosity
    if args.verbose:
        cmd.append("-v")
    
    # Set environment variables
    env = os.environ.copy()
    if "BACKEND_API_TOKEN" not in env:
        print("⚠️  Warning: BACKEND_API_TOKEN not set")
        env["BACKEND_API_TOKEN"] = "test-token"
    
    if "MCP_SERVER_URL" not in env:
        env["MCP_SERVER_URL"] = "http://localhost:8000"
    
    # Run tests
    exit_code = run_command(cmd, env)
    
    if exit_code == 0:
        print("\n✅ All tests passed!")
        
        if args.coverage:
            coverage_html = Path("htmlcov/index.html")
            if coverage_html.exists():
                print(f"\n📊 Coverage report: {coverage_html.absolute()}")
    else:
        print("\n❌ Some tests failed!")
    
    return exit_code


if __name__ == "__main__":
    sys.exit(main())
