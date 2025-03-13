# Migration Cleanup Guide

This document explains the post-migration cleanup process for the OWASP Threat Dragon project.

## Cleanup Actions

After completing the Vue 3 migration and Bootstrap removal, we've taken these additional cleanup steps:

1. **Consolidated Build Scripts**:
   - Created a unified `build.js` script that replaces both `build-no-warnings.js` and `build-safe.js`
   - Added command-line options for security checks and bundle analysis

2. **Archived Migration Files**:
   - Created a `cleanup-migration-files.js` script to archive files that are no longer needed
   - Files are moved to a `.migration-archive` directory rather than being deleted outright
   - This preserves the migration history while decluttering the workspace

## Files Archived

The following files are no longer needed in the main workspace and can be archived:

1. **Migration Scripts**:
   - `rename-vue3-files.js`
   - `tests/scripts/migrate-all-components.js`
   - `tests/scripts/migrate-all-views.js`
   - `tests/scripts/migrate-tests.js`

2. **Migration Documentation**:
   - `VUE3_MIGRATION.md` (replaced by `VUE3_MIGRATION_COMPLETED.md`)
   - `UI_MIGRATION_PROGRESS.md`
   - Various test migration documents in the `tests/` directory

## Updated npm Scripts

The package.json has been updated with the following scripts:

1. **New Scripts**:
   - `build` - Uses the new unified build script
   - `build:security` - Builds with security checks
   - `build:analyze` - Builds with bundle analysis
   - `cleanup:migration` - Archives migration-related files

2. **Removed Scripts**:
   - `build:no-warnings` - Replaced by the unified build script
   - `build:safe` - Replaced by `build:security`

## How to Use

### Archiving Migration Files

To archive migration-related files:

```bash
npm run cleanup:migration
```

This will move all migration-related files to the `.migration-archive` directory.

### Building the Application

To build the application:

```bash
# Standard build (with SCSS warnings silenced)
npm run build

# Build with security checks
npm run build:security

# Build with bundle analysis
npm run build:analyze
```

## Benefits

1. **Cleaner Workspace**: Removes files that are no longer needed
2. **Simpler Workflows**: Consolidates multiple scripts into a single, more powerful script
3. **Better Organization**: Preserves migration history without cluttering the main workspace
4. **Improved Documentation**: Clearly explains the cleanup process and available tools

## Next Steps

After running the cleanup:

1. Review the archived files to ensure nothing important was moved
2. Run the new build script to verify it works correctly
3. Consider permanently deleting the .migration-archive directory once you're confident it's no longer needed