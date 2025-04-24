/**
 * @name events
 * @description Event listeners for the graph
 */
import dataChanged from './data-changed.js';
import shapes from '@/service/x6/shapes';
import store from '@/store/index.js';
import { CELL_SELECTED, CELL_UNSELECTED } from '@/store/actions/cell.js';
import { THREATMODEL_MODIFIED } from '@/store/actions/threatmodel.js';
import defaultProperties from '@/service/entity/default-properties.js';
import logger from '@/utils/logger.js';

// Create a context-specific logger
const log = logger.getLogger('graph:events');

const showPorts = (show) => {
    const container = document.getElementById('graph-container');
    const ports = container.querySelectorAll('.x6-port-body');
    for (let i = 0, len = ports.length; i < len; i += 1) {
        ports[i].style.visibility = show ? 'visible' : 'hidden';
    }
};

const canvasResized = ({ width, height }) => {
    log.debug('canvas resized', { width, height });
    showPorts(false);
};

const edgeChangeVertices =
    () =>
        ({ edge }) => {
            if (edge.constructor.name === 'Edge') {
                log.debug('vertex for unformatted edge/flow');
            }
        };

const edgeConnected =
    (graph) =>
        ({ edge }) => {
            if (edge.constructor.name === 'Edge') {
                log.debug('connected unformatted edge/flow');
                const flow = shapes.Flow.fromEdge(edge);

                // Ensure the flow has all required properties
                if (!flow.data) {
                    flow.setData(Object.assign({}, defaultProperties.flow));
                } else {
                    // Ensure all default flow properties exist on this flow
                    const defaultProps = defaultProperties.flow;
                    for (const key in defaultProps) {
                        if (flow.data[key] === undefined) {
                            flow.data[key] = defaultProps[key];
                        }
                    }
                }

                // Add the flow to the graph
                graph.addEdge(flow);
                edge.remove();
                edge = flow;

                // Ensure the flow has a name
                if (edge.data && edge.data.name) {
                    edge.setName(edge.data.name);
                }

                // Select the new flow
                graph.select(edge);

                // Dispatch CELL_SELECTED to update the properties panel
                store.get().dispatch(CELL_SELECTED, edge);
                dataChanged.updateProperties(edge);
                dataChanged.updateStyleAttrs(edge);
            }
        };

const mouseLeave = ({ cell }) => {
    if (cell.hasTools()) {
        cell.removeTools();
    }
    showPorts(false);
};

const mouseEnter = ({ cell }) => {
    const tools = ['boundary', 'button-remove'];
    // both 'node-editor' and 'edge-editor' tools seem to drop the text very easily, so do not use (yet)
    if (!cell.isNode()) {
        tools.push('vertices');
        tools.push('source-arrowhead');
        tools.push('target-arrowhead');

        // For edges, ensure they have all required properties
        if (cell.data) {
            // Ensure all default flow properties exist on this edge
            const defaultProps = defaultProperties.flow;
            let needsUpdate = false;

            for (const key in defaultProps) {
                if (cell.data[key] === undefined) {
                    cell.data[key] = defaultProps[key];
                    needsUpdate = true;
                }
            }

            if (needsUpdate) {
                dataChanged.updateProperties(cell);
            }
        }
    }
    cell.addTools(tools);

    showPorts(true);
};

const cellAdded =
    (graph) =>
        ({ cell }) => {
            log.debug('cell added with shape', { shape: cell.shape });
            // ensure selection of other components is removed
            graph.resetSelection();

            // Flow and trust boundary stencils need to be converted
            if (cell.convertToEdge) {
                let edge = cell;
                const position = cell.position();
                const config = {
                    source: position,
                    target: {
                        x: position.x + 100,
                        y: position.y + 100
                    },
                    data: cell.getData()
                };

                if (cell.type === shapes.FlowStencil.prototype.type) {
                    edge = graph.addEdge(new shapes.Flow(config));
                } else if (cell.type === shapes.TrustBoundaryCurveStencil.prototype.type) {
                    edge = graph.addEdge(new shapes.TrustBoundaryCurve(config));
                } else {
                    log.warn('Unknown edge stencil');
                }
                cell.remove();
                cell = edge;

                // Ensure the edge has all required properties
                if (!cell.data) {
                    cell.setData(Object.assign({}, defaultProperties.flow));
                } else {
                    // Ensure all default flow properties exist on this edge
                    const defaultProps = defaultProperties.flow;
                    for (const key in defaultProps) {
                        if (cell.data[key] === undefined) {
                            cell.data[key] = defaultProps[key];
                        }
                    }
                }

                if (cell.data && cell.data.name) {
                    cell.setName(cell.data.name);
                }
            }

            mouseLeave({ cell });

            // boundary boxes must not overlap other diagram components
            if (cell.shape === 'trust-boundary-box') {
                cell.zIndex = -1;
            }

            store.get().dispatch(CELL_SELECTED, cell);
            dataChanged.updateProperties(cell);
            dataChanged.updateStyleAttrs(cell);

            if (cell.shape === 'edge') {
                log.debug('added new edge (flow parent)');
                // Convert unformatted edge to flow
                const flow = shapes.Flow.fromEdge(cell);

                // Ensure the flow has all required properties
                if (!flow.data) {
                    flow.setData(Object.assign({}, defaultProperties.flow));
                } else {
                    // Ensure all default flow properties exist on this flow
                    const defaultProps = defaultProperties.flow;
                    for (const key in defaultProps) {
                        if (flow.data[key] === undefined) {
                            flow.data[key] = defaultProps[key];
                        }
                    }
                }

                graph.addEdge(flow);
                cell.remove();
                cell = flow;

                if (cell.data && cell.data.name) {
                    cell.setName(cell.data.name);
                }

                // Re-dispatch CELL_SELECTED with the new flow object
                store.get().dispatch(CELL_SELECTED, cell);
            }

            // Select all cells except paths and trust boundaries
            if (
                cell.shape !== 'path' &&
                cell.shape !== 'trust-boundary-curve'
            ) {
                graph.select(cell);
            }
        };

