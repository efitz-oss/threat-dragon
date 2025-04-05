<template>
    <b-form-textarea
        v-bind="$attrs"
        ref="safeTextarea"
        no-resize
        v-on="$attrs"
    />
</template>

<script>
export default {
    name: 'TdFormTextareaWrapper',
    inheritAttrs: false,
    emits: ['update:modelValue', 'input', 'change', 'update'],
    data() {
        return {
            textareaRef: null
        };
    },
    mounted() {
        // Store reference to the textarea element
        this.textareaRef = this.$refs.safeTextarea;
    },
    beforeUnmount() {
        // For Vue 2 compatibility 
        this.textareaRef = null;
    }
};
</script>