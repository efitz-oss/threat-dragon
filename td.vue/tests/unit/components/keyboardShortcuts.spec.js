import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import TdKeyboardShortcuts from '@/components/KeyboardShortcuts.vue';

// Mock vue-i18n
vi.mock('vue-i18n', () => ({
    useI18n: () => ({
        t: (key) => key
    })
}));

// Create stubs for PrimeVue components
const DialogStub = {
    template: '<div class="p-dialog" :header="header"><slot></slot><slot name="footer"></slot></div>',
    props: ['header', 'visible', 'modal', 'style', 'maximizable'],
};

const DataTableStub = {
    template: '<table class="p-datatable"><slot></slot></table>',
    props: ['value', 'stripedRows'],
};

const ColumnStub = {
    template: '<th class="p-column"><slot></slot></th>',
    props: ['field', 'header'],
};

const ButtonStub = {
    template: '<button class="p-button"><slot></slot></button>',
    props: ['label', 'icon', 'autofocus'],
};

describe('components/KeyboardShortcuts.vue', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(TdKeyboardShortcuts, {
            global: {
                stubs: {
                    'Dialog': DialogStub,
                    'DataTable': DataTableStub,
                    'Column': ColumnStub,
                    'Button': ButtonStub,
                }
            },
        });
        
        // Make the dialog visible for testing
        wrapper.vm.visible = true;
    });

    it('creates a dialog component', () => {
        expect(wrapper.find('.p-dialog').exists()).toEqual(true);
    });

    it('uses a translation for the header', () => {
        expect(wrapper.find('.p-dialog').attributes('header')).toEqual('threatmodel.shortcuts.title');
    });

    it('creates a datatable component', () => {
        expect(wrapper.find('.p-datatable').exists()).toEqual(true);
    });

    it('has the expected shortcuts data', () => {
        expect(wrapper.vm.shortcuts.length).toBeGreaterThan(0);
        expect(wrapper.vm.shortcuts[0]).toHaveProperty('shortcut');
        expect(wrapper.vm.shortcuts[0]).toHaveProperty('action');
    });
    
    it('provides an open method to make the dialog visible', () => {
        wrapper.vm.visible = false;
        expect(wrapper.vm.visible).toBe(false);
        
        wrapper.vm.open();
        expect(wrapper.vm.visible).toBe(true);
    });
});
