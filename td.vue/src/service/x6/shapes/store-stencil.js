import { Shape } from '@antv/x6';

import { tc } from '@/i18n/index.js';

import defaultProperties from '@/service/entity/default-properties.js';

const name = 'store-stencil';

// stencil item for store (only top and bottom lines)
export const StoreStencil = Shape.Path.define({
    constructorName: name,
    width: 150,
    height: 75,
    zIndex: 0,
    markup: [
        {
            tagName: 'path',
            selector: 'topLine'
        },
        {
            tagName: 'path',
            selector: 'bottomLine'
        },
        {
            tagName: 'text',
            selector: 'label'
        }
    ],
    attrs: {
        topLine: {
            stroke: '#333333',
            strokeWidth: 2,
            d: 'M 0 15 L 100 15'
        },
        bottomLine: {
            stroke: '#333333',
            strokeWidth: 2,
            d: 'M 0 35 L 100 35'
        },
        label: {
            text: tc('threatmodel.shapes.store'),
            fill: '#333',
            textVerticalAnchor: 'middle',
            textAnchor: 'middle',
            refX: 0.5,
            refY: 0.5
        }
    },
    data: defaultProperties.store
});

StoreStencil.prototype.type = 'tm.StoreStencil';
StoreStencil.prototype.convertToNode = 'store';

StoreStencil.prototype.setName = function (name) {
    this.setAttrByPath('label/text', name);
};

StoreStencil.prototype.updateStyle = function () {};

export default {
    StoreStencil,
    name
};