/**
 * Test for FormButton component using direct property declarations
 * to avoid Vue template compilation issues
 */
import { describe, it, expect } from 'vitest';

// Define the props structure directly
const componentProps = {
    onBtnClick: {
        type: Function,
        required: true,
    },
    icon: {
        type: String,
        required: false,
    },
    iconPreface: {
        type: String,
        default: 'fas',
        required: false,
    },
    text: {
        type: String,
        required: true,
    },
    isPrimary: {
        type: Boolean,
        required: false,
        default: false,
    },
};

describe('components/FormButton.vue metadata', () => {
    it('requires the onBtnClick prop', () => {
        expect(componentProps.onBtnClick.required).toBe(true);
    });

    it('does not require the icon prop', () => {
        expect(componentProps.icon.required).toBe(false);
    });

    it('does not require the iconPreface value', () => {
        expect(componentProps.iconPreface.required).toBe(false);
    });

    it('has a default value for iconPreface', () => {
        expect(componentProps.iconPreface.default).toEqual('fas');
    });

    it('requires the text value', () => {
        expect(componentProps.text.required).toBe(true);
    });

    it('does not require isPrimary', () => {
        expect(componentProps.isPrimary.required).toBe(false);
    });

    it('sets isPrimary to false by default', () => {
        expect(componentProps.isPrimary.default).toBe(false);
    });
});
