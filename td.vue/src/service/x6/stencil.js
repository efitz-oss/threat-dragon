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
        stencilGraphWidth: stencilGraphWidth,
        stencilGraphHeight: 'auto',
        width: '100%',
        height: '100%',
        title: 'Shapes',
        collapsable: false,
        // Explicitly ensure we can see stencil content
        snapline: false,
        resizing: false,
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
            resizeToFit: true,
            dx: 10, // Add horizontal spacing
            dy: 20  // Add vertical spacing between items
        },
        search: {
            placeholder: 'Search shapes'
        }
    };

    // Create the stencil instance
    const stencilInstance = StencilConstructor ? new StencilConstructor(stencilConfig) : factory.stencil(stencilConfig);

    // Calculate component size based on container width
    const shapeWidth = stencilGraphWidth * 0.9; // 90% of stencil width
    
    // Create component nodes with explicit sizing and forced visibility
    const actor = new shapes.ActorShape({
        width: shapeWidth,
        height: shapeWidth * 0.6, // Maintain aspect ratio
        visible: true,
        zIndex: 10, // Higher z-index to ensure visibility
        opacity: 1  // Full opacity
    });
    const process = new shapes.ProcessShape({
        width: shapeWidth,
        height: shapeWidth * 0.6, // Maintain aspect ratio
        visible: true,
        zIndex: 10, 
        opacity: 1
    });
    const store = new shapes.StoreShape({
        width: shapeWidth,
        height: shapeWidth * 0.6, // Maintain aspect ratio
        visible: true,
        zIndex: 10,
        opacity: 1
    });
    const text = new shapes.TextBlock({
        width: shapeWidth,
        height: shapeWidth * 0.45, // Maintain aspect ratio
        visible: true,
        zIndex: 10,
        opacity: 1
    });

    // Create boundary nodes
    const boundaryBox = new shapes.TrustBoundaryBox({
        width: shapeWidth,
        height: shapeWidth * 0.65, // Maintain aspect ratio
        visible: true,
        zIndex: 10,
        opacity: 1
    });
    const boundaryCurve = new shapes.TrustBoundaryCurveStencil({
        width: shapeWidth,
        height: shapeWidth * 0.2, // Maintain aspect ratio
        visible: true,
        zIndex: 10,
        opacity: 1
    });

    // Create flow
    const flow = new shapes.FlowStencil({
        width: shapeWidth,
        height: shapeWidth * 0.2, // Maintain aspect ratio
        visible: true,
        zIndex: 10,
        opacity: 1
    });

    // Add shapes to the stencil with explicit layout options
    stencilInstance.load([actor, process, store, text], 'components');
    stencilInstance.load([boundaryBox, boundaryCurve], 'boundaries');
    stencilInstance.load([flow], 'metadata');
    
    // Force resize after loading if the method is available (not in tests)
    if (stencilInstance && typeof stencilInstance.resize === 'function') {
        stencilInstance.resize(stencilGraphWidth);
    }

    // Add to DOM
    container.appendChild(stencilInstance.container);

    // Setup resize observer to handle responsive behavior
    if (window.ResizeObserver) {
        resizeObserver = new ResizeObserver((_entries) => {
            // We only have one container, so we can just use the first entry
            const { stencilGraphWidth } = calculateDimensions();
            
            // Update stencil dimensions
            if (stencilInstance && stencilInstance.resize) {
                stencilInstance.resize(stencilGraphWidth);
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
        }
    };

    return result;
};

export default {
    get
};