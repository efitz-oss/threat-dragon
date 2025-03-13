<template>
    <div class="dashboard-action">
        <a :href="to" class="action-pane-link" @click.prevent="navigateTo">
            <div class="action-pane">
                <font-awesome-icon :icon="[iconPreface, icon]" size="4x" class="action-icon" />
                <div class="action-text">
                    {{ $t(`dashboard.actions.${description}`) }}
                </div>
            </div>
        </a>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

// Router instance
const router = useRouter();

// Define component props
const props = defineProps({
    to: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
        required: true,
    },
    iconPreface: {
        type: String,
        default: 'fas',
        required: false,
    },
    description: {
        type: String,
        required: true,
    },
});

// Navigation method
function navigateTo() {
    try {
        // Use regular router navigation
        router.push(props.to);
    } catch (error) {
        console.error('Navigation error:', error);
        // Fallback to direct URL change if router fails
        window.location.href = props.to;
    }
}
</script>

<style lang="scss" scoped>
    @import '@/styles/primevue-variables.scss';

    .dashboard-action {
        width: 100%;
        display: flex;
        height: auto;
    }

    .action-icon {
        color: $orange;
        margin-bottom: 10px;
    }

    .action-pane {
        background-color: white;
        border-radius: 8px;
        padding: 1.25rem;
        text-align: center;
        transition: all 0.3s ease;
        cursor: pointer;
        box-shadow: 0 2px 6px rgba($black, 0.1);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: auto;
        min-height: auto;
        margin: 0.5rem;

        &:hover {
            transform: translateY(-3px);
            box-shadow: 0 4px 12px rgba($black, 0.2);
        }
    }

    .action-text {
        margin-top: 0.5rem;
        font-weight: 500;
        color: $black;
    }

    .action-pane-link {
        text-decoration: none;
        display: flex;
        width: 100%;
        height: 100%;

        &:hover {
            text-decoration: none;
        }
    }
</style>
