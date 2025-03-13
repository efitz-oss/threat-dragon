/**
 * Tests for DashboardAction component
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { shallowMount, RouterLinkStub } from '@vue/test-utils';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import TdDashboardAction from '@/components/DashboardAction.vue';

describe('components/DashboardAction.vue', () => {
    const to = '/somewhere',
        icon = 'icon',
        iconPreface = 'foo',
        description = 'bar';
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(TdDashboardAction, {
            props: {
                to,
                icon,
                iconPreface,
                description,
            },
            global: {
                stubs: {
                    'router-link': RouterLinkStub,
                    Card: {
                        template: '<div class="p-card"><slot name="content"></slot></div>',
                    },
                    'font-awesome-icon': FontAwesomeIcon,
                },
                mocks: {
                    $t: (key) => key,
                },
            },
        });
    });

    it('renders with the correct classes', () => {
        expect(wrapper.find('.dashboard-action').exists()).toBe(true);
    });

    it('reads the to value', () => {
        expect(wrapper.props().to).toEqual(to);
    });

    it('sets the to value on the router link', () => {
        const routerLink = wrapper.findComponent(RouterLinkStub);
        expect(routerLink.props().to).toEqual(to);
    });

    it('reads the icon value', () => {
        expect(wrapper.props().icon).toEqual(icon);
    });

    it('reads the iconPreface value', () => {
        expect(wrapper.props().iconPreface).toEqual(iconPreface);
    });

    it('passes the icon and iconPreface to font-awesome-icon', () => {
        const faIcon = wrapper.findComponent(FontAwesomeIcon);
        expect(faIcon.props().icon).toEqual([iconPreface, icon]);
    });

    it('displays the description text', () => {
        expect(wrapper.text()).toContain(`dashboard.actions.${description}`);
    });

    // Props definition tests can be done in dashboardAction.props.spec.js
});
