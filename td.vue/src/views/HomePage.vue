<template>
    <div class="home-container p-4">
        <div class="welcome-card">
            <!-- Row 1: Title header (full width, centered) -->
            <div class="welcome-header">
                <h1>{{ $t('home.title') }}</h1>
            </div>

            <!-- Row 2: Logo and Content (2 columns) -->
            <div class="welcome-content">
                <!-- Column 1: Logo (1/3 width) -->
                <div class="logo-column">
                    <img
                        id="home-td-logo"
                        class="td-cupcake"
                        :alt="$t('home.imgAlt')"
                        src="@/assets/threatdragon_logo_image.svg"
                    />
                </div>

                <!-- Column 2: Description and buttons (2/3 width) -->
                <div class="content-column">
                    <!-- Row 1 of Column 2: Description -->
                    <div class="description-row">
                        <p class="td-description">
                            {{ $t('home.description') }}
                        </p>
                    </div>

                    <!-- Row 2 of Column 2: Provider login buttons -->
                    <div class="buttons-row">
                        <td-provider-login-button
                            v-for="(provider, idx) in providers"
                            :key="idx"
                            :provider="provider"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { allProviders } from '@/service/provider/providers.js';
import isElectron from 'is-electron';
import TdProviderLoginButton from '@/components/ProviderLoginButton.vue';
import { useConfigStore } from '@/stores/config';

// Stores
const configStore = useConfigStore();

// Computed
const providers = computed(() => {
    if (isElectron()) {
        return { desktop: allProviders.desktop };
    }

    const providers = {};

    if (configStore.config) {
        if (configStore.config.githubEnabled) {
            providers.github = allProviders.github;
        }
        if (configStore.config.bitbucketEnabled) {
            providers.bitbucket = allProviders.bitbucket;
        }
        if (configStore.config.gitlabEnabled) {
            providers.gitlab = allProviders.gitlab;
        }
        if (configStore.config.googleEnabled) {
            providers.google = allProviders.google;
        }
        if (configStore.config.localEnabled) {
            providers.local = allProviders.local;
        }
    } else {
        // default if no backend server running
        providers.local = allProviders.local;
    }

    return providers;
});

// Lifecycle hooks
onMounted(() => {
    console.log('HomePage mounted');
    if (!isElectron()) {
        console.log('Not Electron - fetching config');
        configStore
            .fetchConfig()
            .then(() => {
                console.log('Config fetched successfully');
                console.log('Available providers:', Object.keys(providers.value));
            })
            .catch((err) => {
                console.error('Error fetching config:', err);
            });
    } else {
        console.log('Running in Electron mode');
    }
});
</script>

<style lang="scss" scoped>
    @import '@/styles/primevue-variables.scss';

    .home-container {
        max-width: 1200px;
        margin: 0 auto;
    }

    .welcome-card {
        background-color: $verylight-grey;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba($black, 0.1);
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    // Row 1: Title header
    .welcome-header {
        padding: 1.5rem;
        background-color: darken($verylight-grey, 10%);
        width: 100%;

        h1 {
            margin: 0;
            color: $black;
            text-align: center;
            font-size: 2.5rem;
            font-weight: 600;
        }
    }

    // Row 2: Content with logo and content column
    .welcome-content {
        display: flex;
        flex-direction: row;
        padding: 1.5rem;

        // Column 1: Logo
        .logo-column {
            flex: 1;
            padding-right: 1.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        // Column 2: Content column with description and buttons
        .content-column {
            flex: 2;
            display: flex;
            flex-direction: column;

            // Row 1 of Column 2: Description
            .description-row {
                margin-bottom: 2rem;
            }

            // Row 2 of Column 2: Provider login buttons
            .buttons-row {
                display: flex;
                flex-wrap: wrap;
                gap: 1rem;
                justify-content: center;
            }
        }
    }

    .login-btn-icon {
        display: block;
    }

    .td-description {
        font-size: 20px;
        line-height: 1.6;
        font-weight: 400;
        color: $black;
        margin: 0;
    }

    .td-cupcake {
        max-width: 100%;
        display: block;
    }

    // Responsive adjustments
    @media (max-width: 768px) {
        .welcome-content {
            flex-direction: column;
        }

        .logo-column {
            margin-bottom: 1.5rem;
            padding-right: 0;
        }

        .content-column {
            .description-row {
                text-align: center;
            }

            .buttons-row {
                justify-content: center;
            }
        }
    }
</style>
