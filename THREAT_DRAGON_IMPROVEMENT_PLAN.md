# Threat Dragon Improvement Plan

This document outlines the issues identified in the Threat Dragon application and proposes solutions for each one. It also includes a roadmap for implementation.

## 1. Current Issues

### 1.1 UI/UX Issues
- ✅ **Stencil CSS MIME Type Error**: The CSS file for stencils is not being served with the correct MIME type
  - **Solution**: Import the CSS directly in the Graph component instead of using an external file
- ✅ **Routing/Navigation Issues**: Provider parameter is being discarded, causing infinite redirection loop
  - **Solution**: Store provider in Vuex store instead of route params
- **Dashboard to Demo Model Navigation**: Navigating from dashboard to select a demo model clears provider state
  - **Solution**: Preserve provider state when navigating to demo models
- **Threat Dialog Issues**: 
  - The edit threat dialog doesn't display the delete button for existing threats
  - The "new threat" button doesn't do anything
  - Users need to click a threat twice to open the edit threat dialog
- **Stencil Component Display**: Stencil component doesn't display any stencils, only the section headers

### 1.2 Architecture Issues
- **Provider State Management**: Current provider state is a single entity, which leads to confusion
  - **Solution**: Separate provider state into authentication and storage components

## 2. Detailed Solutions

### 2.1 Preserve Provider State When Navigating to Demo Models

The issue is in the router guard that clears provider state when navigating to demo selection:

```javascript
// If this is a demo selection page, clear provider state before proceeding
if (to.name === 'DemoSelect') {
    console.log('Navigating to demo selection page - no provider needed');
    next();
    return;
}
```

**Solution**: Modify the router guard to preserve provider state:

```javascript
// If this is a demo selection page, just proceed with current provider
if (to.name === 'DemoSelect') {
    console.log('Navigating to demo selection page with current provider');
    next();
    return;
}
```

### 2.2 Fix Threat Dialog Issues

1. **Missing Delete Button**:
   - Check the ThreatEditDialog component's template and logic
   - Ensure the v-if or v-show condition for the delete button correctly evaluates based on existing threat data

2. **"New Threat" Button Not Working**:
   - Debug the click event handler for the new threat button
   - Ensure the threatSuggest method is being called and is properly implemented
   - Check that the ThreatSuggestDialog component is properly initialized

3. **Double-Click Requirement**:
   - Fix the event propagation in the threat selection handler
   - Ensure the first click properly registers and opens the dialog

### 2.3 Fix Stencil Component Display

The stencil issue is likely related to:
1. CSS styling issues
2. X6 graph initialization
3. Data loading problems

**Solution**:
- Ensure X6 graph is properly initialized
- Verify stencil data is correctly loaded
- Debug the stencil rendering mechanism
- Ensure stencil container has proper dimensions

### 2.4 Provider State Architecture Redesign

#### Current Architecture
Currently, the application uses a single state for the provider:
```javascript
state: {
  provider: {
    selected: 'google' // or 'github', 'local', etc.
  }
}
```

#### Proposed Architecture
Split the provider state into two distinct concepts:

```javascript
state: {
  authentication: {
    provider: 'oauth', // or 'local', etc.
    isAuthenticated: true,
    user: { ... }
  },
  storage: {
    provider: 'google_drive', // or 'git', 'local', etc.
    selectedFolder: '...',
    settings: { ... }
  }
}
```

This allows for more flexible combinations:
- OAuth auth + Google Drive storage
- OAuth auth + Git storage
- Local auth + Local storage
- Current auth provider + Demo storage

## 3. Implementation Plan

### Phase 1: Critical Fixes
1. ✅ **Fix stencil-theme.css MIME type issue**
2. ✅ **Fix routing issues with provider parameter**
3. **Fix threat dialog issues**:
   - Implement delete button display
   - Fix "new threat" button functionality
   - Fix double-click requirement

### Phase 2: UI/UX Improvements
1. **Fix stencil component display**
2. **Fix provider state preservation when navigating to demo models**
3. **Clean up all unused variables and imports**:
   - Remove comments related to completed work
   - Remove unused code

### Phase 3: Architecture Redesign
1. **Separate provider state**:
   - Create new authentication and storage modules
   - Update components to use new state structure
   - Add migration/compatibility layer for backwards compatibility

2. **Complete i18n migration to composition model**:
   - Identify remaining components using legacy i18n
   - Convert them to use the composition API

## 4. Testing Plan

For each phase:
1. **Unit Tests**:
   - Add/update unit tests for modified components
   - Ensure test coverage is maintained or improved

2. **Integration Tests**:
   - Test navigation flows
   - Test provider switching
   - Test model creation and editing

3. **E2E Tests**:
   - Test complete user workflows
   - Verify fixes solve the original issues

## 5. Implementation Approach

1. **For each issue**:
   - Create a separate branch
   - Implement the fix
   - Test thoroughly
   - Create a PR for review

2. **For the architecture redesign**:
   - Create a design document with detailed changes
   - Implement changes iteratively
   - Ensure backward compatibility
   - Add comprehensive tests

## 6. Metrics for Success

1. No JavaScript console errors
2. Smooth navigation between all pages
3. Consistent provider state throughout the application
4. Fully functional threat editing
5. Properly displayed stencil components
6. Clean separation of authentication and storage providers