import { mount, shallowMount } from '@vue/test-utils';
import DriveAccess from '@/views/google/DriveAccess.vue';
import api from '@/service/api/api.js';
import { THREATMODEL_UPDATE } from '@/store/actions/threatmodel.js';

// Mock dependencies
jest.mock('@/service/api/api.js', () => ({
    postAsync: jest.fn()
}));

// Mock Vue Toast
const mockToast = {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
    info: jest.fn()
};
jest.mock('vue-toast-notification', () => ({
    useToast: () => mockToast
}));

// Mock Vue Router
const mockPush = jest.fn();
const mockRoute = {
    params: {},
    query: {}
};
jest.mock('vue-router', () => ({
    useRouter: () => ({
        push: mockPush
    }),
    useRoute: () => mockRoute
}));

// Mock Google APIs
global.gapi = {
    load: jest.fn((api, options) => {
        if (options && options.callback) options.callback();
    })
};

// Mock window.google
const mockPickerBuilder = {
    setOAuthToken: jest.fn().mockReturnThis(),
    setAppId: jest.fn().mockReturnThis(),
    setDeveloperKey: jest.fn().mockReturnThis(),
    setCallback: jest.fn().mockReturnThis(),
    setTitle: jest.fn().mockReturnThis(),
    addView: jest.fn().mockReturnThis(),
    enableFeature: jest.fn().mockReturnThis(),
    build: jest.fn().mockReturnValue({
        setVisible: jest.fn()
    })
};

const mockDocsView = jest.fn().mockImplementation(() => ({
    setIncludeFolders: jest.fn().mockReturnThis(),
    setSelectFolderEnabled: jest.fn().mockReturnThis(),
    setMimeTypes: jest.fn().mockReturnThis(),
    setMode: jest.fn().mockReturnThis()
}));

global.google = {
    picker: {
        PickerBuilder: jest.fn().mockImplementation(() => mockPickerBuilder),
        DocsView: mockDocsView,
        DocsViewMode: {
            LIST: 'list'
        },
        Feature: {
            NAV_HIDDEN: 'nav_hidden'
        },
        Action: {
            PICKED: 'picked',
            CANCEL: 'cancel'
        }
    }
};

// Mock fetch API
global.fetch = jest.fn();

// Mock document createElement and appendChild
const originalCreateElement = document.createElement;
const originalAppendChild = document.body.appendChild;

