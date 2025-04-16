// Stencil implementation for diagram editing
import shapes from './shapes/index.js';
import factory from './factory.js';

/**
 * Gets or creates a stencil for the graph
 * @param {Object} graph - The graph instance
 * @param {HTMLElement} container - The container element
 * @param {Function} StencilConstructor - The stencil constructor (for testing)
 * @returns {Object} - A stencil instance
 */
const get = (graph, container, StencilConstructor) => {
    console.debug('Setting up stencil for diagram editor');

    let resizeObserver;

    // Function to calculate dimensions based on container size
    const calculateDimensions = () => {
        // Get container width for responsive sizing
        const containerWidth = container.offsetWidth || 200;
        // Calculate stencil dimensions based on container size
        return {
            stencilGraphWidth: containerWidth,
            containerWidth
        };
    };

    // Initial dimensions
    const { stencilGraphWidth } = calculateDimensions();

    // Create stencil configuration
    const stencilConfig = {
        target: graph,
        stencilGraphHeight: 'auto', // Enable auto height
        title: 'Shapes',
        collapsable: false,

        // Explicitly ensure we can see stencil content
        snapline: true,
        resizing: true,
        autoResize: true, // Enable auto resize
        height: 'auto', // Set height to auto
        groups: [
            {
                name: 'components',
                title: 'Components',
                collapsable: true,
                collapsed: false
            },
            {
                name: 'boundaries',
                title: 'Boundaries',
                collapsable: true,
                collapsed: false
            },
            {
                name: 'metadata',
                title: 'Metadata',
                collapsable: true,
                collapsed: false
            }
        ],
        layoutOptions: {
            columns: 1,
            center: true,
            resizeToFit: false, /* true causes shapes to be invisible */
            dx: 50, // Add horizontal spacing
            dy: 5   // Keep reduced vertical spacing between items
        },
        search: {
            placeholder: 'Search shapes'
        }
    };

    // Create the stencil instance
    const stencilInstance = StencilConstructor ? new StencilConstructor(stencilConfig) : factory.stencil(stencilConfig);

    // Create component nodes with explicit sizing and forced visibility
    const actor = new shapes.ActorShape({
        width: 100,
        height: 50,
        visible: true,
        opacity: 1,  // Full opacity
        attrs: {
            body: {
                refWidth: '100%',
                refHeight: '100%'
            }
        }
    });
    const process = new shapes.ProcessShape({
        width: 75,
        height: 75,
        visible: true,
        opacity: 1,
        attrs: {
            body: {
                refWidth: '100%',
                refHeight: '100%'
            }
        }
    });
    const store = new shapes.StoreShape({
        width: 100,
        height: 50,
        visible: true,
        opacity: 1,
        attrs: {
            body: {
                refWidth: '100%',
                refHeight: '100%'
            }
        }
    });
    const text = new shapes.TextBlock({
        width: 100,
        height: 25,
        visible: true,
        opacity: 1,
        attrs: {
            body: {
                refWidth: '100%',
                refHeight: '100%'
            }
        }
    });

    // Create boundary nodes
    const boundaryBox = new shapes.TrustBoundaryBox({
        width: 100,
        height: 50,
        visible: true,
        opacity: 1,
        attrs: {
            body: {
                refWidth: '100%',
                refHeight: '100%'
            }
        }
    });
    const boundaryCurve = new shapes.TrustBoundaryCurveStencil({
        width: 50,
        height: 50,
        visible: true,
        opacity: 1,
        attrs: {
            body: {
                refWidth: '100%',
                refHeight: '100%'
            }
        }
    });

    // Create flow
    const flow = new shapes.FlowStencil({
        width: 50,
        height: 50,
        visible: true,
        opacity: 1,
        attrs: {
            body: {
                refWidth: '100%',
                refHeight: '100%'
            }
        }
    });

    // Add shapes to the stencil with explicit layout options
    stencilInstance.load([actor, process, store, text], 'components');
    stencilInstance.load([boundaryBox, boundaryCurve], 'boundaries');
    stencilInstance.load([flow], 'metadata');

    // Force resize after loading if the method is available (not in tests)
    if (stencilInstance && typeof stencilInstance.resize === 'function') {
        stencilInstance.resize(stencilGraphWidth, 'auto');
    }

    // Force compact layout
    if (stencilInstance && typeof stencilInstance.layout === 'function') {
        stencilInstance.layout();
    }

    // Add custom class to help with styling
    if (stencilInstance && stencilInstance.container) {
        stencilInstance.container.classList.add('td-stencil-container');
    }

    // Force a redraw of all groups to ensure proper sizing
    setTimeout(() => {
        if (stencilInstance && typeof stencilInstance.layout === 'function') {
            stencilInstance.layout();
        }

        // Ensure all groups are properly sized
        const groups = container.querySelectorAll('.x6-widget-stencil-group');
        groups.forEach(group => {
            const content = group.querySelector('.x6-widget-stencil-group-content');

            if (content && !group.classList.contains('collapsed')) {
                content.style.minHeight = '200px';
                content.style.maxHeight = '300px';
                content.style.overflowY = 'auto';
            }
        });
    }, 100);

    // Add to DOM
    container.appendChild(stencilInstance.container);

    // Removed setTimeout blocks previously used to force visibility/redraw.
    // Relying on initial render and ResizeObserver.

    // Setup resize observer to handle responsive behavior
    if (window.ResizeObserver) {
        resizeObserver = new ResizeObserver((_entries) => {
            // We only have one container, so we can just use the first entry
            const { stencilGraphWidth } = calculateDimensions();

            // Update stencil dimensions
            if (stencilInstance && stencilInstance.resize) {
                stencilInstance.resize(stencilGraphWidth, 'auto');
            }

            // Force compact layout on resize
            if (stencilInstance && typeof stencilInstance.layout === 'function') {
                stencilInstance.layout();
            }
        });

        // Start observing the container
        resizeObserver.observe(container);
    }

    // Return stencil with cleanup method
    const result = {
        ...stencilInstance,
        dispose: () => {
            // Cleanup resize observer when stencil is disposed
            if (resizeObserver) {
                resizeObserver.disconnect();
                resizeObserver = null;
            }

            // Clean up any event listeners or DOM elements
            const stencilEl = container.querySelector('.x6-widget-stencil');
            if (stencilEl) {
                // Remove any event listeners if needed
            }
        }
    };

    return result;
};

export default {
    get
};