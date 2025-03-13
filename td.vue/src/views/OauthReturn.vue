<template>
    <div />
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProviderStore } from '@/stores/provider';
import { useAuthStore } from '@/stores/auth';
import loginApi from '@/service/api/loginApi.js';

// Composables
const route = useRoute();
const router = useRouter();
const providerStore = useProviderStore();
const authStore = useAuthStore();

// Computed
const provider = computed(() => providerStore.selected);

// Lifecycle
onMounted(async () => {
    try {
        const resp = await loginApi.completeLoginAsync(provider.value, route.query.code);
        authStore.setJwt(resp.data);
        router.push('/dashboard');
    } catch (ex) {
        console.error('Error getting token');
        console.error(ex);
        throw ex;
    }
});
</script>
