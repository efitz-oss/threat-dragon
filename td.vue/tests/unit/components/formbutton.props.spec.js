/**
 * Test that just checks prop definitions without rendering the component
 */
import { describe, it, expect } from 'vitest';
import TdFormButton from '@/components/FormButton.vue';

describe('components/FormButton.vue - Props only', () => {
    it('requires the onBtnClick prop', () => {
        expect(TdFormButton.props.onBtnClick.required).toBe(true);
    });

    it('does not require the icon prop', () => {
        expect(TdFormButton.props.icon.required).toBe(false);
    });

    it('does not require the iconPreface value', () => {
        expect(TdFormButton.props.iconPreface.required).toBe(false);
    });

    it('has a default value for iconPreface', () => {
        expect(TdFormButton.props.iconPreface.default).toEqual('fas');
    });

    it('requires the text value', () => {
        expect(TdFormButton.props.text.required).toBe(true);
    });

    it('does not require isPrimary', () => {
        expect(TdFormButton.props.isPrimary.required).toBe(false);
    });

    it('sets isPrimary to false by default', () => {
        expect(TdFormButton.props.isPrimary.default).toBe(false);
    });
});
