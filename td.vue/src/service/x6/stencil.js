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

    // Get container width for responsive sizing
    const containerWidth = container.offsetWidth || 200;
    const stencilGraphWidth = Math.max(containerWidth - 20, 160); // Use container width with slight padding

    // Create stencil configuration
    const stencilConfig = {
        target: graph,
        stencilGraphWidth: stencilGraphWidth,
        stencilGraphHeight: 500, // Fixed height instead of 'auto'
        width: '100%',
        minWidth: containerWidth * 0.9, // 90% of container width
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
            resizeToFit: true
        },
        search: {
            placeholder: 'Search shapes',
            width: 150
        }
    };

    // Create the stencil instance
    const stencil = StencilConstructor ? new StencilConstructor(stencilConfig) : factory.stencil(stencilConfig);

    // Calculate component size based on container width
    const shapeWidth = Math.min(stencilGraphWidth * 0.9, 160); // 90% of stencil width, max 160px
    
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

    // Add shapes to the stencil
    stencil.load([actor, process, store, text], 'components');
    stencil.load([boundaryBox, boundaryCurve], 'boundaries');
    stencil.load([flow], 'metadata');

    // Add to DOM
    container.appendChild(stencil.container);

    return stencil;
};

export default {
    get
};