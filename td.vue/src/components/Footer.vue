<template>
    <b-container v-if="googleEnabled" fluid>
        <footer class="td-footer">
            <b-row>
                <b-col class="text-center">
                    <div class="footer-nav">
                        <router-link to="/privacy" class="td-footer-link">
                            {{ t('nav.privacy') }}
                        </router-link>
                        <router-link to="/tos" class="td-footer-link">
                            {{ t('nav.tos') }}
                        </router-link>
                    </div>
                </b-col>
            </b-row>
        </footer>
    </b-container>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from '@/i18n';

export default {
    name: 'TdFooter',
    setup() {
        const store = useStore();
        const { t } = useI18n();

        // Compute whether Google provider is enabled
        const config = computed(() => store.state.config.config);
        const googleEnabled = computed(() =>
            config.value && config.value.googleEnabled && !store.getters.isElectronMode
        );

        return {
            t,
            googleEnabled
        };
    }
};
</script>

<style lang="scss" scoped>
@use '@/styles/sizes.scss' as sizes;
@use '@/styles/colors.scss' as colors;

.td-footer {
    background-color: colors.$orange;
    border-color: colors.$orange-alt;
    height: sizes.$header-height - 5;
    padding: 0.75rem 0;
    margin-top: 2rem;
    border-radius: 0.3rem;
    font-size: 14px; /* Slightly smaller than navbar */
}

.td-footer-link {
    color: colors.$white !important;
    font-weight: 400; /* More subdued than navbar */
    margin: 0 1rem;
    text-decoration: none;
    
    &:hover {
        text-decoration: underline;
    }
}

/* Center the nav items */
.footer-nav {
    display: flex;
    justify-content: center;
    padding: 0.5rem 0;
}
</style>