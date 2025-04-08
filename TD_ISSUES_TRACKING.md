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
| Unused Variables and Imports | 🔄 In Progress | Ongoing cleanup |
| Provider State Architecture | 📝 Planned | Split into auth and storage components |
| i18n Migration to Composition API | 📝 Planned | Need to identify remaining components |

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

## Next Steps

1. Continue cleaning up unused variables and imports
2. Design and implement the provider state architecture redesign to separate authentication from storage
3. Complete the i18n migration to the Composition API
4. Further testing to ensure all fixes work correctly

## Questions for Team Discussion

1. Should the provider state redesign be implemented as a breaking change or with backward compatibility?
2. What testing strategy should be used for the architectural changes?
3. Are there any performance considerations for the stencil rendering beyond our current fixes?