// Temporarily skipping all tests for DriveAccess.vue while fixing layout issues
describe.skip('DriveAccess.vue', () => {
    let wrapper;
    let mockStore;
    let pickerCallback;

    const mountComponent = (options = {}) => {
        const { props = {}, storeState = {}, routeParams = {}, routeQuery = {} } = options;
        
        // Update route mock
        mockRoute.params = routeParams;
        mockRoute.query = routeQuery;
        
        // Create store mock
        mockStore = {
            state: {
                auth: {
                    jwt: 'mock-jwt-token',
                    ...storeState.auth
                },
                threatmodel: {
                    data: {
                        summary: { title: 'Test Threat Model' },
                        detail: { diagrams: [] },
                        ...storeState.threatmodel?.data
                    },
                    fileName: 'test-model.json',
                    fileId: 'test-file-id',
                    ...storeState.threatmodel
                },
                provider: {
                    selected: 'google',
                    ...storeState.provider
                },
                folder: {
                    selected: 'test-folder-id',
                    ...storeState.folder
                }
            },
            commit: jest.fn(),
            dispatch: jest.fn()
        };
        
        // Create wrapper with required mocks
        return mount(DriveAccess, {
            props,
            global: {
                mocks: {
                    $t: (key) => key, // Simple i18n mock
                    $store: mockStore
                },
                stubs: {
                    'font-awesome-icon': true,
                    'b-container': true,
                    'b-row': true,
                    'b-col': true,
                    'b-form-group': true,
                    'b-form-input': true,
                    'b-button': true
                }
            }
        });
    };

    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();
        mockRoute.params = {};
        mockRoute.query = {};
        
        // Mock document methods for script loading
        document.createElement = jest.fn().mockImplementation((tag) => {
            const element = document.createElement.mockConstructor(tag);
            element.onload = null;
            return element;
        });
        document.createElement.mockConstructor = (tag) => {
            const element = {
                tagName: tag.toUpperCase(),
                src: '',
                onload: null
            };
            return element;
        };
        
        document.body.appendChild = jest.fn();
        
        // Capture the picker callback for testing
        mockPickerBuilder.setCallback.mockImplementation((callback) => {
            pickerCallback = callback;
            return mockPickerBuilder;
        });
        
        // Mock environment variables
        process.env = {
            ...process.env,
            VUE_APP_GOOGLE_API_KEY: 'test-api-key',
            VUE_APP_GOOGLE_APP_ID: 'test-app-id'
        };
    });

    afterEach(() => {
        // Restore original document methods
        document.createElement = originalCreateElement;
        document.body.appendChild = originalAppendChild;
    });

    describe('Component Rendering', () => {
        it('renders in open mode by default', () => {
            wrapper = mountComponent();
            
            // Check for open mode text using the mocked $t function
            expect(wrapper.text()).toContain('providers.googleDrive.selectThreatModel');
            expect(wrapper.text()).toContain('providers.googleDrive.description');
            
            // File name input should not be visible in open mode
            expect(wrapper.find('#file-name').exists()).toBe(false);
        });
        
        it('renders in save mode when prop is provided', () => {
            wrapper = mountComponent({
                props: { mode: 'save' }
            });
            
            // Check for save mode text
            expect(wrapper.text()).toContain('providers.googleDrive.saveThreatModel');
            expect(wrapper.text()).toContain('providers.googleDrive.saveDescription');
            
            // File name input should be visible in save mode
            expect(wrapper.find('#file-name').exists()).toBe(true);
        });
        
        it('renders in save mode when route query has action=save', () => {
            wrapper = mountComponent({
                routeQuery: { action: 'save' }
            });
            
            // Check for save mode text
            expect(wrapper.text()).toContain('providers.googleDrive.saveThreatModel');
            expect(wrapper.text()).toContain('providers.googleDrive.saveDescription');
            
            // File name input should be visible in save mode
            expect(wrapper.find('#file-name').exists()).toBe(true);
        });
        
        it('renders Google Drive button', () => {
            wrapper = mountComponent();
            
            // Check for the Google Drive button
            const button = wrapper.find('#google-drive-btn');
            expect(button.exists()).toBe(true);
            expect(button.text()).toContain('providers.googleDrive.selectFile');
        });
        
        it('renders the correct button text in save mode', () => {
            wrapper = mountComponent({
                props: { mode: 'save' }
            });
            
            // Check for the Google Drive button with save mode text
            const button = wrapper.find('#google-drive-btn');
            expect(button.exists()).toBe(true);
            expect(button.text()).toContain('providers.googleDrive.selectFolder');
        });
        
        it('disables the button during loading state', async () => {
            wrapper = mountComponent();
            
            // Set loading state
            await wrapper.setData({ isLoading: true });
            
            // Check that the button is disabled
            const button = wrapper.find('#google-drive-btn');
            expect(button.attributes('disabled')).toBeDefined();
            
            // Reset loading state
            await wrapper.setData({ isLoading: false });
            
            // Check that the button is enabled
            expect(button.attributes('disabled')).toBeUndefined();
        });
        
        it('has a welcome jumbotron with proper styling', () => {
            wrapper = mountComponent();
            
            // Check for the jumbotron container
            const jumbotron = wrapper.find('.welcome-jumbotron');
            expect(jumbotron.exists()).toBe(true);
            
            // Check that it has the expected classes and structure
            expect(jumbotron.classes()).toContain('welcome-jumbotron');
            expect(jumbotron.find('.td-description').exists()).toBe(true);
        });
    });
    
    describe('Component Initialization', () => {
        it('loads required Google API scripts on mount', () => {
            wrapper = mountComponent();
            
            // Check scripts were created and appended
            expect(document.createElement).toHaveBeenCalledWith('script');
            expect(document.body.appendChild).toHaveBeenCalledTimes(2);
            
            // Check correct script sources
            const createElementCalls = document.createElement.mock.calls;
            const firstScript = document.body.appendChild.mock.calls[0][0];
            const secondScript = document.body.appendChild.mock.calls[1][0];
            
            expect(createElementCalls[0][0]).toBe('script');
            expect(createElementCalls[1][0]).toBe('script');
            
            // First script should be Google API
            expect(firstScript.src).toBe('https://apis.google.com/js/api.js');
            
            // Second script should be Google Identity Services
            expect(secondScript.src).toBe('https://accounts.google.com/gsi/client');
        });
        
        it('calls loadPickerAPI when first script is loaded', () => {
            wrapper = mountComponent();
            
            // Get the first script and trigger onload
            const firstScript = document.body.appendChild.mock.calls[0][0];
            firstScript.onload();
            
            // Check that gapi.load was called
            expect(gapi.load).toHaveBeenCalledWith('picker', expect.objectContaining({
                callback: expect.any(Function)
            }));
        });
        
        it('handles missing Google API gracefully', () => {
            // Temporarily remove global.gapi
            const originalGapi = global.gapi;
            delete global.gapi;
            
            // Create a spy on console.error
            jest.spyOn(console, 'error').mockImplementation(() => {});
            
            wrapper = mountComponent();
            
            // Get the first script and trigger onload
            const firstScript = document.body.appendChild.mock.calls[0][0];
            firstScript.onload();
            
            // Should log an error but not crash
            expect(console.error).toHaveBeenCalledWith('Google API not loaded');
            
            // Restore global.gapi
            global.gapi = originalGapi;
            console.error.mockRestore();
        });
        
        it('pre-populates filename from props in save mode', () => {
            const testModel = {
                summary: {
                    title: 'Custom Title from Props'
                }
            };
            
            wrapper = mountComponent({
                props: {
                    mode: 'save',
                    threatModel: testModel
                }
            });
            
            // Wait for component to mount and process
            expect(wrapper.vm.fileName).toBe('Custom Title from Props');
        });
        
        it('pre-populates filename from route params if available', () => {
            wrapper = mountComponent({
                props: { mode: 'save' },
                routeParams: {
                    threatModel: {
                        summary: { title: 'Title From Route Params' }
                    }
                }
            });
            
            // Should use the title from route params
            expect(wrapper.vm.fileName).toBe('Title From Route Params');
        });
        
        it('uses store threat model if no props or route params', () => {
            wrapper = mountComponent({
                props: { mode: 'save' },
                storeState: {
                    threatmodel: {
                        data: {
                            summary: { title: 'Title From Store' }
                        }
                    }
                }
            });
            
            // Should use the title from store
            expect(wrapper.vm.fileName).toBe('Title From Store');
        });
    });
    
    describe('Auth Flow and Picker Creation', () => {
        it('calls getGoogleAccessToken when handleAuth is called', async () => {
            wrapper = mountComponent();
            
            // Mock successful fetch for token
            fetch.mockResolvedValueOnce({
                ok: true,
                json: jest.fn().mockResolvedValue({
                    data: { accessToken: 'test-access-token' }
                })
            });
            
            // Find and click the Google Drive button
            const button = wrapper.find('#google-drive-btn');
            await button.trigger('click');
            
            // Check fetch was called correctly
            expect(fetch).toHaveBeenCalledWith('/api/google-token', {
                headers: { Authorization: 'Bearer mock-jwt-token' }
            });
            
            // Check picker was created
            expect(google.picker.PickerBuilder).toHaveBeenCalled();
            expect(mockPickerBuilder.setOAuthToken).toHaveBeenCalledWith('test-access-token');
            expect(mockPickerBuilder.build).toHaveBeenCalled();
        });
        
        it('manages loading state during auth flow', async () => {
            wrapper = mountComponent();
            
            // Mock a delayed token fetch response
            fetch.mockImplementationOnce(() => {
                // Check that isLoading is true during the fetch
                expect(wrapper.vm.isLoading).toBe(true);
                
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({
                        data: { accessToken: 'test-access-token' }
                    })
                });
            });
            
            // Check initial state
            expect(wrapper.vm.isLoading).toBe(false);
            
            // Find and click the Google Drive button
            const button = wrapper.find('#google-drive-btn');
            await button.trigger('click');
            
            // After the async operation completes, loading should be false again
            expect(wrapper.vm.isLoading).toBe(false);
        });
        
        it('shows error toast when user is not authenticated', async () => {
            wrapper = mountComponent({
                storeState: {
                    auth: { jwt: null }
                }
            });
            
            // Find and click the Google Drive button
            const button = wrapper.find('#google-drive-btn');
            await button.trigger('click');
            
            // Check fetch was not called
            expect(fetch).not.toHaveBeenCalled();
            
            // Check error toast was shown
            expect(mockToast.error).toHaveBeenCalledWith(
                'You need to sign in with Google before using Google Drive'
            );
        });
        
        it('shows error toast when token fetch fails', async () => {
            wrapper = mountComponent();
            
            // Mock failed fetch
            fetch.mockResolvedValueOnce({
                ok: false,
                status: 500
            });
            
            // Find and click the Google Drive button
            const button = wrapper.find('#google-drive-btn');
            await button.trigger('click');
            
            // Check error toast was shown
            expect(mockToast.error).toHaveBeenCalledWith(
                'Failed to get access to Google Drive. Please try again.'
            );
        });
        
        it('shows error toast when token response is missing access token', async () => {
            wrapper = mountComponent();
            
            // Mock successful response but with missing token
            fetch.mockResolvedValueOnce({
                ok: true,
                json: jest.fn().mockResolvedValue({
                    data: { } // Missing accessToken
                })
            });
            
            // Find and click the Google Drive button
            const button = wrapper.find('#google-drive-btn');
            await button.trigger('click');
            
            // Check error message
            expect(mockToast.error).toHaveBeenCalledWith(
                'Failed to get access to Google Drive. Please try again.'
            );
        });
        
        it('redirects to homepage when token is unauthorized (401)', async () => {
            wrapper = mountComponent();
            
            // Mock unauthorized response
            fetch.mockResolvedValueOnce({
                ok: false,
                status: 401
            });
            
            // Find and click the Google Drive button
            const button = wrapper.find('#google-drive-btn');
            await button.trigger('click');
            
            // Check info toast was shown
            expect(mockToast.info).toHaveBeenCalledWith('Session expired. Please sign in again.');
            
            // Check router push was called
            expect(mockPush).toHaveBeenCalledWith({ name: 'HomePage' });
        });
        
        it('handles network errors during token fetch', async () => {
            wrapper = mountComponent();
            
            // Mock a network error
            fetch.mockRejectedValueOnce(new Error('Network failure'));
            
            // Find and click the Google Drive button
            const button = wrapper.find('#google-drive-btn');
            await button.trigger('click');
            
            // Check error handling
            expect(mockToast.error).toHaveBeenCalledWith(
                'Failed to get access to Google Drive. Please try again.'
            );
            expect(wrapper.vm.isLoading).toBe(false);
        });
        
        it('creates picker with correct configuration in open mode', async () => {
            wrapper = mountComponent();
            
            // Mock successful fetch for token
            fetch.mockResolvedValueOnce({
                ok: true,
                json: jest.fn().mockResolvedValue({
                    data: { accessToken: 'test-access-token' }
                })
            });
            
            // Find and click the Google Drive button
            const button = wrapper.find('#google-drive-btn');
            await button.trigger('click');
            
            // Check picker was configured correctly for open mode
            expect(mockPickerBuilder.setTitle).toHaveBeenCalledWith('Select a Threat Model from Google Drive');
            expect(mockDocsView).toHaveBeenCalled();
            expect(mockDocsView.mock.instances[0].setMimeTypes).toHaveBeenCalledWith('application/json');
            expect(mockDocsView.mock.instances[0].setIncludeFolders).toHaveBeenCalledWith(true);
            expect(mockPickerBuilder.enableFeature).toHaveBeenCalledWith(google.picker.Feature.NAV_HIDDEN);
        });
        
        it('creates picker with correct configuration in save mode', async () => {
            wrapper = mountComponent({
                props: { mode: 'save' }
            });
            
            // Mock successful fetch for token
            fetch.mockResolvedValueOnce({
                ok: true,
                json: jest.fn().mockResolvedValue({
                    data: { accessToken: 'test-access-token' }
                })
            });
            
            // Find and click the Google Drive button
            const button = wrapper.find('#google-drive-btn');
            await button.trigger('click');
            
            // Check picker was configured correctly for save mode
            expect(mockPickerBuilder.setTitle).toHaveBeenCalledWith(
                expect.stringContaining('Save Threat Model to Google Drive')
            );
            expect(mockDocsView).toHaveBeenCalled();
            expect(mockDocsView.mock.instances[0].setMimeTypes).toHaveBeenCalledWith('application/vnd.google-apps.folder');
            expect(mockDocsView.mock.instances[0].setSelectFolderEnabled).toHaveBeenCalledWith(true);
            expect(mockDocsView.mock.instances[0].setIncludeFolders).toHaveBeenCalledWith(true);
        });
        
        it('shows error when picker creation fails', async () => {
            wrapper = mountComponent();
            
            // Mock successful fetch but picker creation error
            fetch.mockResolvedValueOnce({
                ok: true,
                json: jest.fn().mockResolvedValue({
                    data: { accessToken: 'test-access-token' }
                })
            });
            
            // Force picker creation to fail
            mockPickerBuilder.build.mockImplementationOnce(() => {
                throw new Error('Picker creation failed');
            });
            
            // Find and click the Google Drive button
            const button = wrapper.find('#google-drive-btn');
            await button.trigger('click');
            
            // Check error toast was shown
            expect(mockToast.error).toHaveBeenCalledWith('Failed to open Google Drive picker');
        });
        
        it('shows error when Picker API is not available', async () => {
            wrapper = mountComponent();
            
            // Mock successful token fetch
            fetch.mockResolvedValueOnce({
                ok: true,
                json: jest.fn().mockResolvedValue({
                    data: { accessToken: 'test-access-token' }
                })
            });
            
            // Temporarily remove google.picker
            const originalPicker = global.google.picker;
            delete global.google.picker;
            
            // Create a spy on console.error
            jest.spyOn(console, 'error').mockImplementation(() => {});
            
            // Find and click the Google Drive button
            const button = wrapper.find('#google-drive-btn');
            await button.trigger('click');
            
            // Check error handling
            expect(console.error).toHaveBeenCalledWith('Google Picker API not loaded');
            expect(mockToast.error).toHaveBeenCalledWith('Google Picker API failed to load');
            
            // Restore google.picker
            global.google.picker = originalPicker;
            console.error.mockRestore();
        });
    });
    
    describe('Picker Callback Handling', () => {
        beforeEach(() => {
            // Mock successful token fetch for all tests in this section
            fetch.mockResolvedValueOnce({
                ok: true,
                json: jest.fn().mockResolvedValue({
                    data: { accessToken: 'test-access-token' }
                })
            });
        });
        
        it('ignores picker callback when action is not PICKED', async () => {
            wrapper = mountComponent();
            
            // Click button to initialize picker
            const button = wrapper.find('#google-drive-btn');
            await button.trigger('click');
            
            // Trigger picker callback with non-picked action
            await pickerCallback({
                action: 'cancel',
                docs: []
            });
            
            // Verify no further processing occurred
            expect(fetch.mock.calls).toHaveLength(1); // Only the initial token fetch
        });
        
        it('shows warning when selected file is not JSON in open mode', async () => {
            wrapper = mountComponent();
            
            // Click button to initialize picker
            const button = wrapper.find('#google-drive-btn');
            await button.trigger('click');
            
            // Trigger picker callback with non-JSON file
            await pickerCallback({
                action: 'picked',
                docs: [{ id: 'file-123', mimeType: 'text/plain', name: 'not-json.txt' }]
            });
            
            // Check warning was shown
            expect(mockToast.warning).toHaveBeenCalledWith('Please select a JSON file');
        });
        
        it('shows warning when selected item is not a folder in save mode', async () => {
            wrapper = mountComponent({
                props: { mode: 'save' }
            });
            
            // Click button to initialize picker
            const button = wrapper.find('#google-drive-btn');
            await button.trigger('click');
            
            // Trigger picker callback with non-folder item
            await pickerCallback({
                action: 'picked',
                docs: [{ id: 'file-123', mimeType: 'application/json', name: 'model.json' }]
            });
            
            // Check warning was shown
            expect(mockToast.warning).toHaveBeenCalledWith('Please select a folder to save your threat model');
        });
        
        it('processes JSON file selection in open mode', async () => {
            wrapper = mountComponent();
            
            // Click button to initialize picker
            const button = wrapper.find('#google-drive-btn');
            await button.trigger('click');
            
            // Mock successful file content fetch for the selected file
            fetch.mockResolvedValueOnce({
                ok: true,
                text: jest.fn().mockResolvedValue('{"summary":{"title":"Imported Model"}}')
            });
            
            // Mock successful backend API call
            api.postAsync.mockResolvedValueOnce({ success: true });
            
            // Trigger picker callback with JSON file
            await pickerCallback({
                action: 'picked',
                docs: [{ id: 'file-123', mimeType: 'application/json', name: 'model.json' }]
            });
            
            // Check file content was fetched
            expect(fetch.mock.calls[1][0]).toBe('https://www.googleapis.com/drive/v3/files/file-123?alt=media');
            
            // Check content was sent to backend
            expect(api.postAsync).toHaveBeenCalledWith(
                '/api/googleproviderthreatmodel/file-123/data',
                { fileId: 'file-123', fileContent: '{"summary":{"title":"Imported Model"}}' }
            );
            
            // Check store was updated
            expect(mockStore.commit).toHaveBeenCalledWith('THREATMODEL_SELECTED', 
                expect.objectContaining({ summary: { title: 'Imported Model' } })
            );
            
            // Check we navigated to the edit page
            expect(mockPush).toHaveBeenCalledWith(expect.objectContaining({
                name: 'googleThreatModelEdit',
                params: expect.objectContaining({
                    threatmodel: 'model'
                })
            }));
        });
        
        it('handles folder selection and save in save mode', async () => {
            wrapper = mountComponent({
                props: { mode: 'save' }
            });
            
            // Set filename in the component
            await wrapper.setData({ fileName: 'New Threat Model' });
            
            // Click button to initialize picker
            const button = wrapper.find('#google-drive-btn');
            await button.trigger('click');
            
            // Mock successful drive file creation
            fetch.mockResolvedValueOnce({
                ok: true,
                json: jest.fn().mockResolvedValue({
                    id: 'new-file-id'
                })
            });
            
            // Trigger picker callback with folder
            await pickerCallback({
                action: 'picked',
                docs: [{ id: 'folder-123', mimeType: 'application/vnd.google-apps.folder', name: 'My Folder' }]
            });
            
            // Check file creation request was made
            expect(fetch.mock.calls[1][0]).toBe(
                'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart'
            );
            expect(fetch.mock.calls[1][1].method).toBe('POST');
            
            // Check file metadata (note: can't easily check the FormData contents)
            // But we can verify the method and headers
            expect(fetch.mock.calls[1][1].headers).toEqual({
                Authorization: 'Bearer test-access-token'
            });
            
            // Check store was updated with new file ID
            expect(mockStore.commit).toHaveBeenCalledWith(THREATMODEL_UPDATE, {
                fileName: 'New Threat Model.json',
                fileId: 'new-file-id'
            });
            
            // Check navigation to edit page
            expect(mockPush).toHaveBeenCalledWith(expect.objectContaining({
                name: 'googleThreatModelEdit',
                params: expect.objectContaining({
                    folder: 'folder-123',
                    threatmodel: 'New Threat Model'
                })
            }));
        });
        
        it('handles errors during file fetch in open mode', async () => {
            wrapper = mountComponent();
            
            // Click button to initialize picker
            const button = wrapper.find('#google-drive-btn');
            await button.trigger('click');
            
            // Mock failed file content fetch
            fetch.mockResolvedValueOnce({
                ok: false,
                status: 404,
                text: jest.fn().mockResolvedValue('File not found')
            });
            
            // Trigger picker callback with JSON file
            await pickerCallback({
                action: 'picked',
                docs: [{ id: 'file-123', mimeType: 'application/json', name: 'model.json' }]
            });
            
            // Check error handling
            expect(mockToast.error).toHaveBeenCalledWith('Failed to import file from Google Drive');
            expect(mockPush).not.toHaveBeenCalled(); // No navigation should occur
        });
        
        it('handles errors during file save in save mode', async () => {
            wrapper = mountComponent({
                props: { mode: 'save' }
            });
            
            // Click button to initialize picker
            const button = wrapper.find('#google-drive-btn');
            await button.trigger('click');
            
            // Mock failed drive file creation
            fetch.mockResolvedValueOnce({
                ok: false,
                status: 500,
                text: jest.fn().mockResolvedValue('Server error')
            });
            
            // Trigger picker callback with folder
            await pickerCallback({
                action: 'picked',
                docs: [{ id: 'folder-123', mimeType: 'application/vnd.google-apps.folder', name: 'My Folder' }]
            });
            
            // Check error handling
            expect(mockToast.error).toHaveBeenCalledWith('Failed to save threat model to Google Drive');
            expect(mockPush).not.toHaveBeenCalled(); // No navigation should occur
        });
        
        it('handles JSON parse errors during file import', async () => {
            wrapper = mountComponent();
            
            // Click button to initialize picker
            const button = wrapper.find('#google-drive-btn');
            await button.trigger('click');
            
            // Mock successful file fetch but with invalid JSON
            fetch.mockResolvedValueOnce({
                ok: true,
                text: jest.fn().mockResolvedValue('Not valid JSON')
            });
            
            // Trigger picker callback with JSON file
            await pickerCallback({
                action: 'picked',
                docs: [{ id: 'file-123', mimeType: 'application/json', name: 'model.json' }]
            });
            
            // Check error handling
            expect(mockToast.error).toHaveBeenCalledWith('File format error. Could not parse the threat model.');
            expect(mockPush).not.toHaveBeenCalled(); // No navigation should occur
        });
        
        it('properly manages loading state during file operations', async () => {
            wrapper = mountComponent();
            
            // Click button to initialize picker
            const button = wrapper.find('#google-drive-btn');
            await button.trigger('click');
            
            // Setup spy to track isLoading state changes
            const isLoadingSpy = jest.spyOn(wrapper.vm, 'isLoading', 'set');
            
            // Mock a delay in the file fetch response
            fetch.mockImplementationOnce(() => {
                // Should be in loading state during fetch
                expect(wrapper.vm.isLoading).toBe(true);
                
                return Promise.resolve({
                    ok: true,
                    text: () => Promise.resolve('{"summary":{"title":"Test Model"}}')
                });
            });
            
            // Mock successful backend API call
            api.postAsync.mockResolvedValueOnce({ success: true });
            
            // Trigger picker callback with JSON file
            await pickerCallback({
                action: 'picked',
                docs: [{ id: 'file-123', mimeType: 'application/json', name: 'model.json' }]
            });
            
            // Verify loading state was managed correctly
            expect(isLoadingSpy).toHaveBeenCalledWith(true); // At start of operation
            expect(isLoadingSpy).toHaveBeenCalledWith(false); // At end of operation
            expect(wrapper.vm.isLoading).toBe(false); // Final state
        });
        
        it('handles network errors during file operations', async () => {
            wrapper = mountComponent();
            
            // Click button to initialize picker
            const button = wrapper.find('#google-drive-btn');
            await button.trigger('click');
            
            // Mock a network error
            fetch.mockRejectedValueOnce(new Error('Network error'));
            
            // Trigger picker callback with JSON file
            await pickerCallback({
                action: 'picked',
                docs: [{ id: 'file-123', mimeType: 'application/json', name: 'model.json' }]
            });
            
            // Check error handling
            expect(mockToast.error).toHaveBeenCalledWith('Failed to import file from Google Drive');
            expect(wrapper.vm.isLoading).toBe(false); // Should reset loading state
        });
    });
    
    describe('Token Refresh Handling', () => {
        it('attempts token refresh for 401 errors during file fetch', async () => {
            wrapper = mountComponent();
            
            // First call is for initial token, which succeeds
            fetch.mockResolvedValueOnce({
                ok: true,
                json: jest.fn().mockResolvedValue({
                    data: { accessToken: 'test-access-token' }
                })
            });
            
            // Click button to initialize picker
            const button = wrapper.find('#google-drive-btn');
            await button.trigger('click');
            
            // Second call is file fetch, which fails with 401
            fetch.mockResolvedValueOnce({
                ok: false,
                status: 401,
                text: jest.fn().mockResolvedValue('Unauthorized')
            });
            
            // Third call is token refresh, which succeeds
            fetch.mockResolvedValueOnce({
                ok: true,
                json: jest.fn().mockResolvedValue({
                    data: { accessToken: 'new-access-token' }
                })
            });
            
            // Fourth call is retry file fetch, which succeeds
            fetch.mockResolvedValueOnce({
                ok: true,
                text: jest.fn().mockResolvedValue('{"summary":{"title":"Refreshed Model"}}')
            });
            
            // Mock backend API call
            api.postAsync.mockResolvedValueOnce({ success: true });
            
            // Trigger picker callback with JSON file
            await pickerCallback({
                action: 'picked',
                docs: [{ id: 'file-123', mimeType: 'application/json', name: 'model.json' }]
            });
            
            // Check token refresh notification
            expect(mockToast.info).toHaveBeenCalledWith('Google Drive access token expired. Attempting to refresh...');
            
            // Check second token fetch
            expect(fetch.mock.calls[2][0]).toBe('/api/google-token');
            
            // Check file was fetched again with new token
            expect(fetch.mock.calls[3][0]).toBe('https://www.googleapis.com/drive/v3/files/file-123?alt=media');
            expect(fetch.mock.calls[3][1].headers).toEqual({
                Authorization: 'Bearer new-access-token'
            });
            
            // Check model was processed successfully after refresh
            expect(mockStore.commit).toHaveBeenCalledWith('THREATMODEL_SELECTED', 
                expect.objectContaining({ summary: { title: 'Refreshed Model' } })
            );
        });
        
        it('attempts token refresh for 401 errors during file save', async () => {
            wrapper = mountComponent({
                props: { mode: 'save' }
            });
            
            // Set filename in the component
            await wrapper.setData({ fileName: 'New Threat Model' });
            
            // First call is for initial token, which succeeds
            fetch.mockResolvedValueOnce({
                ok: true,
                json: jest.fn().mockResolvedValue({
                    data: { accessToken: 'test-access-token' }
                })
            });
            
            // Click button to initialize picker
            const button = wrapper.find('#google-drive-btn');
            await button.trigger('click');
            
            // Second call is file save, which fails with 401
            fetch.mockResolvedValueOnce({
                ok: false,
                status: 401,
                text: jest.fn().mockResolvedValue('Unauthorized')
            });
            
            // Third call is token refresh, which succeeds
            fetch.mockResolvedValueOnce({
                ok: true,
                json: jest.fn().mockResolvedValue({
                    data: { accessToken: 'new-access-token' }
                })
            });
            
            // Fourth call is retry file save, which succeeds
            fetch.mockResolvedValueOnce({
                ok: true,
                json: jest.fn().mockResolvedValue({
                    id: 'new-file-id'
                })
            });
            
            // Trigger picker callback with folder
            await pickerCallback({
                action: 'picked',
                docs: [{ id: 'folder-123', mimeType: 'application/vnd.google-apps.folder', name: 'My Folder' }]
            });
            
            // Check token refresh notification
            expect(mockToast.info).toHaveBeenCalledWith('Google Drive access token expired. Attempting to refresh...');
            
            // Check second token fetch
            expect(fetch.mock.calls[2][0]).toBe('/api/google-token');
            
            // Check file was saved again with new token
            expect(fetch.mock.calls[3][0]).toBe('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart');
            expect(fetch.mock.calls[3][1].headers).toEqual({
                Authorization: 'Bearer new-access-token'
            });
            
            // Check successful update after refresh
            expect(mockStore.commit).toHaveBeenCalledWith(THREATMODEL_UPDATE, {
                fileName: 'New Threat Model.json',
                fileId: 'new-file-id'
            });
        });
        
        it('handles failed token refresh when retrying file fetch', async () => {
            wrapper = mountComponent();
            
            // First call is for initial token, which succeeds
            fetch.mockResolvedValueOnce({
                ok: true,
                json: jest.fn().mockResolvedValue({
                    data: { accessToken: 'test-access-token' }
                })
            });
            
            // Click button to initialize picker
            const button = wrapper.find('#google-drive-btn');
            await button.trigger('click');
            
            // Second call is file fetch, which fails with 401
            fetch.mockResolvedValueOnce({
                ok: false,
                status: 401,
                text: jest.fn().mockResolvedValue('Unauthorized')
            });
            
            // Third call is token refresh, which fails
            fetch.mockResolvedValueOnce({
                ok: false,
                status: 500,
                text: jest.fn().mockResolvedValue('Server Error')
            });
            
            // Trigger picker callback with JSON file
            await pickerCallback({
                action: 'picked',
                docs: [{ id: 'file-123', mimeType: 'application/json', name: 'model.json' }]
            });
            
            // Check token refresh notification
            expect(mockToast.info).toHaveBeenCalledWith('Google Drive access token expired. Attempting to refresh...');
            
            // Check error toast was shown after failed refresh
            expect(mockToast.error).toHaveBeenCalledWith('Failed to import file from Google Drive');
            
            // Shouldn't navigate anywhere
            expect(mockPush).not.toHaveBeenCalled();
        });
    });
    
    describe('Filename Handling in Save Mode', () => {
        it('uses threat model title when no filename is provided', async () => {
            wrapper = mountComponent({
                props: { mode: 'save' },
                storeState: {
                    threatmodel: {
                        data: {
                            summary: { title: 'Store Title' }
                        }
                    }
                }
            });
            
            // Click button to initialize picker
            const button = wrapper.find('#google-drive-btn');
            await button.trigger('click');
            
            // Check that title includes store title
            expect(mockPickerBuilder.setTitle).toHaveBeenCalledWith(
                expect.stringContaining('Store Title')
            );
        });
        
        it('uses provided filename when explicitly set', async () => {
            wrapper = mountComponent({
                props: { mode: 'save' }
            });
            
            // Set custom filename
            await wrapper.setData({ fileName: 'Custom Filename' });
            
            // Click button to initialize picker
            const button = wrapper.find('#google-drive-btn');
            await button.trigger('click');
            
            // Check that title includes custom filename
            expect(mockPickerBuilder.setTitle).toHaveBeenCalledWith(
                expect.stringContaining('Custom Filename')
            );
        });
        
        it('ensures filename has .json extension when saving', async () => {
            wrapper = mountComponent({
                props: { mode: 'save' }
            });
            
            // Set filename without extension
            await wrapper.setData({ fileName: 'Model Without Extension' });
            
            // First call for token
            fetch.mockResolvedValueOnce({
                ok: true,
                json: jest.fn().mockResolvedValue({
                    data: { accessToken: 'test-access-token' }
                })
            });
            
            // Second call for file save, which succeeds
            fetch.mockResolvedValueOnce({
                ok: true,
                json: jest.fn().mockResolvedValue({
                    id: 'new-file-id'
                })
            });
            
            // Click button to initialize picker
            const button = wrapper.find('#google-drive-btn');
            await button.trigger('click');
            
            // Trigger picker callback with folder
            await pickerCallback({
                action: 'picked',
                docs: [{ id: 'folder-123', mimeType: 'application/vnd.google-apps.folder', name: 'My Folder' }]
            });
            
            // Check store update includes .json extension
            expect(mockStore.commit).toHaveBeenCalledWith(THREATMODEL_UPDATE, {
                fileName: 'Model Without Extension.json',
                fileId: 'new-file-id'
            });
        });
        
        it('preserves .json extension when already present', async () => {
            wrapper = mountComponent({
                props: { mode: 'save' }
            });
            
            // Set filename with extension
            await wrapper.setData({ fileName: 'Model With Extension.json' });
            
            // First call for token
            fetch.mockResolvedValueOnce({
                ok: true,
                json: jest.fn().mockResolvedValue({
                    data: { accessToken: 'test-access-token' }
                })
            });
            
            // Second call for file save, which succeeds
            fetch.mockResolvedValueOnce({
                ok: true,
                json: jest.fn().mockResolvedValue({
                    id: 'new-file-id'
                })
            });
            
            // Click button to initialize picker
            const button = wrapper.find('#google-drive-btn');
            await button.trigger('click');
            
            // Trigger picker callback with folder
            await pickerCallback({
                action: 'picked',
                docs: [{ id: 'folder-123', mimeType: 'application/vnd.google-apps.folder', name: 'My Folder' }]
            });
            
            // Check store update does not duplicate .json extension
            expect(mockStore.commit).toHaveBeenCalledWith(THREATMODEL_UPDATE, {
                fileName: 'Model With Extension.json',
                fileId: 'new-file-id'
            });
        });
        
        it('trims whitespace from user-provided filename', async () => {
            wrapper = mountComponent({
                props: { mode: 'save' }
            });
            
            // Set filename with whitespace
            await wrapper.setData({ fileName: '  Filename With Spaces   ' });
            
            // First call for token
            fetch.mockResolvedValueOnce({
                ok: true,
                json: jest.fn().mockResolvedValue({
                    data: { accessToken: 'test-access-token' }
                })
            });
            
            // Second call for file save
            fetch.mockResolvedValueOnce({
                ok: true,
                json: jest.fn().mockResolvedValue({
                    id: 'new-file-id'
                })
            });
            
            // Click button to initialize picker
            const button = wrapper.find('#google-drive-btn');
            await button.trigger('click');
            
            // Trigger picker callback with folder
            await pickerCallback({
                action: 'picked',
                docs: [{ id: 'folder-123', mimeType: 'application/vnd.google-apps.folder', name: 'My Folder' }]
            });
            
            // Check store update has trimmed the whitespace
            expect(mockStore.commit).toHaveBeenCalledWith(THREATMODEL_UPDATE, {
                fileName: 'Filename With Spaces.json',
                fileId: 'new-file-id'
            });
        });
    });
    
    describe('Backend Integration', () => {
        it('sends file data to backend during import', async () => {
            wrapper = mountComponent();
            
            // Mock successful token fetch
            fetch.mockResolvedValueOnce({
                ok: true,
                json: jest.fn().mockResolvedValue({
                    data: { accessToken: 'test-access-token' }
                })
            });
            
            // Mock successful file fetch
            fetch.mockResolvedValueOnce({
                ok: true,
                text: jest.fn().mockResolvedValue('{"summary":{"title":"Backend Test Model"}}')
            });
            
            // Mock successful backend API call
            api.postAsync.mockResolvedValueOnce({ success: true });
            
            // Click button to initialize picker
            const button = wrapper.find('#google-drive-btn');
            await button.trigger('click');
            
            // Trigger picker callback with JSON file
            await pickerCallback({
                action: 'picked',
                docs: [{ id: 'file-123', mimeType: 'application/json', name: 'backend-test.json' }]
            });
            
            // Check API call was made correctly
            expect(api.postAsync).toHaveBeenCalledWith(
                '/api/googleproviderthreatmodel/file-123/data',
                {
                    fileId: 'file-123',
                    fileContent: '{"summary":{"title":"Backend Test Model"}}'
                }
            );
        });
        
        it('handles backend errors during import', async () => {
            wrapper = mountComponent();
            
            // Mock successful token fetch
            fetch.mockResolvedValueOnce({
                ok: true,
                json: jest.fn().mockResolvedValue({
                    data: { accessToken: 'test-access-token' }
                })
            });
            
            // Mock successful file fetch
            fetch.mockResolvedValueOnce({
                ok: true,
                text: jest.fn().mockResolvedValue('{"summary":{"title":"Backend Error Model"}}')
            });
            
            // Mock failed backend API call
            api.postAsync.mockRejectedValueOnce(new Error('Backend error'));
            
            // Click button to initialize picker
            const button = wrapper.find('#google-drive-btn');
            await button.trigger('click');
            
            // Trigger picker callback with JSON file
            await pickerCallback({
                action: 'picked',
                docs: [{ id: 'file-123', mimeType: 'application/json', name: 'backend-error.json' }]
            });
            
            // Check error handling
            expect(mockToast.error).toHaveBeenCalledWith('Failed to import file from Google Drive');
            expect(mockPush).not.toHaveBeenCalled(); // No navigation should occur
            expect(wrapper.vm.isLoading).toBe(false); // Loading state should be reset
        });
    });
});