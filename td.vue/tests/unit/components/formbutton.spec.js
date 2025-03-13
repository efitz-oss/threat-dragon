import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';

import FormButton from '@/components/FormButton.vue';

describe('components/FormButton.vue', () => {
    const onBtnClick = () => {},
        icon = 'save',
        text = 'Save',
        isPrimary = true;

    let wrapper;

    beforeEach(() => {
        wrapper = mount(FormButton, {
            props: {
                onBtnClick,
                icon,
                text,
                isPrimary,
            },
            global: {
                stubs: {
                    Button: true,
                },
            },
        });
    });

    it('reads the onBtnClick value', () => {
        expect(wrapper.props().onBtnClick).toEqual(onBtnClick);
    });

    it('requires the onBtnClick prop', () => {
        const propDef = wrapper.vm.$options.props.onBtnClick;
        expect(propDef.required).toBe(true);
    });

    it('reads the icon value', () => {
        expect(wrapper.props().icon).toEqual(icon);
    });

    it('does not require the icon prop', () => {
        const propDef = wrapper.vm.$options.props.icon;
        expect(propDef.required).toBe(false);
    });

    it('reads the text value', () => {
        expect(wrapper.props().text).toEqual(text);
    });

    it('requires the text value', () => {
        const propDef = wrapper.vm.$options.props.text;
        expect(propDef.required).toBe(true);
    });

    it('does not require isPrimary', () => {
        const propDef = wrapper.vm.$options.props.isPrimary;
        expect(propDef.required).toBe(false);
    });

    it('sets isPrimary to false by default', () => {
        const propDef = wrapper.vm.$options.props.isPrimary;
        expect(propDef.default).toBe(false);
    });

    it('applies primary class when isPrimary is true', () => {
        const button = wrapper.find('.p-button-primary');
        expect(button.exists()).toBe(true);
    });

    it('applies secondary class when isPrimary is false', async () => {
        await wrapper.setProps({ isPrimary: false });
        const button = wrapper.find('.p-button-secondary');
        expect(button.exists()).toBe(true);
    });

    it('triggers the onBtnClick event when clicked', async () => {
        const mockFn = vi.fn();
        await wrapper.setProps({ onBtnClick: mockFn });

        // Since we're using a stubbed Button component, need to find it properly
        await wrapper.findComponent({ name: 'Button' }).trigger('click');
        expect(mockFn).toHaveBeenCalled();
    });
});
