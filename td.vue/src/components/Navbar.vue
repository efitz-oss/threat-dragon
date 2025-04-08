<template>
    <b-navbar id="navbar" toggleable="lg" fixed="top">
        <b-navbar-brand :to="username ? '/dashboard' : '/'" class="td-brand">
            <b-img
                :src="require('@/assets/threatdragon_logo_image.svg')"
                class="td-brand-img"
                alt="Threat Dragon Logo"
            />
            Threat Dragon v{{ packageBuildVersion
            }}{{ packageBuildState }}
        </b-navbar-brand>

        <b-navbar-toggle target="nav-collapse" />
        <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav>
                <b-nav-item>
                    <td-locale-select />
                </b-nav-item>
            </b-navbar-nav>

            <!-- Ensure alignment to the right -->
            <b-navbar-nav class="ms-auto d-flex align-items-center justify-content-end">
                <b-nav-text v-show="username" class="logged-in-as">
                    ({{ providerDisplayName }}) {{ username }}
                </b-nav-text>
                <b-nav-item v-show="username" id="nav-sign-out" @click="onLogOut">
                    <font-awesome-icon
                        v-tooltip.hover
                        icon="sign-out-alt"
                        class="td-fa-nav"
                        :title="t('nav.logOut')"
                    />
                </b-nav-item>
                <b-nav-item v-if="googleEnabled" id="nav-tos" to="/tos">
                    <font-awesome-icon
                        v-tooltip.hover
                        icon="file-contract"
                        class="td-fa-nav"
                        :title="t('nav.tos')"
                    />
                </b-nav-item>
                <b-nav-item v-if="googleEnabled" id="nav-privacy" to="/privacy">
                    <font-awesome-icon
                        v-tooltip.hover
                        icon="shield-alt"
                        class="td-fa-nav"
                        :title="t('nav.privacy')"
                    />
                </b-nav-item>
                <b-nav-item
                    id="nav-docs"
                    href="https://owasp.org/www-project-threat-dragon/docs-2/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <font-awesome-icon
                        v-tooltip.hover
                        icon="question-circle"
                        class="td-fa-nav"
                        :title="t('desktop.help.docs')"
                    />
                </b-nav-item>
                <b-nav-item
                    id="nav-tm-cheat-sheet"
                    href="https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <font-awesome-icon
                        v-tooltip.hover
                        icon="gift"
                        class="td-fa-nav"
                        :title="t('desktop.help.sheets')"
                    />
                </b-nav-item>
                <b-nav-item
                    id="nav-owasp-td"
                    href="https://owasp.org/www-project-threat-dragon/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <b-img
                        :src="require('@/assets/owasp.svg')"
                        class="td-fa-nav td-owasp-logo"
                        :title="t('desktop.help.visit')"
                    />
                </b-nav-item>
            </b-navbar-nav>
        </b-collapse>
    </b-navbar>
</template>

<script>
import { computed, getCurrentInstance } from 'vue';
import { useStore } from 'vuex';
import { LOGOUT } from '@/store/actions/auth.js';
import { useI18n } from '@/i18n';
import TdLocaleSelect from './LocaleSelect.vue';
import { getDisplayName } from '@/service/provider/providers.js';

export default {
    name: 'TdNavbar',
    components: {
        TdLocaleSelect
    },
    setup() {
        const store = useStore();
        const { t } = useI18n();

        // Use computed to get values from the store
        const username = computed(() => store.getters.username);
        const packageBuildVersion = computed(() => store.state.packageBuildVersion);
        const packageBuildState = computed(() => store.state.packageBuildState);
        const config = computed(() => store.state.config.config);
        
        // Get the provider display name for the navbar
        const selectedProvider = computed(() => store.state.provider.selected || 'local');
        const providerDisplayName = computed(() => {
            try {
                return getDisplayName(selectedProvider.value);
            } catch (err) {
                console.warn('Error getting provider display name:', err);
                return selectedProvider.value;
            }
        });
        
        const googleEnabled = computed(() => 
            config.value && config.value.googleEnabled && !store.getters.isElectronMode
        );

        // Method to handle logout 
        const onLogOut = (evt) => {
            // This works in both production and tests
            evt.preventDefault();
            store.dispatch(LOGOUT);
            
            // For Options API compatibility with tests
            // The test replaces the $router property, which we need to access
            // directly from the component instance
            if (getCurrentInstance() && getCurrentInstance().proxy.$router) {
                getCurrentInstance().proxy.$router.push('/').catch((error) => {
                    if (error.name !== 'NavigationDuplicated') {
                        throw error;
                    }
                });
            }
        };

        // Equivalent of mounted lifecycle hook
        const setupNavbarToggle = () => {
            // Wait for component to mount
            setTimeout(() => {
                const toggle = document.querySelector('.navbar-toggler');
                if (toggle) {
                    toggle.addEventListener('click', () => {
                        const target = document.getElementById('nav-collapse');
                        if (target) {
                            target.classList.toggle('show');
                        }
                    });
                }
            }, 0);
        };
        setupNavbarToggle();

        // Return everything needed in the template
        return {
            t,
            username,
            packageBuildVersion,
            packageBuildState,
            googleEnabled,
            providerDisplayName,
            onLogOut
        };
    }
};
</script>

<style lang="scss" scoped>
    @use '@/styles/sizes.scss' as sizes;
    @use '@/styles/colors.scss' as colors;
    $icon-height: 1.2rem;
    .navbar {
        background-color: colors.$orange;
        border-color: colors.$orange-alt;
        height: sizes.$header-height + 10;
        font-size: 15px;
    }
    .nav-link,
    .logged-in-as {
        color: colors.$white !important;
    }
    .logged-in-as {
        margin-right: 10px;
    }
    .td-fa-nav {
        font-size: $icon-height;
        max-height: $icon-height;
        margin: 0 5px 0 5px;
    }
    .td-brand {
        color: colors.$white !important;
        .td-brand-img {
            max-height: (sizes.$header-height - 10);
        }
    }
    @media (max-width: 576px) {
        .nav-link {
            color: colors.$red !important;
        }
        .logged-in-as {
            background-color: colors.$orange;
            border-radius: 5px;
            padding: 10px;
        }
    }
    @media (max-width: 576px) {
        .td-owasp-logo {
            background-color: colors.$red;
            border-radius: 50%;
            padding: 5px;
        }
    }
</style>
