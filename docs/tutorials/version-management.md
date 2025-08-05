# Version Management Tutorial

This tutorial explains how the version management system works in the Proxy Smart project. The system is designed to keep all package.json files synchronized across the monorepo and automate versioning for different release types.

## Overview

The version management system consists of:
- **Central Script**: `scripts/version.js` - Main version management logic
- **Git Hooks**: `.githooks/pre-commit` - Automatic version synchronization
- **GitHub Actions**: Automated version validation and release workflows
- **NPM Scripts**: Convenient commands for version operations

## Architecture

### Multi-Package Structure

The project is a monorepo with multiple packages:
```
├── package.json                    # Root package (master version)
├── backend/package.json            # Backend service
├── ui/package.json                 # Frontend React application
├── testing/package.json            # Testing utilities
├── testing/alpha/package.json      # Alpha testing environment
├── testing/beta/package.json       # Beta testing environment
└── testing/production/package.json # Production testing environment
```

All packages must maintain version consistency, with the root `package.json` serving as the source of truth.

### Version Format

The system supports semantic versioning with pre-release identifiers:

```
X.Y.Z[-suffix[.build[.sha]]]
```

- **X.Y.Z**: Standard semantic version (major.minor.patch)
- **suffix**: Release type (alpha, beta, or RELEASE for production)
- **build**: Build number for non-production releases (YYYYMMDDHHMM format)
- **sha**: Short commit SHA for non-production releases

Examples:
- `1.2.3-RELEASE` - Production release
- `1.2.3-alpha.202508031914.823869b` - Alpha release
- `1.2.3-beta.202508031915.a1b2c3d` - Beta release

## Core Script: `scripts/version.js`

The central script provides all version management functionality:

### Key Functions

1. **findPackageFiles()**: Automatically discovers all package.json files
2. **updateVersion()**: Updates version across all packages
3. **checkConsistency()**: Validates version consistency
4. **incrementVersion()**: Handles semantic version bumping
5. **getBaseVersion()**: Extracts base version without suffixes

### Commands

| Command | Description | Example |
|---------|-------------|---------|
| `sync` | Synchronize all packages to root version | `node scripts/version.js sync` |
| `bump [type]` | Increment version (patch/minor/major) | `node scripts/version.js bump minor` |
| `set <version>` | Set specific version | `node scripts/version.js set 1.2.3` |
| `check` | Validate version consistency | `node scripts/version.js check` |
| `base` | Get base version (no suffixes) | `node scripts/version.js base` |

## NPM Scripts Integration

The project provides convenient NPM scripts in the root `package.json`:

```json
{
  "scripts": {
    "version:sync": "node scripts/version.js sync",
    "version:bump": "node scripts/version.js bump",
    "version:bump:minor": "node scripts/version.js bump minor",
    "version:bump:major": "node scripts/version.js bump major",
    "version:set": "node scripts/version.js set",
    "version:check": "node scripts/version.js check",
    "version:base": "node scripts/version.js base",
    "precommit": "bun run version:sync"
  }
}
```

### Usage Examples

```bash
# Check current version consistency
bun run version:check

# Sync all packages to root version
bun run version:sync

# Bump patch version (1.2.3 → 1.2.4)
bun run version:bump

# Bump minor version (1.2.3 → 1.3.0)
bun run version:bump:minor

# Bump major version (1.2.3 → 2.0.0)
bun run version:bump:major

# Set specific version
bun run version:set 2.1.0

# Get base version without suffixes
bun run version:base
```

## Git Integration

### Pre-commit Hook

The `.githooks/pre-commit` hook automatically runs before each commit:

```bash
#!/bin/bash
echo "Checking version consistency..."
node scripts/version.js sync
git add **/package.json
echo "✅ Version consistency ensured"
```

This ensures that all commits maintain version consistency across packages.

### Setup Git Hooks

To enable git hooks:

```bash
# Run the setup script
node scripts/setup-hooks.js

# Or manually configure
git config core.hooksPath .githooks
```

## GitHub Actions Workflows

### 1. Version Validation (`version-check.yml`)

Automatically validates version consistency on pull requests:

```yaml
on:
  pull_request:
    branches: [main, develop, test]
```

**What it does:**
- Checks that all package.json files have consistent versions
- Fails the PR if versions are inconsistent
- Provides clear feedback on version mismatches

### 2. Version Operations (`version-operations.yml`)

Reusable workflow for version operations:

