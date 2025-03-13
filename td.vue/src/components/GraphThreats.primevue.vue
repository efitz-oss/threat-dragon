<template>
    <Card class="threat-card p-2">
        <template #content>
            <div class="p-grid">
                <div class="p-col-12">
                    <a v-if="!!number" href="javascript:void(0)" @click="threatSelected()">
                        #{{ number }} {{ title || 'Unknown Threat' }}
                    </a>
                    <a v-else href="javascript:void(0)" @click="threatSelected()">
                        {{ title || 'Unknown Threat' }}
                    </a>
                </div>
            </div>
            <div class="p-grid mt-1">
                <div class="p-col-12">
                    {{ type }}
                </div>
            </div>
            <div class="p-grid mt-1">
                <div class="p-col-6 p-d-flex p-ai-center">
                    <i
                        v-if="status !== 'Open'"
                        class="pi pi-check-circle threat-icon green-icon"
                        :title="status"
                    />
                    <i
                        v-if="status === 'Open'"
                        class="pi pi-exclamation-triangle threat-icon red-icon"
                        :title="status"
                    />
                    <i
                        v-if="severity === 'High'"
                        class="pi pi-circle-fill threat-icon red-icon ml-2"
                        :title="severity"
                    />
                    <i
                        v-if="severity === 'Medium'"
                        class="pi pi-circle-fill threat-icon yellow-icon ml-2"
                        :title="severity"
                    />
                    <i
                        v-if="severity === 'Low'"
                        class="pi pi-circle-fill threat-icon green-icon ml-2"
                        :title="severity"
                    />
                </div>
                <div class="p-col-6 p-d-flex p-jc-end">
                    <Tag v-if="!!modelType" :value="modelType" />
                </div>
            </div>
        </template>
    </Card>
</template>

<script>
export default {
    name: 'TdGraphThreats',
    props: {
        id: { type: String },
        status: { type: String },
        severity: { type: String },
        description: { type: String },
        title: { type: String },
        type: { type: String },
        mitigation: { type: String },
        modelType: { type: String },
        number: { type: Number },
    },
    methods: {
        threatSelected() {
            this.$emit('threatSelected', this.id, 'old');
        },
    },
};
</script>

<style lang="scss" scoped>
    .threat-card {
        font-size: 0.875rem;
        border-radius: 4px;

        :deep(.p-card-content) {
            padding: 0.5rem;
        }
    }

    .threat-icon {
        font-size: 1rem;
        margin-right: 0.5rem;
    }

    .green-icon {
        color: var(--green-500);
    }

    .red-icon {
        color: var(--red-500);
    }

    .yellow-icon {
        color: var(--yellow-500);
    }
</style>
