<template>
    <b-form-textarea
        v-bind="$attrs"
        v-on="$listeners"
        ref="safeTextarea"
        no-resize
    />
</template>

<script>
export default {
    name: 'TdSafeFormTextarea',
    inheritAttrs: false,
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
        // Clear reference before component is unmounted
        this.textareaRef = null;
    },
    beforeDestroy() {
        // For Vue 2 compatibility (Vue 3 uses beforeUnmount)
        this.textareaRef = null;
    }
};
</script>