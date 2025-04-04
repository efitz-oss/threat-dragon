import dataChanged from '@/service/x6/graph/data-changed.js';
import graphFactory from '@/service/x6/graph/graph.js';
import events from '@/service/x6/graph/events.js';
import store from '@/store/index.js';
import tmActions from '@/store/actions/threatmodel.js';
import { passiveSupport } from 'passive-events-support/src/utils';

const appVersion = require('../../../package.json').version;

passiveSupport({
    events: ['touchstart', 'mousewheel']
});

const drawGraph = (diagram, graph) => {
    if (diagram.version && diagram.version.startsWith('2.')) {
        console.debug('open diagram version: ' + diagram.version);
        diagram.version = appVersion;
        graph.fromJSON(diagram);
    } else {
        console.debug('upgrade version 1.x diagram');
        // For older versions, we'll just create empty cells
        const updated = graph.toJSON();
        updated.version = appVersion;
        updated.title = diagram.title;
        updated.description = diagram.description;
        updated.thumbnail = diagram.thumbnail;
        updated.id = diagram.id;
        updated.diagramType = diagram.diagramType;
        store.get().dispatch(tmActions.diagramSaved, updated);
        store.get().dispatch(tmActions.stash);
        store.get().dispatch(tmActions.notModified);
    }
    return graph;
};

const draw = (container, diagram) => drawGraph(diagram, graphFactory.getReadonlyGraph(container));
const edit = (container, diagram) => drawGraph(diagram, graphFactory.getEditGraph(container));

const dispose = (graph) => {
    events.removeListeners(graph);
    graph.dispose();
};

export default {
    dispose,
    draw,
    edit
};