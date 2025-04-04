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

    // Create stencil configuration
    const stencilConfig = {
        target: graph,
        stencilGraphWidth: 180,
        stencilGraphHeight: 'auto',
        width: '100%',
        title: 'Shapes',
        collapsable: false,
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

    // Create component nodes
    const actor = new shapes.ActorShape();
    const process = new shapes.ProcessShape();
    const store = new shapes.StoreShape();
    const text = new shapes.TextBlock();

    // Create boundary nodes
    const boundaryBox = new shapes.TrustBoundaryBox();
    const boundaryCurve = new shapes.TrustBoundaryCurveStencil();

    // Create flow
    const flow = new shapes.FlowStencil();

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