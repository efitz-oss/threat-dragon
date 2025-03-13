// Optimized PrimeVue component imports
// This file selectively imports only the components we need instead of the entire PrimeVue library
// Components are styled to match Bootstrap's look and feel using our custom theme

// Core components that are used on initial page load
// These are imported directly for faster initial loading
import Button from 'primevue/button';
import Card from 'primevue/card';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import ProgressSpinner from 'primevue/progressspinner';
import Toast from 'primevue/toast';
import Tooltip from 'primevue/tooltip';

// Components that are lazily loaded on demand
const lazyComponents = {
    Menu: () => import('primevue/menu'),
    Menubar: () => import('primevue/menubar'),
};

// Function to register PrimeVue components
export async function registerPrimeVueComponents(app) {
    // Register eager-loaded components
    app.component('Button', Button);
    app.component('Card', Card);
    app.component('Dialog', Dialog);
    app.component('Dropdown', Dropdown);
    app.component('InputText', InputText);
    app.component('ProgressSpinner', ProgressSpinner);
    app.component('Toast', Toast);

    // Register directives
    app.directive('tooltip', Tooltip);

    // Lazy-load less frequently used components
    // This can happen asynchronously after initial page load
    setTimeout(async () => {
        try {
            const [MenuModule, MenubarModule] = await Promise.all([
                lazyComponents.Menu(),
                lazyComponents.Menubar(),
            ]);
            app.component('Menu', MenuModule.default);
            app.component('Menubar', MenubarModule.default);

            console.debug('Lazy loaded PrimeVue components registered');
        } catch (error) {
            console.error('Failed to load lazy PrimeVue components:', error);
        }
    }, 200); // Small delay to prioritize initial render
}

// Export individual components for direct imports
export { Button, Card, Dialog, Dropdown, InputText, ProgressSpinner, Toast, Tooltip };

// Export lazy components as async functions for manual lazy loading
export const getLazyComponent = async (componentName) => {
    if (!lazyComponents[componentName]) {
        throw new Error(`Component ${componentName} not available for lazy loading`);
    }

    const module = await lazyComponents[componentName]();
    return module.default;
};
