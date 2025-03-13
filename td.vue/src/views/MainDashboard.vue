<template>
    <div class="dashboard-container p-4">
        <!-- Row 1: Welcome Card -->
        <div class="dashboard-row mb-4">
            <div class="welcome-card">
                <div class="welcome-content">
                    <h1>{{ $t('dashboard.welcome.title') }}</h1>
                    <p class="description">
                        {{ $t('dashboard.welcome.description') }}
                    </p>
                </div>
            </div>
        </div>

        <!-- Row 2: Dashboard Actions -->
        <div class="dashboard-row">
            <div class="action-grid-container">
                <div class="action-grid">
                    <td-dashboard-action
                        v-for="(action, idx) in actions"
                        :key="idx"
                        :to="action.to"
                        :icon="action.icon"
                        :icon-preface="action.iconPreface"
                        :description="action.key"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useProviderStore } from '@/stores/provider';
import TdDashboardAction from '@/components/DashboardAction.vue';
import { getDashboardActions } from '@/service/provider/providers.js';

// Stores
const providerStore = useProviderStore();

// Computed properties
const actions = computed(() => getDashboardActions(providerStore.selected));
</script>

<style lang="scss" scoped>
    @import '@/styles/primevue-variables.scss';

    .dashboard-container {
        max-width: 1200px;
        margin: 0 auto;
        width: 100%;
    }

    .dashboard-row {
        width: 100%;
        display: flex;
        justify-content: center;
        margin-bottom: 2rem;
    }

    // Welcome card styling
    .welcome-card {
        background-color: $verylight-grey;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba($black, 0.1);
        overflow: hidden;
        width: 100%;
    }

    .welcome-content {
        padding: 1.5rem;

        h1 {
            margin: 0 0 1rem 0;
            text-align: left;
            font-size: 1.5rem;
            font-weight: 600;
            color: $black;
        }
    }

    .description {
        font-size: 1.1rem;
        line-height: 1.5;
        text-align: left;
        margin: 0;
    }

    // Action grid container and grid styling
    .action-grid-container {
        width: 100%;
        background-color: $verylight-grey;
        border-radius: 8px;
        padding: 1.5rem;
        box-shadow: 0 4px 8px rgba($black, 0.1);
        margin-bottom: 1rem;
    }

    .action-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
        gap: 1.5rem;
        width: 100%;

        @media (max-width: 768px) {
            grid-template-columns: repeat(2, 1fr); // 2 columns on medium screens
        }

        @media (max-width: 480px) {
            grid-template-columns: 1fr; // Single column on small screens
        }
    }
</style>