const cellDeleted = () => {
    log.debug('cell deleted');
    store.get().dispatch(THREATMODEL_MODIFIED);
};

const cellSelected =
    (graph) =>
        ({ cell }) => {
            // try and get the cell name
            if (cell.data) {
                if (cell.data.name) {
                    log.debug('Cell selected', { name: cell.data.name });
                } else if (cell.getLabels) {
                    const labels = cell.getLabels();
                    if (labels.length && labels[0].attrs.label) {
                        cell.data.name = labels[0].attrs.label.text;
                        log.debug('Cell selected with label', { name: cell.data.name });
                    }
                } else {
                    log.warn('Cell selected with no name');
                }
            } else {
                log.warn('cell selected with no data');
            }

            // Handle unformatted edge selection
            if (cell.shape === 'edge') {
                log.debug('selected unformatted edge/flow');
                const flow = shapes.Flow.fromEdge(cell);
                graph.addEdge(flow);
                cell.remove();
                cell = flow;

                // Ensure the flow has a name
                if (cell.data && cell.data.name) {
                    cell.setName(cell.data.name);
                }

                // Make sure the flow has all required properties
                if (!cell.data) {
                    cell.setData(Object.assign({}, defaultProperties.flow));
                } else {
                    // Ensure all default flow properties exist on this flow
                    const defaultProps = defaultProperties.flow;
                    for (const key in defaultProps) {
                        if (cell.data[key] === undefined) {
                            cell.data[key] = defaultProps[key];
                        }
                    }
                }

                // Select the new flow object
                graph.select(cell);
            }

            // Always dispatch CELL_SELECTED for any cell type
            store.get().dispatch(CELL_SELECTED, cell);
            dataChanged.updateProperties(cell);
            dataChanged.updateStyleAttrs(cell);
            dataChanged.setType(cell);
        };

const cellUnselected = ({ cell }) => {
    log.debug('cell unselected');
    mouseLeave({ cell });
    store.get().dispatch(CELL_UNSELECTED);
};

const cellDataChanged = ({ cell }) => {
    store.get().dispatch(CELL_SELECTED, cell);
    dataChanged.updateStyleAttrs(cell);
    store.get().dispatch(THREATMODEL_MODIFIED);
};

const listen = (graph) => {
    graph.on('resize', canvasResized);
    graph.on('edge:change:vertices', edgeChangeVertices(graph));
    graph.on('edge:connected', edgeConnected(graph));
    graph.on('edge:dblclick', cellSelected(graph));
    graph.on('edge:move', cellSelected(graph));
    graph.on('cell:mouseleave', mouseLeave);
    graph.on('cell:mouseenter', mouseEnter);
    graph.on('cell:added', cellAdded(graph));
    graph.on('cell:removed', cellDeleted);
    graph.on('cell:change:data', cellDataChanged);
    graph.on('cell:selected', cellSelected(graph));
    graph.on('cell:unselected', cellUnselected);
    graph.on('node:move', cellSelected);
};

const removeListeners = (graph) => {
    graph.off('resize', canvasResized);
    graph.off('edge:change:vertices', edgeChangeVertices(graph));
    graph.off('edge:connected', edgeConnected(graph));
    graph.off('edge:dblclick', cellSelected);
    graph.off('edge:move', cellSelected);
    graph.off('cell:mouseleave', mouseLeave);
    graph.off('cell:mouseenter', mouseEnter);
    graph.off('cell:added', cellAdded(graph));
    graph.off('cell:removed', cellDeleted);
    graph.off('cell:change:data', cellDataChanged);
    graph.off('cell:selected', cellSelected(graph));
    graph.off('cell:unselected', cellUnselected);
    graph.off('node:move', cellSelected);
};

export default {
    listen,
    removeListeners
};
