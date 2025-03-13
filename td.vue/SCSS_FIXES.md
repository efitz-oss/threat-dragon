# SCSS Fixes and Simplification

This document summarizes the changes made to fix SCSS deprecation warnings, build issues, and simplify the CSS/SCSS structure in the Threat Dragon project.

## Background

1. **Deprecation Warnings**: Sass has deprecated the use of `/` for division operations since Sass 1.33.0, and it's scheduled to be removed in a future version. 

2. **Build Errors**: Vue CLI builds were failing with errors related to SCSS `@use` directives:
   ```
   Syntax Error: @use rules must be written before any other rules.
   ```
   The issue was that the `@use "sass:math";` directive needs to be at the top of SCSS files before any other rules.

## Changes Made

1. **Added `@use "sass:math"` Module**:
   - Ensured all SCSS files have the `@use "sass:math";` import at the top
   - This is required for using the new math functions

2. **Created Helper Functions**:
   - Added `add($a, $b)` for addition operations
   - Added `math.div($a, $b)` for division operations
   - Added `safe-abs($value)` for handling math with percentages

3. **Updated SCSS Files**:
   - Modified `scss-globals.scss` to import necessary variables and provide utility functions
   - Created `scss-helper.scss` with only the math module import
   - Added explicit imports in Vue components that need SCSS variables

4. **Fixed Component Styles**:
   - Changed `$header-height + 15px` to `add($header-height, 15px)`
   - Changed `$header-height - 10` to `($header-height - 10)`

5. **Created Fix Scripts**:
   - `fix-scss-issues.js`: Fixes SCSS file positions of `@use` directives
   - `build-no-warnings.js`: Builds the project while bypassing problematic plugins

## Benefits

- No more deprecation warnings during build
- Fixed build errors related to SCSS directive placement
- Future-proof code for upcoming Sass versions
- More explicit math operations with better readability
- Consistent approach across the codebase

## Files Modified

1. `/src/styles/scss-globals.scss` - Added helper functions and imports (now consolidated into scss-includes.scss)
2. `/src/styles/scss-helper.scss` - Created helper file with only math module (no longer needed)
3. `/src/styles/scss-includes.scss` - Consolidated utility functions and imports
4. `/src/styles/primevue-variables.scss` - Consolidated color variables
5. `/src/styles/colors.scss` - Deprecated (consolidated into primevue-variables.scss)
6. `/src/components/Navbar.vue` - Updated math operations and added explicit imports
7. `/src/App.vue` - Updated math operations and added explicit imports
8. `/src/main.js` - Updated stylesheet import order

## Build Solutions

### Solution 1: Use `fix-scss-issues.js` and `build-no-warnings.js`

The most reliable approach is:

1. Run the SCSS fix script first:
   ```
   node fix-scss-issues.js
   ```

2. Then build the project with the modified build script:
   ```
   node build-no-warnings.js
   ```

### Solution 2: Add explicit imports to components

If you're still encountering issues, add explicit imports to your component styles:

```scss
<style lang="scss" scoped>
@import '../styles/scss-globals.scss';
@import '../styles/colors.scss';

/* Your component styles here */
</style>
```

## How It Works

The `style-resources-loader` in `vue.config.js` automatically includes `scss-globals.scss` in all component styles, but when this causes issues, we either:

1. Skip the style-resources-loader plugin using the `--skip-plugins` flag
2. Add explicit imports to components that need SCSS variables
3. Fix the position of `@use` directives in all SCSS files

This approach ensures the build process works correctly while maintaining the SCSS functionality.

## Recent Simplification (March 2025)

As part of our ongoing efforts to simplify the CSS/SCSS structure, we've made the following additional changes:

### 1. Consolidated Color Variables
- Merged `colors.scss` into `primevue-variables.scss`
- Standardized on the British spelling `$grey` (not `$gray`)
- Organized colors into core and additional categories

### 2. Simplified SCSS Utilities
- Consolidated `scss-math.scss` and `scss-globals.scss` into `scss-includes.scss`
- Maintained all utility functions in a single file
- Streamlined import structure

### 3. Updated Import Structure
- Added direct import of `scss-includes.scss` in main.js
- Clarified stylesheet purpose with comments
- Created a more logical import order

### 4. Documentation
- Updated `deprecated-files.txt` to track consolidated files
- Created `CSS_STANDARDS.md` to document CSS/SCSS standards
- Added guidelines for future CSS development

For more details on CSS standards, see `CSS_STANDARDS.md`.