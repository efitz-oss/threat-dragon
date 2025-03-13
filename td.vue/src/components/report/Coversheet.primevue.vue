<template>
    <div class="no-print">
        <div class="p-grid p-mb-2 td-branding">
            <div class="p-col">
                <em>
                    {{ new Date().toDateString() }}
                    <span v-if="branding" class="td-brand-text">| OWASP Threat Dragon </span>
                </em>
            </div>
        </div>
        <div class="p-grid">
            <div class="p-col">
                <td-threat-model-summary-card :title-prefix="$t('report.title')" />
            </div>
        </div>
    </div>
</template>

<script>
import TdThreatModelSummaryCard from '@/components/ThreatModelSummaryCard.primevue.vue';

export default {
    name: 'TdCoversheet',
    components: {
        TdThreatModelSummaryCard,
    },
    props: {
        branding: {
            type: Boolean,
            default: false,
        },
    },
};
</script>

<style lang="scss" scoped>
    .td-branding {
        font-size: 0.9rem;
        color: var(--text-color-secondary);
        margin-bottom: 1rem;
    }

    .td-brand-text {
        font-weight: 500;
    }
</style>
