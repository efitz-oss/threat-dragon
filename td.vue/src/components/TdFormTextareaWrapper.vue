// The TdFormTextareaWrapper component is an enhanced wrapper around
// Bootstrap Vue's standard textarea that provides auto-resizing
// functionality, ensuring the textarea automatically adjusts its height
// based on content. It includes error handling, reactive height
// adjustments using a MutationObserver, and full Vue 3 compatibility.

<template>
    <b-form-textarea v-bind="$attrs" ref="safeTextarea" :value="modelValue" no-resize
        @input="$emit('update:modelValue', $event.target.value)" @change="$emit('change', $event.target.value)" />
</template>

<script>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';

export default {
    name: 'TdFormTextareaWrapper',
    inheritAttrs: false,
    props: {
        modelValue: {
            type: String,
            default: ''
        }
    },
    emits: ['update:modelValue', 'input', 'change', 'update'],
    setup(props) {
        const safeTextarea = ref(null);
        const textareaRef = ref(null);

        // Safe method to handle height changes with enhanced error handling
        const handleHeightChange = () => {
            try {
                // Safely access the textarea reference with optional chaining
                const input = textareaRef?.value;

                // Comprehensive check for input existence and properties
                if (!input) {
                    console.debug('Textarea reference is null or undefined');
                    return;
                }

                if (!input.$el) {
                    console.debug('Textarea $el property is missing');
                    return;
                }

                // Safely query for the textarea element
                const textarea = input.$el.querySelector('textarea');
                if (!textarea) {
                    console.debug('Textarea element not found in DOM');
                    return;
                }

                // Check if the textarea is actually in the document
                if (!document.body.contains(textarea)) {
                    console.debug('Textarea is not attached to the document');
                    return;
                }

                // Safely access dimensions with explicit null checks and fallbacks
                let scrollHeight = 0;
                let clientHeight = 0;

                try {
                    scrollHeight = textarea.scrollHeight || 0;
                    clientHeight = textarea.clientHeight || 0;
                } catch (dimensionError) {
                    console.debug('Error accessing textarea dimensions:', dimensionError);
                    return;
                }

                // Only proceed if we have valid dimensions
                if (scrollHeight <= 0 || clientHeight <= 0) {
                    console.debug('Invalid textarea dimensions:', { scrollHeight, clientHeight });
                    return;
                }

                // Apply height adjustments if needed
                if (scrollHeight > clientHeight) {
                    try {
                        textarea.style.height = 'auto';
                        textarea.style.height = `${scrollHeight}px`;
                        console.debug('Textarea height adjusted to:', scrollHeight);
                    } catch (styleError) {
                        console.debug('Error setting textarea style:', styleError);
                    }
                }
            } catch (error) {
                console.debug('Error in handleHeightChange:', error);
            }
        };

        onMounted(() => {
            // Store reference to the textarea element
            textareaRef.value = safeTextarea.value;

            // Call height change after initial mount and DOM update
            nextTick(() => {
                handleHeightChange();
            });

            // Add a mutation observer to detect DOM changes that might affect the textarea
            try {
                const observer = new MutationObserver(() => {
                    // Ensure ref is still valid in observer callback
                    if (textareaRef.value) {
                        console.debug('DOM mutation detected, adjusting textarea height');
                        handleHeightChange();
                    } else {
                        console.debug('DOM mutation detected, but textareaRef is null');
                    }
                });

                // Start observing once the textarea is available
                setTimeout(() => {
                    if (safeTextarea.value && safeTextarea.value.$el) {
                        observer.observe(safeTextarea.value.$el, {
                            attributes: true,
                            childList: true,
                            subtree: true
                        });
                        console.debug('Mutation observer attached to textarea');
                    }
                }, 100);

                // Clean up the observer on component unmount
                onBeforeUnmount(() => {
                    observer.disconnect();
                });
            } catch (error) {
                console.debug('Error setting up mutation observer:', error);
            }
        });

        // Watch for content changes to adjust height
        watch(() => props.modelValue, () => {
            // Use nextTick to ensure DOM is updated after modelValue changes
            nextTick(() => {
                handleHeightChange();
            });
        }); // Removed immediate: true, rely on onMounted + nextTick for initial call

        onBeforeUnmount(() => {
            // For Vue 2 compatibility
            textareaRef.value = null;
        });

        return {
            safeTextarea,
            textareaRef,
            handleHeightChange
        };
    }
};
</script>