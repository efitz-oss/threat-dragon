# I18N Migration to Composition API

This document tracks the migration of internationalization (i18n) from Vue 2's Options API to Vue 3's Composition API.

## Migration Status

| Status | Description | Count |
|--------|-------------|-------|
| ✅ | Components migrated to Composition API | 4 |
| 🔄 | Components in progress | 0 |
| 📝 | Components not yet migrated | 24 |

## Current Approach

Currently, Threat Dragon is in the process of migrating from the Options API approach for i18n:

```javascript
// Old Options API approach
export default {
  methods: {
    example() {
      return this.$t('some.translation.key');
    }
  }
}
```

To the Composition API approach:

```javascript
// New Composition API approach
import { useI18n } from '@/i18n';

export default {
  setup() {
    const { t } = useI18n();
    
    const example = () => {
      return t('some.translation.key');
    };
    
    return {
      example,
      t // Expose t to the template
    };
  }
}
```

## Components to Review

The following components need to be checked and potentially migrated:

### Vue Components

- [ ] Components in `/src/components/`
- [ ] Views in `/src/views/`
- [ ] Layouts in `/src/layouts/` (if exists)

### Special Handling for Testing

- [ ] Test utility files for i18n mocking
- [ ] Test cases using i18n

## Common Migration Patterns

### 1. Basic Translation Reference

**Before**:
```html
<template>
  <div>{{ $t('key') }}</div>
</template>
```

**After**:
```html
<template>
  <div>{{ t('key') }}</div>
</template>

<script>
import { useI18n } from '@/i18n';

export default {
  setup() {
    const { t } = useI18n();
    return { t };
  }
}
</script>
```

### 2. Computed Properties with Translations

**Before**:
```javascript
computed: {
  label() {
    return this.$t('some.label');
  }
}
```

**After**:
```javascript
setup() {
  const { t } = useI18n();
  
  const label = computed(() => t('some.label'));
  
  return { label, t };
}
```

### 3. Dynamic Translation Keys

**Before**:
```javascript
methods: {
  getLabel(key) {
    return this.$t(`labels.${key}`);
  }
}
```

**After**:
```javascript
setup() {
  const { t } = useI18n();
  
  const getLabel = (key) => t(`labels.${key}`);
  
  return { getLabel, t };
}
```

## Migration Plan

1. **Audit**: Identify all components using i18n
2. **Prioritize**: Start with the simplest components first
3. **Test**: Ensure all translations work as expected
4. **Refactor**: Clean up code after migration

## Best Practices

1. Always expose the `t` function to the template if translations are used there
2. Use computed properties for translations used in multiple places
3. Use composition API consistently across the application
4. Add unit tests to verify translations are working

## Common Issues

1. **Missing Translations**: Ensure all keys exist in all language files
2. **Context Loss**: The Composition API uses closure scope rather than `this`
3. **Testing**: Update test mocks for the new i18n approach

## Benefits of Migration

1. **Improved TypeScript Support**: Better type checking for translation keys
2. **Component Logic Organization**: Group related functionality
3. **Code Reuse**: Extract translation logic into composables
4. **Performance**: Potential performance improvements with Vue 3

## Next Steps

1. Audit all components in the codebase
2. Create a detailed list of components requiring migration
3. Start migration with simple components
4. Create tests to verify correct i18n behavior

---

## Component Migration Tracking

This tracking list will be updated as components are migrated.

| Component | Status | Notes |
|-----------|--------|-------|
| /views/google/DriveAccess.vue | ✅ | Migrated to Composition API |
| /views/git/ThreatModelSelect.vue | ✅ | Migrated to Composition API, also converted to full Composition API |
| /views/git/BranchAccess.vue | ✅ | Migrated to Composition API, also converted to full Composition API |
| /views/git/RepositoryAccess.vue | ✅ | Migrated to Composition API, also converted to full Composition API |