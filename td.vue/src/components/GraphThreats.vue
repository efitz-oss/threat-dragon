<template>
    <Card class="threat-card">
        <template #content>
            <div class="row mb-2">
                <div class="col">
                    <a
                        v-if="!!number"
                        href="#"
                        class="threat-title"
                        @click.prevent="threatSelected()"
                        >#{{ number }} {{ title || 'Unknown Threat' }}</a
                    >
                    <a v-else href="#" class="threat-title" @click.prevent="threatSelected()">{{
                        title || 'Unknown Threat'
                    }}</a>
                </div>
            </div>
            <div class="row mb-2">
                <div class="col">
                    <span class="threat-type">{{ type }}</span>
                </div>
            </div>
            <div class="row">
                <div class="col-6">
                    <font-awesome-icon
                        v-if="status !== 'Open'"
                        icon="check"
                        class="threat-icon green-icon"
                        :title="status"
                    />
                    <font-awesome-icon
                        v-if="status === 'Open'"
                        icon="exclamation-triangle"
                        class="threat-icon red-icon"
                        :title="status"
                    />
                    <font-awesome-icon
                        v-if="severity === 'High'"
                        icon="circle"
                        class="threat-icon red-icon"
                        :title="severity"
                    />
                    <font-awesome-icon
                        v-if="severity === 'Medium'"
                        icon="circle"
                        class="threat-icon yellow-icon"
                        :title="severity"
                    />
                    <font-awesome-icon
                        v-if="severity === 'Low'"
                        icon="circle"
                        class="threat-icon green-icon"
                        :title="severity"
                    />
                </div>
                <div class="col-6 text-right">
                    <Tag v-if="!!modelType" :value="modelType" />
                </div>
            </div>
        </template>
    </Card>
</template>

<script setup>
// No need to import defineProps and defineEmits as they are compiler macros
import Card from 'primevue/card';
import Tag from 'primevue/tag';

const props = defineProps({
    id: { type: String },
    status: { type: String },
    severity: { type: String },
    description: { type: String },
    title: { type: String },
    type: { type: String },
    mitigation: { type: String },
    modelType: { type: String },
    number: { type: Number },
});

const emit = defineEmits(['threatSelected']);

function threatSelected() {
    emit('threatSelected', props.id, 'old');
}
</script>

<style lang="scss" scoped>
    @import '@/styles/primevue-variables.scss';

    .threat-card {
        font-size: 14px;
        border-radius: 0.375rem;
        margin-bottom: 1rem;

        :deep(.p-card-content) {
            padding: 0.75rem;
        }
    }

    .threat-title {
        font-weight: 600;
        color: $blue;
        text-decoration: none;

        &:hover {
            text-decoration: underline;
        }
    }

    .threat-type {
        font-size: 0.85rem;
        color: var(--text-color-secondary);
    }

    .threat-icon {
        margin-right: 0.375rem;
    }

    .green-icon {
        color: var(--green-500);
    }

    .red-icon {
        color: var(--red-500);
    }

    .yellow-icon {
        color: var(--amber-500);
    }

    .mb-2 {
        margin-bottom: 0.5rem;
    }

    .text-right {
        text-align: right;
    }

    .col-6 {
        flex: 0 0 50%;
        max-width: 50%;
    }
</style>
