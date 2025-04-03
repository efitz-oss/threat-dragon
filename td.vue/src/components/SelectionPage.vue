<template>
    <b-container fluid>
        <b-row>
            <b-col>
                <b-container class="text-center p-4 bg-light">
                    <h4>
                        <slot />
                    </h4>
                </b-container>
            </b-col>
        </b-row>
        <b-row>
            <b-col md="6" offset="3">
                <b-form>
                    <b-row>
                        <b-col>
                            <b-form-group id="filter-group">
                                <b-form-input
                                    id="filter"
                                    v-model="filter"
                                    :placeholder="$t('forms.search')"
                                />
                            </b-form-group>
                        </b-col>
                    </b-row>
                </b-form>
            </b-col>
        </b-row>

        <b-row>
            <b-col md="6" offset="3">
                <b-list-group>
                    <b-list-group-item v-if="showBackItem" href="#" @click="$emit('back-click')">
                        ...
                    </b-list-group-item>

                    <b-list-group-item
                        v-if="items.length === 0 && !!emptyStateText"
                        href="#"
                        @click="$emit('empty-state-click')"
                    >
                        {{ emptyStateText }}
                    </b-list-group-item>

                    <b-list-group-item
                        v-for="(item, idx) in displayedItems"
                        :key="idx"
                        href="#"
                        @click="$emit('item-click', item)"
                    >
                        {{ isGoogleProvider ? item.name : item }}
                    </b-list-group-item>
                </b-list-group>
            </b-col>
        </b-row>

        <b-row>
            <b-col md="6" offset="3">
                <div class="pagination">
                    <button :disabled="!pagePrev" @click="prevPage">Previous</button>
                    <button class="btn" disabled>
                        {{ pageRef }}
                    </button>
                    <button :disabled="!pageNext" @click="nextPage">Next</button>
                </div>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import { ref, computed } from 'vue';
export default {
    name: 'TdSelectionPage',
    props: {
        items: {
            type: Array,
            required: true,
            default: () => []
        },
        page: {
            type: Number,
            required: true,
            default: 1
        },
        pageNext: {
            type: Boolean,
            default: false
        },
        pagePrev: {
            type: Boolean,
            default: false
        },
        paginate: {
            type: Function,
            required: false,
            default: null
        },
        onItemClick: {
            type: Function,
            required: true
        },
        emptyStateText: {
            type: String,
            default: ''
        },
        showBackItem: {
            type: Boolean,
            default: false
        },
        onBackClick: {
            type: Function,
            required: false,
            default: () => {}
        },
        isGoogleProvider: {
            type: Boolean,
            default: false
        }
    },
    emits: ['back-click', 'empty-state-click', 'item-click', 'paginate'],
    setup(props, { emit }) {
        const filter = ref('');
        const pageRef = ref(props.page);
        const displayedItems = computed(() => {
            if (!filter.value) return props.items;
            return props.isGoogleProvider
                ? props.items.filter((item) =>
                    item.name.toLowerCase().includes(filter.value.toLowerCase())
                )
                : props.items.filter((item) =>
                    item.toLowerCase().includes(filter.value.toLowerCase())
                );
        });
        const prevPage = () => {
            if (props.pagePrev) {
                pageRef.value--;
                emit('paginate', pageRef.value);
            }
        };
        const nextPage = () => {
            if (props.pageNext) {
                pageRef.value++;
                emit('paginate', pageRef.value);
            }
        };
        return {
            filter,
            pageRef,
            displayedItems,
            prevPage,
            nextPage
        };
    }
};
</script>
