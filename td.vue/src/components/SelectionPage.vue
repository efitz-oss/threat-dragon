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
                                    :placeholder="t('forms.search')"
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
                    <b-list-group-item v-if="showBackItem" href="#" @click="handleBackClick">
                        ...
                    </b-list-group-item>

                    <b-list-group-item
                        v-if="items.length === 0 && !!emptyStateText"
                        href="#"
                        @click="handleEmptyStateClick"
                    >
                        {{ emptyStateText }}
                    </b-list-group-item>

                    <b-list-group-item
                        v-for="(item, idx) in displayedItems"
                        :key="idx"
                        href="#"
                        @click="handleItemClick(item)"
                    >
                        {{ formatItemForDisplay(item) }}
                    </b-list-group-item>
                </b-list-group>
            </b-col>
        </b-row>

        <b-row>
            <b-col md="6" offset="3">
                <div class="pagination">
                    <button :disabled="!pagePrev" @click="prevPage">
                        {{ t('pagination.previous') }}
                    </button>
                    <button class="btn" disabled>
                        {{ pageRef }}
                    </button>
                    <button :disabled="!pageNext" @click="nextPage">
                        {{ t('pagination.next') }}
                    </button>
                </div>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import { ref, computed, nextTick } from 'vue';
import { useI18n } from '@/i18n';

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
        const { t } = useI18n();
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
        
        // Handle item click by calling the onItemClick prop function
        // and also emitting the item-click event for backward compatibility
        const handleItemClick = (item) => {
            // Ensure we're working with a consistent item format
            const processedItem = formatItemForDisplay(item);
            console.log('Item clicked:', processedItem);
            
            // Use nextTick to ensure the UI updates before processing the click
            nextTick(() => {
                // Call the onItemClick prop function
                if (props.onItemClick) {
                    props.onItemClick(item);
                }
                
                // Also emit the item-click event for backward compatibility
                emit('item-click', item);
            });
        };
        
        // Handle back click by calling the onBackClick prop function
        // and also emitting the back-click event for backward compatibility
        const handleBackClick = () => {
            console.log('Back clicked');
            
            // Use nextTick to ensure the UI updates before processing the click
            nextTick(() => {
                // Call the onBackClick prop function
                if (props.onBackClick) {
                    props.onBackClick();
                }
                
                // Also emit the back-click event for backward compatibility
                emit('back-click');
            });
        };
        
        // Handle empty state click by emitting the empty-state-click event
        const handleEmptyStateClick = () => {
            console.log('Empty state clicked');
            
            // Use nextTick to ensure the UI updates before processing the click
            nextTick(() => {
                emit('empty-state-click');
            });
        };
        
        // Helper function to format items for display
        const formatItemForDisplay = (item) => {
            if (props.isGoogleProvider && item.name) {
                return item.name;
            }
            
            if (typeof item === 'string') {
                return item;
            }
            
            // Handle character-by-character object representation
            if (item && typeof item === 'object') {
                // Check if it has numeric keys (character-by-character object)
                const keys = Object.keys(item);
                if (keys.length > 0 && !isNaN(parseInt(keys[0]))) {
                    try {
                        // Sort the keys numerically to ensure correct order
                        const sortedKeys = keys.sort((a, b) => parseInt(a) - parseInt(b));
                        return sortedKeys.map(key => item[key]).join('');
                    } catch (err) {
                        console.error('Error formatting item for display:', err);
                    }
                }
            }
            
            // Fallback to JSON stringify
            return JSON.stringify(item);
        };
        
        return {
            filter,
            pageRef,
            displayedItems,
            prevPage,
            nextPage,
            handleItemClick,
            handleBackClick,
            handleEmptyStateClick,
            formatItemForDisplay,
            t
        };
    }
};
</script>
