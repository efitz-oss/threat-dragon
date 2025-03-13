<template>
    <Button
        :id="`${provider.key}-login-btn`"
        class="p-m-1 provider-login-btn"
        severity="secondary"
        @click="onProviderClick()"
    >
        <template #icon>
            <i :class="getIconClass()" class="mr-2 provider-icon" />
        </template>
        <span>
            {{ $t('providers.' + provider.key + '.loginWith') }}
            {{ $t('providers.' + provider.key + '.displayName') }}
        </span>
    </Button>
</template>

<script>
import { providerNames } from '@/service/provider/providers.js';
import { AUTH_SET_LOCAL } from '@/store/actions/auth.js';
import loginApi from '@/service/api/loginApi.js';
import { PROVIDER_SELECTED } from '@/store/actions/provider.js';

export default {
    name: 'TdProviderLoginButton',
    props: {
        provider: Object,
    },
    methods: {
        async onProviderClick() {
            console.debug('login with provider: ' + this.provider.key);
            await this.$store.dispatch(PROVIDER_SELECTED, this.provider.key);

            if (
                this.provider.key === providerNames.local ||
                    this.provider.key === providerNames.desktop
            ) {
                this.$store.dispatch(AUTH_SET_LOCAL);
                return this.$router.push('/dashboard');
            }

            const resp = await loginApi.loginAsync(this.provider.key);
            window.location.href = resp.data;
        },
        getIconClass() {
            // Map FontAwesome icon names to PrimeIcons
            const iconMap = {
                github: 'pi pi-github',
                gitlab: 'pi pi-code',
                local: 'pi pi-user',
                desktop: 'pi pi-desktop',
            };

            return iconMap[this.provider.key] || 'pi pi-sign-in';
        },
    },
};
</script>

<style lang="scss" scoped>
    .provider-login-btn {
        display: flex;
        align-items: center;
        padding: 0.75rem 1rem;
        margin: 0.5rem;

        .provider-icon {
            font-size: 1.5rem;
            margin-right: 0.5rem;
        }
    }
</style>
