# Threat Dragon Issues Tracking

This document tracks the issues and their status as we work through the improvement plan.

## Issues Summary

| Issue | Status | Notes |
|-------|--------|-------|
| Stencil CSS MIME Type Error | ✅ Fixed | Imported CSS directly into the Graph component |
| Routing Issues with Provider Parameter | ✅ Fixed | Store provider in Vuex store instead of route params |
| Provider State Lost when Navigating to Demo Model | 🔄 In Progress | Need to modify router guard |
| Missing Delete Button in Threat Dialog | 🔄 In Progress | Need to check ThreatEditDialog component |
| "New Threat" Button Not Working | 🔄 In Progress | Need to debug event handler |
| Double-Click Required to Open Threat Dialog | 🔄 In Progress | Likely event propagation issue |
| Stencil Component Only Shows Headers | 🔄 In Progress | Need to debug stencil rendering |
| Unused Variables and Imports | 🔄 In Progress | Ongoing cleanup |
| Provider State Architecture | 📝 Planned | Split into auth and storage components |
| i18n Migration to Composition API | 📝 Planned | Need to identify remaining components |

## Detailed Findings

### 1. Stencil CSS MIME Type Error

**Root Cause**: 
- The server is serving the CSS file with the wrong MIME type (text/html instead of text/css)
- This is likely due to a server configuration issue or the file not existing at the expected location

**Fix**:
- Import the CSS directly into the Graph component
- Remove the external link in index.html
- Copy the CSS file to the src/assets/css directory

### 2. Routing Issues with Provider Parameter

**Root Cause**:
- The router was trying to add the provider parameter to the route params
- Vue Router discards params that aren't defined in the route path
- This led to an infinite redirection loop

**Fix**:
- Store the provider in the Vuex store instead of route params
- This avoids the Vue Router warning about discarded parameters

### 3. Provider State Lost when Navigating to Demo Model

**Current Implementation**:
```javascript
// If this is a demo selection page, clear provider state before proceeding
if (to.name === 'DemoSelect') {
    console.log('Navigating to demo selection page - no provider needed');
    next();
    return;
}
```

**Planned Fix**:
- Modify the router guard to preserve provider state when navigating to demo models

### 4. Missing Delete Button in Threat Dialog

**Investigation Needed**:
- Check the ThreatEditDialog component for conditional rendering of the delete button
- Verify the threat data structure includes necessary flags for showing the delete button

### 5. "New Threat" Button Not Working

**Investigation Needed**:
- Debug the click event handler for the new threat button
- Check event propagation and component communication

### 6. Double-Click Required to Open Threat Dialog

**Investigation Needed**:
- Analyze the event handling in the threat selection process
- Check for event propagation issues or state management problems

### 7. Stencil Component Only Shows Headers

**Investigation Needed**:
- Check X6 graph initialization
- Verify stencil data is being correctly loaded
- Debug the stencil rendering process

### 8. Provider State Architecture Redesign

**Current State**:
- Single provider state for both authentication and storage

**Planned Changes**:
- Split into separate authentication and storage states
- Update components to use the new state structure
- Add compatibility layer for backward compatibility

## Next Steps

1. Investigate and fix the threat dialog issues
2. Debug the stencil component display
3. Fix provider state preservation when navigating to demo models
4. Continue cleaning up unused variables and imports
5. Design and implement the provider state architecture redesign
6. Complete the i18n migration to the Composition API

## Questions for Team Discussion

1. Should the provider state redesign be implemented as a breaking change or with backward compatibility?
2. What testing strategy should be used for the architectural changes?
3. Are there any performance considerations for the stencil rendering?