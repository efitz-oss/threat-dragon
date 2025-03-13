<template>
    <div>
        <td-navbar />
        <div class="app-container">
            <ProgressSpinner v-if="loaderStore.loading" class="loading-spinner" />
            <div class="content-area" :class="{ 'content-loading': loaderStore.loading }">
                <div v-if="routerError" class="router-error">
                    <h2>Router Error</h2>
                    <pre>{{ routerError }}</pre>
                </div>
                <router-view></router-view>
            </div>
        </div>
        <Toast position="bottom-right" />
    </div>
</template>

<script setup>
import { onMounted, ref, onErrorCaptured } from 'vue';
import TdNavbar from '@/components/Navbar.vue';
import { useLoaderStore } from '@/stores/loader';
import { useRouter } from 'vue-router';

// PrimeVue components
import ProgressSpinner from 'primevue/progressspinner';
import Toast from 'primevue/toast';

// Store instances
const loaderStore = useLoaderStore();
const router = useRouter();
const routerError = ref(null);

// Error handling
onErrorCaptured((err, instance, info) => {
    console.error('Error captured in App.vue:', err);
    routerError.value = {
        message: err.message,
        stack: err.stack,
        info: info,
        componentName: instance?.$options?.name || 'Unknown component'
    };
    return false; // prevent propagation
});

// Preload critical components for common views
const preloadCriticalComponents = () => {
    if ('requestIdleCallback' in window) {
        window.requestIdleCallback(
            () => {
                import('./components/FormButton.vue');
                import('./components/KeyValueCard.vue');
            },
            { timeout: 2000 }
        );
    } else {
        setTimeout(() => {
            import('./components/FormButton.vue');
            import('./components/KeyValueCard.vue');
        }, 1000);
    }
};

// Lifecycle hooks
onMounted(() => {
    console.log('App.vue mounted');
    loaderStore.finishLoading();
    preloadCriticalComponents();
    
    // Subscribe to router errors
    router.onError((error) => {
        console.error('Router error:', error);
        routerError.value = {
            message: error.message,
            stack: error.stack,
            source: 'Router error handler'
        };
    });
});
</script>

<style lang="scss">
    @import '@/styles/primevue-variables.scss';
    @import '@/styles/scss-includes.scss';
    @import '@/styles/fonts.scss';

    .app-container {
        font-size: 20px;
        line-height: 1.42857143;
        margin-top: calc(#{$header-height} + 10px);
        padding: 0 1rem;
        min-height: calc(100vh - (#{$header-height} + 10px));
        position: relative;
    }
    
    .router-error {
        margin: 2rem;
        padding: 1rem;
        background-color: #ffdddd;
        border: 1px solid #ff0000;
        border-radius: 5px;
        color: #990000;
        
        pre {
            white-space: pre-wrap;
            background-color: #fff;
            padding: 1rem;
            margin-top: 1rem;
            border-radius: 3px;
            overflow: auto;
            max-height: 300px;
        }
    }

    .loading-spinner {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1000;
    }

    .view-loading {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 50vh;
    }

    .content-area {
        transition: opacity 0.3s ease;
        &.content-loading {
            opacity: 0.6;
            pointer-events: none;
        }
    }

    /* Transition animations for route changes */
    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.15s ease-out;
    }

    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
    }
</style>
