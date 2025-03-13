<template>
    <Button
        :id="`${provider.key}-login-btn`"
        class="p-button-secondary login-btn"
        :loading="isLoading"
        :disabled="isLoading"
        @click="onProviderClick"
    >
        <font-awesome-icon v-if="!isLoading" :icon="provider.icon" class="fa-button-icon" />
        <span>
            {{ $t(`providers.${provider.key}.loginWith`) }}
            {{ $t(`providers.${provider.key}.displayName`) }}
        </span>
    </Button>
    <!-- Debug info -->
    <div class="debug-info">Provider: {{ provider.key }}</div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { providerNames } from '@/service/provider/providers.js';
import loginApi from '@/service/api/loginApi.js';
import { useProviderStore } from '@/stores/provider';
import { useAuthStore } from '@/stores/auth';
import Button from 'primevue/button';
import { ref } from 'vue';

// Props
const props = defineProps({
    provider: {
        type: Object,
        required: true,
    },
});

// Composables
const router = useRouter();
const providerStore = useProviderStore();
const authStore = useAuthStore();

// State
const isLoading = ref(false);

// Methods
const onProviderClick = async () => {
    if (isLoading.value) return;

    isLoading.value = true;
    console.debug(`login with provider: ${props.provider.key}`);

    try {
        await providerStore.selectProvider(props.provider.key);

        if (
            props.provider.key === providerNames.local ||
                props.provider.key === providerNames.desktop
        ) {
            authStore.setLocal();
            router.push('/dashboard');
            return;
        }

        const resp = await loginApi.loginAsync(props.provider.key);
        window.location.href = resp.data;
    } catch (error) {
        console.error('Login error:', error);
        isLoading.value = false;
    }
};
</script>

<style lang="scss" scoped>
    @import '@/styles/icons.scss';

    .login-btn {
        margin: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
    }

    .debug-info {
        display: none;
    }
</style>
