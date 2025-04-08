# Provider Architecture Redesign

## Current State

Currently, the Threat Dragon application uses a single state for provider management:

```javascript
// Current state structure
{
  provider: {
    selected: 'google' // or 'github', 'local', 'gitlab', etc.
  }
}
```

This creates several issues:
1. The provider state conflates authentication and storage concerns
2. Navigating between providers causes loss of authentication state
3. Demo models don't maintain the current provider
4. The router navigation is tightly coupled to the provider state

## Proposed Architecture

We propose separating the provider state into two distinct concepts:

### 1. Authentication Provider

Manages user authentication and identity:

```javascript
{
  auth: {
    provider: 'oauth', // or 'local', etc.
    isAuthenticated: true,
    user: {
      id: '123',
      name: 'John Doe',
      email: 'john@example.com'
    },
    tokens: {
      accessToken: '...',
      refreshToken: '...',
      expiresAt: 1234567890
    }
  }
}
```

### 2. Storage Provider

Manages where threat models are stored:

```javascript
{
  storage: {
    provider: 'google_drive', // or 'git', 'local', etc.
    selectedFolder: '...',
    selectedRepository: '...',
    selectedBranch: '...',
    settings: { ... }
  }
}
```

## Implementation Plan

### Phase 1: State Structure Changes

1. Create new Vuex modules for `auth` and `storage`
2. Migrate data from the current `provider` module
3. Add compatibility layer to maintain backward compatibility with existing code

```javascript
// modules/auth.js
export default {
  namespaced: true,
  state: {
    provider: null,        // 'oauth', 'local', etc.
    isAuthenticated: false,
    user: null,
    tokens: null
  },
  getters: {
    // New getters
    getAuthProvider: state => state.provider,
    isAuthenticated: state => state.isAuthenticated,
    
    // Compatibility getters
    isOAuthProvider: state => state.provider === 'oauth'
  },
  mutations: { ... },
  actions: { ... }
};

// modules/storage.js
export default {
  namespaced: true,
  state: {
    provider: null,        // 'google_drive', 'git', 'local', etc.
    selectedFolder: null,
    selectedRepository: null,
    selectedBranch: null
  },
  getters: {
    // New getters
    getStorageProvider: state => state.provider,
    
    // Compatibility getters
    providerRequiresAuth: state => ['google_drive', 'git'].includes(state.provider)
  },
  mutations: { ... },
  actions: { ... }
};
```

### Phase 2: Component Updates

Update components to use the new state structure:

```javascript
// Before
computed: {
  provider() {
    return this.$store.state.provider.selected;
  }
}

// After
computed: {
  authProvider() {
    return this.$store.state.auth.provider;
  },
  storageProvider() {
    return this.$store.state.storage.provider;
  }
}
```

### Phase 3: Router Integration

Update router guards to work with the new state structure:

```javascript
router.beforeEach((to, from, next) => {
  // Route requires authentication
  if (to.meta.requiresAuth && !store.getters['auth/isAuthenticated']) {
    next({ name: 'login' });
    return;
  }
  
  // Route requires specific storage provider
  if (to.meta.storageProvider) {
    store.dispatch('storage/setProvider', to.meta.storageProvider);
  }
  
  next();
});
```

### Phase 4: Provider Mapping

Create a mapping between authentication and storage providers:

```javascript
const providerMapping = {
  oauth: ['google_drive', 'git'],
  local: ['local']
};

// Helper function to check if an auth provider can use a storage provider
function canUseStorageProvider(authProvider, storageProvider) {
  return providerMapping[authProvider]?.includes(storageProvider) ?? false;
}
```

## Provider Combinations

The new architecture enables these combinations:

| Auth Provider | Storage Provider | Use Case |
|---------------|-----------------|----------|
| oauth         | google_drive    | Cloud storage with Google authentication |
| oauth         | git             | Git repository storage with OAuth |
| local         | local           | Local file storage without authentication |
| oauth         | demo            | Demo models with current authentication |
| local         | demo            | Demo models without authentication |

## Backward Compatibility

To maintain backward compatibility:

1. Keep the existing `provider` module but make it a facade over the new modules
2. Add computed properties that derive legacy values from the new state

```javascript
// modules/provider.js (facade)
export default {
  namespaced: true,
  state: {
    get selected() {
      // Map the new providers to the old format
      const authProvider = this.$store.state.auth.provider;
      const storageProvider = this.$store.state.storage.provider;
      
      // Legacy mapping logic
      if (storageProvider === 'google_drive') return 'google';
      if (storageProvider === 'git') {
        // Additional logic to determine github/gitlab/etc.
        return this.$store.state.storage.gitProvider || 'github';
      }
      return storageProvider || 'local';
    }
  },
  actions: {
    PROVIDER_SELECTED({ dispatch }, provider) {
      // Map old provider to new auth/storage providers
      let authProvider, storageProvider;
      
      switch (provider) {
        case 'google':
          authProvider = 'oauth';
          storageProvider = 'google_drive';
          break;
        case 'github':
        case 'gitlab':
          authProvider = 'oauth';
          storageProvider = 'git';
          dispatch('storage/setGitProvider', provider);
          break;
        case 'local':
          authProvider = 'local';
          storageProvider = 'local';
          break;
        default:
          authProvider = 'local';
          storageProvider = provider;
      }
      
      dispatch('auth/setProvider', authProvider);
      dispatch('storage/setProvider', storageProvider);
    }
  }
};
```

## Migration Strategy

1. Start by creating the new modules with empty states
2. Implement the facade module for backward compatibility
3. Gradually update components to use the new state structure
4. Add migration code to convert existing stored state

## Benefits

1. **Clearer Separation of Concerns**: Authentication is separate from storage location
2. **Improved State Persistence**: Authentication state can persist across provider changes
3. **More Flexible Provider Combinations**: Mix and match auth and storage providers
4. **Enhanced Demo Experience**: Demo models work with any authentication provider
5. **Simplified Routing**: Route handling becomes more straightforward

## Challenges

1. **Backward Compatibility**: Ensuring existing code continues to work
2. **State Migration**: Migrating stored state in localStorage
3. **Testing**: Comprehensive testing of all provider combinations
4. **Documentation**: Updating documentation to reflect the new architecture

## Next Steps

1. Create detailed implementation tickets
2. Prioritize the work in the roadmap
3. Implement in a separate branch with comprehensive testing
4. Review the implementation before merging