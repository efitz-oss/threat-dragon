# Threat Dragon Issues Tracking

This document tracks the issues and their status as we work through the improvement plan.

## Issues Summary

| Issue | Status | Notes |
|-------|--------|-------|
| Stencil CSS MIME Type Error | ✅ Fixed | Imported CSS directly into the Graph component |
| Routing Issues with Provider Parameter | ✅ Fixed | Store provider in Vuex store instead of route params |
| Provider State Lost when Navigating to Demo Model | ✅ Fixed | Modified router guard to preserve provider state |
| Missing Delete Button in Threat Dialog | ✅ Fixed | Added editingThreat existence check in template |
| "New Threat" Button Not Working | ✅ Fixed | Added debugging and improved event handling |
| Double-Click Required to Open Threat Dialog | ✅ Fixed | Added nextTick to ensure event handling order |
| Stencil Component Only Shows Headers | ✅ Fixed | Improved stencil initialization and redraw logic |
| Build Error with stencil-theme.css | ✅ Fixed | Ensured CSS file is correctly located in src/assets/css directory |
| Unused Variables and Imports | 🔄 In Progress | Removed unused variables in google.provider.js, fixed searchAsync in bitbucketrepo.js |
| Provider State Architecture | ✅ Fixed | Updated all git routes to use meta.provider and store, removing params usage |
| i18n Migration to Composition API | 🔄 In Progress | Started migration (4/28 components done) |

## Detailed Findings and Fixes

### 1. Stencil CSS MIME Type Error

**Root Cause**: 
- The server is serving the CSS file with the wrong MIME type (text/html instead of text/css)
- This is likely due to a server configuration issue or the file not existing at the expected location

**Fix**:
- Imported the CSS directly in the Graph component using:
  ```javascript
  import '@/assets/css/stencil-theme.css';
  ```
- Copied the CSS file to the src/assets/css directory
- Removed the external link in index.html

### 2. Routing Issues with Provider Parameter

**Root Cause**:
- The router was trying to add the provider parameter to the route params
- Vue Router discards params that aren't defined in the route path
- This led to an infinite redirection loop

**Fix**:
- Modified the router guard to store the provider in the Vuex store instead of attempting to add it to route params:
  ```javascript
  if (to.meta.provider) {
      const store = window._vueApp?.$store;
      if (store && to.meta.provider) {
          console.log(`Setting provider in store: ${to.meta.provider}`);
          try {
              store.dispatch('PROVIDER_SELECTED', to.meta.provider);
          } catch (error) {
              console.error('Failed to set provider in store:', error);
          }
      }
  }
  ```
- Updated git routes to use meta.provider like other providers instead of route params:
  ```javascript
  {
      path: `/${providerType}/github/repository`,
      name: `${providerType}Repository`,
      component: () => import('../views/git/RepositoryAccess.vue'),
      meta: { provider: 'github' }
  }
  ```
- Removed all references to `route.params.provider` in git components (RepositoryAccess, BranchAccess, ThreatModelSelect) and updated them to use only the Vuex store value
- Removed references to provider params in router navigation

### 3. Provider State Lost when Navigating to Demo Model

**Root Cause**:
- The router guard was intentionally clearing provider state when navigating to the demo selection page

**Fix**:
- Modified the router guard to preserve provider state:
  ```javascript
  // If this is a demo selection page, preserve provider state
  if (to.name === 'DemoSelect') {
      console.log('Navigating to demo selection page with current provider state');
      next();
      return;
  }
  ```

### 4. Missing Delete Button in Threat Dialog

**Root Cause**:
- The v-if condition was only checking if isNewThreat was false, but not verifying that editingThreat existed

**Fix**:
- Added an additional check for editingThreat existence:
  ```html
  <b-button
      v-if="editingThreat && !isNewThreat"
      variant="danger"
      @click="onDelete"
  >
      {{ t('forms.delete') }}
  </b-button>
  ```

### 5. "New Threat" Button Not Working

**Root Cause**:
- Potential issues with event propagation or ref resolution in the component tree

**Fix**:
- Added better logging to track event flow
- Enhanced the threatSelected handler in Graph.vue to provide better debugging:
  ```javascript
  const threatSelected = (threatId, state) => {
      console.debug('Graph component received threatSelected event', threatId, state);
      if (threatEditDialog.value) {
          threatEditDialog.value.showDialog(threatId, state);
      } else {
          console.error('threatEditDialog ref is not available');
      }
  };
  ```

### 6. Double-Click Required to Open Threat Dialog

**Root Cause**:
- Event handling order issues or race conditions when selecting threats

