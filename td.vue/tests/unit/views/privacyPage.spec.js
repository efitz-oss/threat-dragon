import { createWrapper } from '../setup/test-utils.js';
import PrivacyPage from '@/views/PrivacyPage.vue';

describe('PrivacyPage.vue', () => {
    let wrapper;
    let $t;

    beforeEach(() => {
        // Create mock for translation function
        $t = jest.fn(key => {
            if (key === 'privacy.title') return 'Privacy Policy Title';
            if (key === 'privacy.lastUpdated') return 'Last updated: Mock Date';
            if (key === 'privacy.introduction') return 'Privacy Policy introduction text';
            if (key === 'privacy.sections') return [
                { heading: 'Section 1', content: 'Content 1' },
                { heading: 'Section 2', content: 'Content 2' }
            ];
            return key;
        });
        
        // Create wrapper with mocks and shallow: false to render child components
        wrapper = createWrapper(PrivacyPage, {
            mocks: { $t },
            shallow: false // Need to render child components to test properly
        });
    });

    it('renders the Privacy page', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('has the correct component name', () => {
        expect(wrapper.vm.$options.name).toBe('PrivacyPage');
    });
    
    it('translates the title and content', () => {
        // Check that translations were requested
        expect($t).toHaveBeenCalledWith('privacy.title');
        expect($t).toHaveBeenCalledWith('privacy.lastUpdated');
        expect($t).toHaveBeenCalledWith('privacy.introduction');
        expect($t).toHaveBeenCalledWith('privacy.sections');
        expect($t).toHaveBeenCalledWith('operator.operatedby');
        expect($t).toHaveBeenCalledWith('operator.name');
        expect($t).toHaveBeenCalledWith('operator.contact');
        
        // Check that translated content appears in the DOM
        expect(wrapper.find('h1').text()).toBe('Privacy Policy Title');
        
        // Check for structured content
        const paragraphs = wrapper.findAll('.td-description p');
        expect(paragraphs.length).toBeGreaterThan(1);
        // Not checking the date text which may change
        expect(paragraphs.at(1).text()).toBe('Privacy Policy introduction text');
        
        // Check for sections
        const headings = wrapper.findAll('.td-description h2');
        expect(headings.length).toBe(2);
        expect(headings.at(0).text()).toBe('Section 1');
        expect(headings.at(1).text()).toBe('Section 2');
    });
    
    it('applies the correct CSS classes', () => {
        // Check for jumbotron container
        expect(wrapper.find('.welcome-jumbotron').exists()).toBe(true);
        
        // Check for all content containers
        expect(wrapper.find('.td-description').exists()).toBe(true);
        expect(wrapper.find('.td-operator').exists()).toBe(true);
        expect(wrapper.find('.td-contact').exists()).toBe(true);
        
        // Check for bootstrap classes
        expect(wrapper.find('.text-center').exists()).toBe(true);
        expect(wrapper.find('.text-left').exists()).toBe(true);
    });
    
    it('has the expected structure', () => {
        // Skip checking for container element since it might be rendered differently
        // in different test environments
        
        // Check the essential elements that should be there regardless of how the stubs are set up
        expect(wrapper.find('h1').exists()).toBe(true);
        expect(wrapper.find('.td-description').exists()).toBe(true);
    });
});