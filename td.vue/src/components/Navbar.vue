<template>
    <Menubar class="top-navbar">
        <template #start>
            <div class="navbar-start-items">
                <router-link :to="username ? '/dashboard' : '/'" class="td-brand">
                    <img
                        src="@/assets/threatdragon_logo_image.svg"
                        class="brand-logo"
                        alt="Threat Dragon Logo"
                    />
                    Threat Dragon v{{ appStore.packageBuildVersion
                    }}{{ appStore.packageBuildState }}
                </router-link>

                <td-locale-select class="locale-select" />
            </div>
        </template>

        <template #end>
            <div class="navbar-end-items">
                <div v-show="username" class="logged-in-as">
                    {{ $t('nav.loggedInAs') }} {{ username }}
                </div>

                <Button
                    v-show="username"
                    id="nav-sign-out"
                    v-tooltip.bottom="$t('nav.logOut')"
                    class="p-button-text p-button-rounded"
                    @click="onLogOut"
                >
                    <template #icon>
                        <font-awesome-icon icon="sign-out-alt" class="fa-nav-icon" />
                    </template>
                </Button>

                <a
                    id="nav-docs"
                    href="https://owasp.org/www-project-threat-dragon/docs-2/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Button
                        v-tooltip.bottom="$t('desktop.help.docs')"
                        class="p-button-text p-button-rounded"
                    >
                        <template #icon>
                            <font-awesome-icon icon="question-circle" class="fa-nav-icon" />
                        </template>
                    </Button>
                </a>

                <a
                    id="nav-tm-cheat-sheet"
                    href="https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Button
                        v-tooltip.bottom="$t('desktop.help.sheets')"
                        class="p-button-text p-button-rounded"
                    >
                        <template #icon>
                            <font-awesome-icon icon="gift" class="fa-nav-icon" />
                        </template>
                    </Button>
                </a>

                <a
                    id="nav-owasp-td"
                    href="https://owasp.org/www-project-threat-dragon/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img
                        src="@/assets/owasp.svg"
                        class="navbar-icon owasp-logo"
                        :title="$t('desktop.help.visit')"
                        width="24"
                        height="24"
                    />
                </a>
            </div>
        </template>
    </Menubar>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useAppStore } from '@/stores/app';
import TdLocaleSelect from './LocaleSelect.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// Component imports
import Menubar from 'primevue/menubar';
import Button from 'primevue/button';

// Store instances
const authStore = useAuthStore();
const appStore = useAppStore();
const router = useRouter();

// Computed properties
const username = computed(() => authStore.username);

// Methods
async function onLogOut(evt) {
    evt.preventDefault();
    await authStore.logout();

    // Router navigation with timestamp query parameter to force refresh in Safari
    router.push({ path: '/', query: { t: Date.now() } });

    // Add a slight delay and then perform a full navigation if needed
    // This helps with Safari's cache handling
    setTimeout(() => {
        if (window.location.pathname !== '/') {
            window.location.href = `/?t=${Date.now()}`;
        }
    }, 100);
}
</script>

<style lang="scss" scoped>
    @import '@/styles/primevue-variables.scss';
    @import '@/styles/icons.scss';
    @import '@/styles/scss-includes.scss';

    .top-navbar {
        background-color: var(--primary-color);
        border-color: var(--primary-dark-color);
        height: #{$header-height};
        position: fixed;
        top: 0;
        width: 100%;
        z-index: 1000;
        padding: 0;
        display: flex;
        align-items: center;
        box-sizing: border-box;

        /* Ensure proper Menubar layout */
        :deep(.p-menubar) {
            width: 100%;
            display: flex;
        }

        :deep(.p-menubar-start) {
            flex: 0 1 auto;
            padding-left: 1rem;
        }

        :deep(.p-menubar-end) {
            display: flex;
            justify-content: flex-end;
            margin-left: auto; /* Push to the far right */
            padding-right: 1rem;
        }

        /* Override PrimeVue font size for the navbar */
        font-size: 15px !important;

        /* Ensure all child elements inherit the font size */
        * {
            font-size: 15px;
        }

        /* Specific overrides for PrimeVue components inside navbar */
        :deep(.p-menubar-root-list),
        :deep(.p-menuitem-link),
        :deep(.p-menuitem-text) {
            font-size: 15px;
        }

        /* Override PrimeVue menubar styles */
        :deep(.p-menubar) {
            background-color: transparent;
            border: none;
            padding: 0;
            box-sizing: border-box;
            width: 100%;
            justify-content: space-between;
        }
    }

    .navbar-start-items {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .navbar-end-items {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        justify-content: flex-end; /* Align items to the right */
        flex-wrap: nowrap; /* Prevent wrapping */
        width: 100%; /* Take up full width of container */
    }

    .locale-select {
        margin-left: 1rem;
        display: flex;
        align-items: center;
    }

    :deep(.p-menubar-root-list) {
        display: none;
    }

    :deep(.p-button.p-button-text) {
        color: white;
        background-color: transparent;
        height: 32px;
        width: 32px;
        padding: 0;
        margin: 0;

        &:hover {
            background-color: rgba(255, 255, 255, 0.15);
        }

        &:focus {
            box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.25);
        }
    }

    .logged-in-as {
        color: white;
        margin-right: 10px;
    }

    .td-brand {
        color: white;
        text-decoration: none;
        display: flex;
        align-items: center;
        font-weight: 500;
        font-size: 15px;
    }

    @media (max-width: 576px) {
        /* This is the typical breakpoint for phones */
        .logged-in-as {
            background-color: var(--primary-color);
            border-radius: 5px;
            padding: 8px;
            font-size: 0.85rem;
        }
    }
</style>
