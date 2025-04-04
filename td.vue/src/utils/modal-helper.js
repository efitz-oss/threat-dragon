/**
 * A utility function to show a confirmation dialog using Bootstrap Vue Next's modal functionality
 * @param {Object} options Configuration options for the modal
 * @param {string} options.title The modal title
 * @param {string} options.message The message to display
 * @param {string} options.okTitle The text for the OK button
 * @param {string} options.cancelTitle The text for the Cancel button
 * @param {string} options.okVariant The Bootstrap variant for the OK button
 * @param {boolean} options.hideHeaderClose Whether to hide the close button in the header
 * @param {boolean} options.centered Whether to center the modal vertically
 * @returns {Promise<boolean>} Resolves to true if confirmed, false if cancelled
 */
export const showConfirmDialog = async (vueInstance, options = {}) => {
    // If no Vue instance or no options, reject
    if (!vueInstance || !options) {
        console.error('showConfirmDialog: Invalid parameters');
        return Promise.reject(new Error('Invalid parameters'));
    }

    // Create a new div element to mount the modal
    const modalContainer = document.createElement('div');
    document.body.appendChild(modalContainer);

    // Create the modal component
    const { BModal } = await import('bootstrap-vue-next');
    const { createApp, h } = await import('vue');

    // Return a Promise that resolves when the user confirms or cancels
    return new Promise((resolve) => {
        const app = createApp({
            render() {
                return h(
                    BModal,
                    {
                        modelValue: true,
                        title: options.title || 'Confirm',
                        okTitle: options.okTitle || 'OK',
                        cancelTitle: options.cancelTitle || 'Cancel',
                        okVariant: options.okVariant || 'primary',
                        hideHeaderClose: options.hideHeaderClose || false,
                        centered: options.centered || false,
                        onOk: () => {
                            cleanup();
                            resolve(true);
                        },
                        onCancel: () => {
                            cleanup();
                            resolve(false);
                        },
                        onHide: () => {
                            cleanup();
                            resolve(false);
                        }
                    },
                    {
                        default: () => options.message || 'Are you sure?'
                    }
                );
            }
        });

        // Use the i18n plugin if available in the Vue instance
        if (vueInstance.$i18n) {
            app.use(vueInstance.$i18n);
        }

        // Mount the app to the container
        const _modalInstance = app.mount(modalContainer);

        // Function to clean up the modal
        let isCleanedUp = false;
        const cleanup = () => {
            if (isCleanedUp) return; // Prevent multiple cleanup calls
            
            isCleanedUp = true;
            setTimeout(() => {
                try {
                    // $destroy is not needed in Vue 3, app.unmount() is sufficient
                    app.unmount();
                    
                    // Only try to remove if it's still a child of document.body
                    if (document.body.contains(modalContainer)) {
                        document.body.removeChild(modalContainer);
                    }
                } catch (error) {
                    console.warn('Modal cleanup error:', error);
                }
            }, 100);
        };
    });
};