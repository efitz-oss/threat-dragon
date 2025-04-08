<template>
    <b-form-textarea
        v-bind="$attrs"
        ref="safeTextarea"
        no-resize
    />
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';

export default {
    name: 'TdFormTextareaWrapper',
    inheritAttrs: false,
    emits: ['update:modelValue', 'input', 'change', 'update'],
    setup() {
        const safeTextarea = ref(null);
        const textareaRef = ref(null);
        
        onMounted(() => {
            // Store reference to the textarea element
            textareaRef.value = safeTextarea.value;
        });
        
        onBeforeUnmount(() => {
            // For Vue 2 compatibility 
            textareaRef.value = null;
        });
        
        return {
            safeTextarea,
            textareaRef
        };
    }
};
</script>