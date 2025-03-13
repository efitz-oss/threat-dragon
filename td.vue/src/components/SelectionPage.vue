<template>
    <div class="container-fluid">
        <div class="grid">
            <div class="col-12">
                <div class="jumbotron text-center">
                    <h4>
                        <slot />
                    </h4>
                </div>
            </div>
        </div>
        
        <div class="grid justify-content-center">
            <div class="col-12 md:col-6">
                <div class="p-fluid">
                    <div class="field">
                        <span class="p-input-icon-left w-full">
                            <i class="pi pi-search" />
                            <InputText
                                id="filter"
                                v-model="localFilter"
                                :placeholder="$t('forms.search')"
                                class="w-full"
                            />
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <div class="grid justify-content-center">
            <div class="col-12 md:col-6">
                <div class="card">
                    <ul class="list-group">
                        <li 
                            v-if="showBackItem"
                            class="list-group-item cursor-pointer"
                            @click="onBackClick"
                        >
                            ...
                        </li>

                        <li
                            v-if="items.length === 0 && !!emptyStateText"
                            class="list-group-item cursor-pointer"
                            @click="onEmptyStateClick"
                        >
                            {{ emptyStateText }}
                        </li>

                        <li
                            v-for="(item, idx) in displayedItems"
                            :key="idx"
                            class="list-group-item cursor-pointer"
                            @click="onItemClick(item)"
                        >
                            <span v-if="typeof item === 'string'">{{ item }}</span>
                            <div v-else class="flex justify-content-between align-items-center">
                                {{ item.value }}
                                <font-awesome-icon
                                    v-if="item.icon"
                                    :icon="item.icon"
                                    v-tooltip.top="$t(item.iconTooltip) || ''"
                                />
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="grid justify-content-center">
            <div class="col-12 md:col-6">
                <div class="pagination flex justify-content-center mt-3">
                    <Button 
                        :disabled="!pagePrev" 
                        icon="pi pi-chevron-left" 
                        @click="paginate(--pageRef)"
                        label="Previous"
                        class="mr-2"
                    />
                    <Button 
                        :disabled="true" 
                        :label="pageRef.toString()"
                        class="mx-2"
                    />
                    <Button 
                        :disabled="!pageNext" 
                        icon="pi pi-chevron-right" 
                        iconPos="right"
                        label="Next"
                        class="ml-2"
                        @click="paginate(++pageRef)"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Tooltip from 'primevue/tooltip';

// Props
const props = defineProps({
    filter: {
        type: String,
        default: '',
    },
    items: {
        type: Array,
        required: true,
        validator: (value) => {
            return value.every((item) => {
                return (
                    typeof item === 'string' ||
                        (item.value &&
                            typeof item.value === 'string' &&
                            (!item.icon || typeof item.icon === 'string') &&
                            (!item.iconTooltip ||
                                (typeof item.iconTooltip === 'string' && item.icon)))
                );
            });
        },
    },
    page: {
        type: Number,
        default: 1,
    },
    pageNext: {
        type: Boolean,
        default: false,
    },
    pagePrev: {
        type: Boolean,
        default: false,
    },
    paginate: {
        type: Function,
    },
    onItemClick: {
        type: Function,
        required: true,
    },
    emptyStateText: {
        type: String,
    },
    onEmptyStateClick: {
        type: Function,
        default: () => {},
    },
    showBackItem: {
        type: Boolean,
        default: false,
    },
    onBackClick: {
        type: Function,
        default: () => {},
    },
    isGoogleProvider: {
        type: Boolean,
        default: false,
    },
});

// Emits
const emit = defineEmits(['update:filter']);

// State
const pageRef = ref(props.page);
const localFilter = ref(props.filter);

// Computed
const displayedItems = computed(() => {
    if (!props.filter) {
        return props.items;
    }
    if (props.isGoogleProvider) {
        return props.items.filter((x) =>
            x.name.toLowerCase().includes(props.filter.toLowerCase())
        );
    } else {
        return props.items.filter((x) =>
            (x.value || x).toLowerCase().includes(props.filter.toLowerCase())
        );
    }
});

// Watchers
watch(() => props.filter, (newFilter) => {
    localFilter.value = newFilter;
});

watch(localFilter, (newFilter) => {
    emit('update:filter', newFilter);
});
</script>

<style scoped>
.jumbotron {
    padding: 2rem;
    margin-bottom: 2rem;
    background-color: var(--surface-100);
    border-radius: 0.5rem;
}

.list-group {
    display: flex;
    flex-direction: column;
    padding-left: 0;
    margin-bottom: 0;
    border-radius: 0.5rem;
}

.list-group-item {
    position: relative;
    display: block;
    padding: 0.75rem 1.25rem;
    background-color: var(--surface-0);
    border: 1px solid var(--surface-200);
}

.list-group-item:first-child {
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
}

.list-group-item:last-child {
    border-bottom-left-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
}

.cursor-pointer {
    cursor: pointer;
}

.cursor-pointer:hover {
    background-color: var(--surface-100);
}
</style>
