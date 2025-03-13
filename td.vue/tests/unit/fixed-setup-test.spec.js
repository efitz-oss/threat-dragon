/**
 * Test file to verify our fixed test setup
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createWrapper } from './setup/vue3-test-utils-fixed';

import FormButton from '@/components/FormButton.vue';

describe('Tests with fixed setup', () => {
    const onBtnClick = vi.fn();
    const icon = 'save';
    const text = 'Save';
    const isPrimary = true;

    let wrapper;

    beforeEach(() => {
        vi.clearAllMocks();

        wrapper = createWrapper(FormButton, {
            props: {
                onBtnClick,
                icon,
                text,
                isPrimary,
            },
        });
    });

    it('renders correctly', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('reads the props correctly', () => {
        expect(wrapper.props().text).toEqual(text);
        expect(wrapper.props().icon).toEqual(icon);
        expect(wrapper.props().isPrimary).toEqual(isPrimary);
    });

    it('triggers click handler when clicked', async () => {
        await wrapper.trigger('click');
        expect(onBtnClick).toHaveBeenCalled();
    });
});
