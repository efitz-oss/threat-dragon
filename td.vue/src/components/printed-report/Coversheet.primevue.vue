<template>
    <div class="page print-only">
        <div class="td-title">
            <h1 class="td-report-title">
                {{ title }}
            </h1>
        </div>
        <div class="td-report-meta">
            <ul>
                <li class="td-owner">
                    <strong>{{ $t('threatmodel.owner') }}</strong
                    >: {{ owner }}
                </li>
                <li class="td-reviewer">
                    <strong>{{ $t('threatmodel.reviewer') }}</strong
                    >: {{ reviewer }}
                </li>
                <li class="td-contributors">
                    <strong>{{ $t('threatmodel.contributors') }}</strong
                    >: {{ (contributors || []).join(', ') }}
                </li>
                <li class="td-date-generated">
                    <strong>{{ $t('report.dateGenerated') }}</strong
                    >: {{ new Date().toDateString() }}
                </li>
            </ul>
        </div>
        <div v-if="branding" class="td-brand-container">
            <img
                src="@/assets/threatdragon_logo_image.svg"
                alt="Threat Dragon Logo"
                class="td-brand-logo"
            />
            <em class="td-brand-text">OWASP Threat Dragon</em>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TdPrintCoversheet',
    props: {
        title: String,
        owner: {
            type: String,
            required: false,
        },
        reviewer: {
            type: String,
            required: false,
        },
        contributors: {
            type: Array,
            required: false,
        },
        branding: {
            type: Boolean,
            default: true,
        },
    },
};
</script>

<style lang="scss" scoped>
    .page {
        display: flex;
        flex-direction: column;
    }

    .td-title {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 700px;
        padding-top: 200px;
        width: 100%;
    }

    .td-report-title {
        font-size: 4rem;
        font-weight: 700;
        color: #2c3e50;
        text-align: center;
    }

    .td-report-meta {
        margin-top: 3rem;
        margin-bottom: 6rem;

        ul {
            list-style: none;
            margin-right: 1rem;

            li {
                text-align: right;
                margin-bottom: 0.5rem;
                font-size: 1rem;
            }
        }
    }

    .td-brand-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 2rem;
    }

    .td-brand-logo {
        max-height: 250px;
        max-width: 250px;
    }

    .td-brand-text {
        margin-top: 1rem;
        font-size: 1.5rem;
        color: #2c3e50;
    }
</style>
