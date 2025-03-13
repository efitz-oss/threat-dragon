// Optimized AntV X6 imports
// This file selectively imports only the X6 components we need
import { Graph } from '@antv/x6';
import { Export as ExportPlugin } from '@antv/x6-plugin-export';
import { History as HistoryPlugin } from '@antv/x6-plugin-history';
import { Keyboard as KeyboardPlugin } from '@antv/x6-plugin-keyboard';
import { Scroller as ScrollerPlugin } from '@antv/x6-plugin-scroller';
import { Selection as SelectionPlugin } from '@antv/x6-plugin-selection';
import { Snapline as SnaplinePlugin } from '@antv/x6-plugin-snapline';
import { Stencil } from '@antv/x6-plugin-stencil';
import { Transform as TransformPlugin } from '@antv/x6-plugin-transform';
import { Clipboard as ClipboardPlugin } from '@antv/x6-plugin-clipboard';

// Register all necessary plugins
Graph.registerPlugin([
    'clipboard',
    ClipboardPlugin,
    'export',
    ExportPlugin,
    'history',
    HistoryPlugin,
    'keyboard',
    KeyboardPlugin,
    'scroller',
    ScrollerPlugin,
    'selection',
    SelectionPlugin,
    'snapline',
    SnaplinePlugin,
    'transform',
    TransformPlugin,
]);

// Export components for direct use
export { Graph, Stencil };
