/**
 * Simple test file that doesn't use Pinia or advanced setup
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';

import FormButton from '@/components/FormButton.vue';

describe('Simple Component Test', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(FormButton, {
            props: {
                onBtnClick: () => {},
                text: 'Save',
                icon: 'save',
                isPrimary: true,
            },
            global: {
                stubs: {
                    Button: true,
                },
            },
        });
    });

    it('renders correctly', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('has the correct text prop', () => {
        expect(wrapper.props().text).toBe('Save');
    });
});