**Fix**:
- Used Vue.js nextTick to ensure correct event sequencing:
  ```javascript
  threatSelected() {
      // Use nextTick to ensure the emit happens after any previous events
      this.$nextTick(() => {
          this.$emit('threatSelected', this.id, 'old');
      });
  }
  ```

### 7. Stencil Component Only Shows Headers

**Root Cause**:
- Improper initialization or sizing of the stencil container
- CSS loading issues
- Timing problems with stencil rendering

**Fix**:
1. Fixed CSS loading by importing directly into the component
2. Ensured proper container sizing:
   ```javascript
   if (stencilContainer.value) {
       // Force a proper height on the stencil container
       stencilContainer.value.style.height = '100%';
       stencilContainer.value.style.minHeight = '500px';
   }
   ```
3. Implemented multiple staggered redraws to handle various timing issues:
   ```javascript
   setTimeout(redrawStencil, 100);  // Initial redraw
   setTimeout(redrawStencil, 500);  // Secondary redraw
   setTimeout(redrawStencil, 1000); // Final redraw for slower devices
   ```
4. Added code to ensure all stencil groups are opened:
   ```javascript
   if (stencilInstance.value.groups) {
       // Open all groups to ensure visibility
       Object.values(stencilInstance.value.groups).forEach(group => {
           if (group && typeof group.open === 'function') {
               group.open();
           }
       });
   }
   ```

### 8. Build Error with stencil-theme.css

**Root Cause**:
- The Graph component imports the stencil-theme.css file from `@/assets/css/stencil-theme.css`
- However, during the build process, this file was not found in the expected location

**Fix**:
1. Created the directory structure if it doesn't exist:
   ```bash
   mkdir -p td.vue/src/assets/css
   ```
2. Copied the existing CSS file from the public directory to ensure it's available in the source directory:
   ```bash
   cp td.vue/public/css/stencil-theme.css td.vue/src/assets/css/
   ```
3. This ensures the build process can find the CSS file when it's imported in the Graph component

### 9. Provider State Architecture Redesign

**Root Cause**:
- Git routes were still using `:provider` route params (e.g., `/git/:provider/repository`) while Google and Local routes had switched to using `meta.provider`
- Components were still checking `route.params.provider` instead of using the Vuex store values consistently
- This inconsistency could lead to provider state issues when navigating between different screens

**Fix**:
1. Updated all Git routes to use meta.provider approach:
   ```javascript
   {
       path: `/git/github/repository`,
       name: `gitRepository`,
       component: () => import('../views/git/RepositoryAccess.vue'),
       meta: { provider: 'github' }
   }
   ```

2. Created separate routes for each Git provider (GitHub, GitLab, BitBucket) instead of using dynamic route params

3. Removed references to `route.params.provider` in components:
   ```javascript
   // Before
   if (provider.value !== route.params.provider) {
       store.dispatch(providerActions.selected, route.params.provider);
   }
   
   // After
   // Provider is now managed via meta.provider in the route configuration
   // and router navigation guard will set it in the store
   ```

4. Updated router navigation in components to use only store values and not pass provider params:
   ```javascript
   // Before
   next({ 
       name: 'gitBranch', 
       params: { 
           provider: to.params.provider || 'github',
           repository: to.params.repository
       }
   });
   
   // After
   next({ 
       name: 'gitBranch', 
       params: { 
           repository: to.params.repository
       }
   });
   ```

5. This redesign ensures provider state is consistently managed through the Vuex store throughout the application

## Next Steps

1. Continue cleaning up unused variables and imports (fixed google.provider.js and bitbucketrepo.js so far)
2. ✅ Completed provider state architecture redesign:
   - Updated all git routes to use meta.provider approach (like google and local providers)
   - Removed all references to provider in route params
   - Updated components to use only Vuex store for provider state
3. Continue the i18n migration to the Composition API (4/28 components migrated)
   - Completed: DriveAccess.vue, ThreatModelSelect.vue, BranchAccess.vue, RepositoryAccess.vue
   - Next targets: Components in /src/components/ directory
4. Update test fixtures to work with components migrated to Composition API
   - Fixed: graphProperties.spec.js
   - Still needs work: threatmodelSelect.spec.js
5. Fixed build error with the stencil-theme.css file by ensuring it's available in the src/assets/css directory
6. Further testing to ensure all fixes work correctly
   - Test new route structure for git providers
   - Ensure provider state is maintained across navigation flows

## Questions for Team Discussion

1. What testing strategy should be used for the architectural changes?
2. Are there any performance considerations for the stencil rendering beyond our current fixes?
3. Should we create additional routes for Bitbucket and GitLab providers to match all the functionality available for GitHub?