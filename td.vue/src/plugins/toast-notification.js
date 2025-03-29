import ToastPlugin from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-default.css';

// Export the plugin with options
export const toastNotificationPlugin = {
    install(Vue) {
        Vue.use(ToastPlugin, {
            position: 'bottom-left',
            duration: 3000
        });
    }
};

// Auto-install for direct import in main.desktop.js
if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(toastNotificationPlugin);
}

export default toastNotificationPlugin;