<template>
    <div class="app">
        <h1>OWASP Threat Dragon - Vue 3 Migration Test</h1>
        <div class="container p-3">
            <h2>Component Testing</h2>
            <div class="section">
                <h3>Basic Components</h3>
                <TdFormButton
                    :on-btn-click="() => alert('Button clicked!')"
                    text="Test Button"
                    icon="check"
                    :is-primary="true"
                />
            </div>
            <div class="section mt-3">
                <h3>KeyValueCard Component</h3>
                <TdKeyValueCard title="Test Card" :values="keyValues" />
            </div>
            <div class="section mt-3">
                <h3>Dashboard Action Component</h3>
                <div class="grid">
                    <TdDashboardAction to="#" icon="plus" description="Test Action" />
                </div>
            </div>
            <div class="section mt-3">
                <h3>Dialog Components</h3>
                <Button label="Open Shortcuts Dialog" class="mr-2" @click="showShortcuts = true" />
                <TdKeyboardShortcuts v-if="showShortcuts" @close="showShortcuts = false" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import Button from 'primevue/button';
import TdFormButton from '@/components/FormButton.vue';
import TdKeyValueCard from '@/components/KeyValueCard.vue';
import TdDashboardAction from '@/components/DashboardAction.vue';
import TdKeyboardShortcuts from '@/components/KeyboardShortcuts.vue';

// Component state
const showShortcuts = ref(false);

// Sample data
const keyValues = ref([
    { key: 'Name', value: 'Test Model' },
    { key: 'Owner', value: 'John Doe' },
    { key: 'Version', value: '1.0.0' },
]);

// Define component name
defineOptions({
    name: 'TestApp',
});
</script>

<style scoped>
    .app {
        font-family: 'Ubuntu', sans-serif;
        padding: 20px;
    }

    .section {
        border: 1px solid #eee;
        padding: 20px;
        border-radius: 8px;
    }

    h1,
    h2,
    h3 {
        margin-bottom: 1rem;
    }
</style>
