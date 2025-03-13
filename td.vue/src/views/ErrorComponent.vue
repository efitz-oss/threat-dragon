<template>
    <div class="error-component">
        <p>{{ $t('errorComponent.loading') }}</p>
    </div>
</template>

<script>
export default {
    name: 'ErrorComponent',
};
</script>

<style scoped>
    .error-component {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        padding: 2rem;
    }
</style>
