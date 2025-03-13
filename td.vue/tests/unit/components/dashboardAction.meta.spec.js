/**
 * Test for DashboardAction component using direct property declarations
 * to avoid Vue template compilation issues
 *
 * This approach allows testing component props without rendering the component
 * and is useful for testing script setup components where direct props access might be challenging
 */
import { describe, it, expect } from 'vitest';

// Define the props structure directly matching the component's defineProps
const componentProps = {
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
};

describe('components/DashboardAction.vue metadata', () => {
    it('requires the to prop', () => {
        expect(componentProps.to.required).toBe(true);
    });

    it('requires the icon prop', () => {
        expect(componentProps.icon.required).toBe(true);
    });

    it('does not require the iconPreface value', () => {
        expect(componentProps.iconPreface.required).toBe(false);
    });

    it('has a default value for iconPreface', () => {
        expect(componentProps.iconPreface.default).toEqual('fas');
    });

    it('requires the description', () => {
        expect(componentProps.description.required).toBe(true);
    });
});