**Inputs:**
- `operation`: 'validate' or 'update'
- `release_type`: 'alpha', 'beta', or 'production'
- `should_bump_version`: Whether to increment version
- `version_suffix`: Version suffix to apply

**Outputs:**
- `current_version`: Version before changes
- `new_version`: Version after changes
- `base_version`: Base version without suffixes
- `build_number`: Build number for non-production
- `short_sha`: Commit SHA
- `is_consistent`: Whether versions are consistent

### 3. Manual Version Bump (`manual-version-bump.yml`)

Allows manual version bumping through GitHub Actions:

**Triggers:**
- Manual workflow dispatch
- Configurable version type (minor/major)
- Optional custom version
- Target branch selection

**Process:**
1. Validates inputs
2. Calculates new version
3. Updates all package.json files
4. Updates README badge
5. Commits and pushes changes

## Release Process

### Alpha Releases

Alpha releases are created automatically during development:

1. **Trigger**: Push to feature branches
2. **Version Logic**: 
   - If current base version matches main: bump patch and add alpha suffix
   - If already different: keep current base and add alpha suffix
3. **Format**: `X.Y.Z-alpha.YYYYMMDDHHMM.SHA`

### Beta Releases

Beta releases are created from the develop branch:

1. **Trigger**: Push to develop branch
2. **Version Logic**: Use current base version with beta suffix
3. **Format**: `X.Y.Z-beta.YYYYMMDDHHMM.SHA`

### Production Releases

Production releases are created from the main branch:

1. **Trigger**: Push to main branch
2. **Version Logic**: Use base version with RELEASE suffix
3. **Format**: `X.Y.Z-RELEASE`

## Best Practices

### 1. Version Consistency

- Always ensure versions are consistent before committing
- Use `bun run version:check` regularly
- Let the pre-commit hook handle synchronization

### 2. Version Bumping

- Use semantic versioning principles:
  - **Patch**: Bug fixes, non-breaking changes
  - **Minor**: New features, backwards compatible
  - **Major**: Breaking changes

### 3. Manual Interventions

- Use `bun run version:set` for hotfixes or specific versions
- Always validate with `bun run version:check` after manual changes
- Document reason for manual version changes

### 4. Release Workflow

1. **Development**: Work on feature branches (auto alpha versions)
2. **Integration**: Merge to develop (beta versions)
3. **Release**: Merge to main (production versions)
4. **Hotfixes**: Direct to main with manual version bump

## Troubleshooting

### Common Issues

1. **Version Inconsistency Error**
   ```bash
   ❌ backend/package.json: 1.2.3 (expected: 1.2.4)
   ```
   **Solution**: Run `bun run version:sync`

2. **Git Hook Not Working**
   ```bash
   # Re-setup hooks
   node scripts/setup-hooks.js
   ```

3. **CI/CD Version Validation Failure**
   - Check all package.json files manually
   - Run `bun run version:check` locally
   - Sync versions and commit changes

### Debugging Commands

```bash
# Check which packages exist
node scripts/version.js sync --dry-run

# Manually inspect versions
find . -name "package.json" -not -path "*/node_modules/*" -exec echo {} \; -exec jq -r '.version' {} \;

# Reset all versions to root
bun run version:sync
```

## Advanced Usage

### Custom Version Formats

For special releases, you can set custom versions:

```bash
# Release candidate
bun run version:set 2.0.0-rc.1

# Custom suffix
bun run version:set 1.5.0-hotfix.1

# Production release
bun run version:set 1.2.3-RELEASE
```

### Programmatic Usage

You can import and use the version script functions:

```javascript
import { 
  getCurrentVersion, 
  updateVersion, 
  checkConsistency 
} from './scripts/version.js';

const currentVersion = getCurrentVersion();
const isConsistent = checkConsistency();
```

## Integration with CI/CD

The version management system integrates seamlessly with CI/CD pipelines:

1. **Pull Request Validation**: Ensures version consistency
2. **Automated Releases**: Handles version bumping for different environments
3. **Build Numbering**: Provides unique identifiers for builds
4. **Release Notes**: Uses version information for changelog generation

## Conclusion

This version management system provides:
- **Consistency**: All packages stay synchronized
- **Automation**: Minimal manual intervention required
- **Flexibility**: Supports various release types and workflows
- **Reliability**: Git hooks and CI/CD validation prevent errors
- **Transparency**: Clear versioning scheme for all environments

By following this system, you can maintain clean, consistent versioning across the entire monorepo while supporting complex release workflows.
