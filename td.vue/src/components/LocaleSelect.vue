<template>
    <div class="locale-changer">
        <Dropdown
            v-model="selectedLocale"
            :options="formattedLocales"
            option-label="name"
            option-value="code"
            :placeholder="getLanguageName(locale)"
            class="locale-dropdown"
            :filter="true"
            :show-clear="false"
            filter-placeholder="Search language..."
            filter-match-mode="contains"
            @change="updateLocale($event.value)"
        >
            <!-- Custom current value display - shows as a button with language name -->
            <template #value="slotProps">
                <div class="language-button">
                    <span class="language-name">{{
                        slotProps.value ? getLanguageName(slotProps.value) : getLanguageName(locale)
                    }}</span>
                    <span class="dropdown-arrow">▼</span>
                </div>
            </template>

            <!-- Custom item template for better visual appearance -->
            <template #option="slotProps">
                <div
                    class="locale-option"
                    :class="{ 'current-locale': slotProps.option.code === locale }"
                >
                    <span class="locale-name">{{ slotProps.option.name }}</span>
                    <span v-if="slotProps.option.code === locale" class="current-locale-indicator"
                        >✓</span
                    >
                </div>
            </template>
        </Dropdown>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useLocaleStore } from '@/stores/locale';
import isElectron from 'is-electron';
import { loadLanguageAsync } from '@/i18n';

// PrimeVue components
import Dropdown from 'primevue/dropdown';

// State
const searchQuery = ref('');
const filteredLocales = ref([]);
const selectedLocale = ref(null);
const formattedLocales = ref([]);

// Composables
const i18n = useI18n();
const localeStore = useLocaleStore();

// Computed properties
const locale = computed(() => {
    const currentLocale = localeStore.locale;

    if (i18n.locale.value !== currentLocale) {
        i18n.locale.value = currentLocale;
    }

    return currentLocale;
});

// No need for custom filter method as we're using PrimeVue's built-in filtering

async function updateLocale(localeCode) {
    try {
        // First load the language asynchronously
        await loadLanguageAsync(localeCode);

        // Then update the store and UI
        localeStore.selectLocale(localeCode);

        if (isElectron()) {
            window.electronAPI.updateMenu(localeCode);
        }

        searchQuery.value = '';
    } catch (error) {
        console.error('Failed to update locale:', error);
    }
}

function getLanguageName(locale) {
    switch (locale) {
            case 'ara':
        return 'العربية'; // Arabic
            case 'deu':
        return 'Deutsch'; // German
            case 'ell':
        return 'Ελληνικά'; // Greek
            case 'eng':
        return 'English';
            case 'spa':
        return 'Español'; // Spanish
    case 'fin':
        return 'Suomi'; // Finnish
    case 'fra':
        return 'Français'; // French
    case 'hin':
        return 'हिंदी'; // Hindi
    case 'ind':
        return 'Bahasa Indonesia'; // Indonesia
    case 'jpn':
        return '日本語'; // Japanese
    case 'ms':
        return 'Malay'; // Malay
    case 'por':
                return 'Português'; // Portuguese
    case 'zho':
                return '中文'; // Chinese
            default:
        return locale;
    }
}

function getSearchableText(name) {
    const searchMapping = {
        العربية: 'arabic',
        Ελληνικά: 'greek',
        हिंदी: 'hindi',
        日本語: 'japanese',
        中文: 'chinese',
    };
    return searchMapping[name] || name;
}

// Lifecycle hooks
onMounted(() => {
    // Initialize with all available locales
    formattedLocales.value = i18n.availableLocales.map((code) => ({
        code,
        name: getLanguageName(code),
    }));

    // Set initial selection to match current locale
    selectedLocale.value = locale.value;
});

// Watch for changes
watch(
    () => locale.value,
    (newLocale) => {
        selectedLocale.value = newLocale;
    }
);
</script>

<style lang="scss" scoped>
    @import '@/styles/primevue-variables.scss';

    .locale-changer {
        height: 100%;
        display: flex;
        align-items: center;

        .locale-dropdown {
            width: auto;
            min-width: 50px;
            /* Minimum width for usability */
        }

        // Dropdown toggle appearance in navbar - styled as a button
        :deep(.p-dropdown) {
            background-color: rgba($black, 0.15);
            border: none;
            height: 32px;
            border-radius: 4px;
            transition: background-color 0.2s;
            display: flex;
            align-items: center;
            padding: 0 12px;
            margin: 0;
        }

        :deep(.p-dropdown:hover) {
            background-color: rgba($black, 0.15);
        }

        :deep(.p-dropdown-label) {
            color: $white;
            font-size: 14px;
            padding: 0;
            font-weight: normal;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
        }

        :deep(.p-dropdown-trigger) {
            display: none; // We'll use our own dropdown arrow
        }

        // Custom dropdown panel styling moved to global styles

        // Custom option styling
        .locale-option {
            display: flex;
            align-items: center;
            position: relative;

            .locale-name {
                font-weight: 500;
                flex: 1;
            }

            .locale-code {
                font-size: 12px;
                color: #6c757d;
                margin-left: 8px;
            }

            .current-locale-indicator {
                position: absolute;
                right: 0;
                color: $blue;
                font-weight: bold;
            }

            &.current-locale {
                background-color: rgba($blue, 0.05);
                font-weight: 600;

                &::before {
                    content: '';
                    position: absolute;
                    left: -16px;
                    top: 0;
                    bottom: 0;
                    width: 3px;
                    background-color: $blue;
                }
            }
        }

        .language-button {
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 500;
            width: 100%;
            height: 100%;
            line-height: 1;
            padding: 0;

            .language-name {
                margin-right: 8px;
                white-space: nowrap;
            }

            .dropdown-arrow {
                font-size: 10px;
                color: rgba($white, 0.8);
                transition: transform 0.2s;
            }
        }

        // Add hover effect to the arrow
        :deep(.p-dropdown:hover) .language-button .dropdown-arrow {
            transform: translateY(2px);
        }
    }
</style>
