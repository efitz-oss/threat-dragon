# Vue-Demi Error Fix

## Problem
During the Vue 3 migration, we encountered an error when running the application:

```
"default" is not exported by "../node_modules/vue/dist/vue.esm-bundler.js", imported by "../node_modules/vue-demi/lib/index.mjs"
```

This error occurs because Vue 3 uses named exports instead of default exports, but vue-demi (a compatibility layer between Vue 2 and Vue 3) was trying to import Vue using a default import.

## Solution

1. Created a custom shim for vue-demi that:
   - Imports Vue as a namespace using `import * as VueModule from 'vue'`
   - Provides all the necessary exports vue-demi expects
   - Implements compatibility functions like `set()` and `del()` that were in Vue 2 but removed in Vue 3
   - Provides all the necessary exports for Pinia to work properly

2. Modified the `vite.config.js` file to alias vue-demi to our custom shim:
   ```js
   resolve: {
     alias: {
       '@': path.resolve(__dirname, 'src'),
       'vue': 'vue/dist/vue.esm-bundler.js',
       'vue-demi': path.resolve(__dirname, 'src/shims/vue-demi-index.mjs')
     }
   }
   ```

3. Updated the `src/service/schema/ajv.js` file to use the Vue 3 Composition API syntax for toast notifications:
   - Replaced `Vue.$toast.warning()` with `const toast = useToast(); toast.warning()`
   - Imported the useToast function from vue-toastification

## Explanation
Vue-demi is a dependency of Pinia and several other libraries. It acts as a compatibility layer to allow libraries to support both Vue 2 and Vue 3 with the same codebase. The error occurred because Vue 3 doesn't provide a default export, but libraries like vue-demi still expect it. 

Our shim provides a compatibility layer that fixes these API mismatches without requiring changes to the libraries themselves.

## Related Dependencies
- `pinia` - Uses vue-demi
- `@vueuse/core` - Uses vue-demi
- `@antv/x6-vue-shape` - Uses vue-demi
- `@pinia/testing` - Uses vue-demi

## Notes
- This solution allows us to continue the Vue 3 migration without having to wait for upstream dependencies to be updated
- The application now builds and runs successfully
- This is a temporary solution until all dependencies properly support Vue 3