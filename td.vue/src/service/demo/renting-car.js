export default {
    version: '2.4.0',
    summary: {
        title: 'Renting Car Startup',
        owner: 'A development team',
        description:
            'This threat model has been provided by the OWASP Threat Model Cookbook:\nthreat-model-cookbook/Flow Diagram/renting-car-startup',
        id: 0,
    },
    detail: {
        contributors: [
            {
                name: 'development engineers',
            },
            {
                name: 'product managers',
            },
            {
                name: 'security architects',
            },
        ],
        diagrams: [
            {
                id: 0,
                title: 'Payment',
                diagramType: 'LINDDUN',
                placeholder: 'New LINDDUN diagram description',
                thumbnail: './public/content/images/thumbnail.linddun.jpg',
                version: '2.4.0',
                cells: [
                    {
                        position: {
                            x: 60,
                            y: 140,
                        },
                        size: {
                            width: 530,
                            height: 370,
                        },
                        attrs: {
                            label: {
                                text: 'Inside the car',
                            },
                        },
                        visible: true,
                        shape: 'trust-boundary-box',
                        id: 'ccca76fa-4ab3-422b-8967-af4a0ffa038c',
                        zIndex: -1,
                        data: {
                            type: 'tm.BoundaryBox',
                            description: '',
                            isTrustBoundary: true,
                            hasOpenThreats: false,
                        },
                    },
                    {
                        position: {
                            x: 420,
                            y: 550,
                        },
                        size: {
                            width: 550,
                            height: 500,
                        },
                        attrs: {
                            label: {
                                text: '',
                            },
                        },
                        visible: true,
                        shape: 'trust-boundary-box',
                        id: '31df2fc8-9b3f-4785-86d3-f4117e5b4a4a',
                        zIndex: -1,
                        data: {
                            type: 'tm.BoundaryBox',
                            description: '',
                            isTrustBoundary: true,
                            hasOpenThreats: false,
                        },
                    },
                    {
                        position: {
                            x: 1040,
                            y: 690,
                        },
                        size: {
                            width: 140,
                            height: 130,
                        },
                        attrs: {
                            label: {
                                text: 'DMZ',
                            },
                        },
                        visible: true,
                        shape: 'trust-boundary-box',
                        id: 'b4cca7ff-e149-4997-ae53-eab5196f32d5',
                        zIndex: -1,
                        data: {
                            type: 'tm.BoundaryBox',
                            name: 'DMZ',
                            description: '',
                            isTrustBoundary: true,
                            hasOpenThreats: false,
                        },
                    },
                    {
                        position: {
                            x: 190,
                            y: 10,
                        },
                        size: {
                            width: 190,
                            height: 60,
                        },
                        attrs: {
                            text: {
                                text: 'Demo threat model for a Renting Car Startup\nprovided by the OWASP Threat Model Cookbook:\nthreat-model-cookbook/Flow Diagram/renting-car-startup',
                            },
                        },
                        visible: true,
                        shape: 'td-text-block',
                        zIndex: 1,
                        id: 'f3ba6ded-7614-456e-b6b8-76d9f227e9de',
                        data: {
                            type: 'tm.Text',
                            name: 'Demo threat model for a Renting Car Startup\nprovided by the OWASP Threat Model Cookbook:\nthreat-model-cookbook/Flow Diagram/renting-car-startup',
                            hasOpenThreats: false,
                        },
                    },
                    {
                        position: {
                            x: 380,
                            y: 184.0000000000001,
                        },
                        size: {
                            width: 112.5,
                            height: 60,
                        },
                        attrs: {
                            text: {
                                text: 'Customer phone',
                            },
                            body: {
                                stroke: '#333333',
                                strokeWidth: 1.5,
                                strokeDasharray: null,
                            },
                        },
                        visible: true,
                        shape: 'actor',
                        ports: {
                            groups: {
                                top: {
                                    position: 'top',
                                    attrs: {
                                        circle: {
                                            r: 4,
                                            magnet: true,
                                            stroke: '#5F95FF',
                                            strokeWidth: 1,
                                            fill: '#fff',
                                            style: {
                                                visibility: 'hidden',
                                            },
                                        },
                                    },
                                },
                                right: {
                                    position: 'right',
                                    attrs: {
                                        circle: {
                                            r: 4,
                                            magnet: true,
                                            stroke: '#5F95FF',
                                            strokeWidth: 1,
                                            fill: '#fff',
                                            style: {
                                                visibility: 'hidden',
                                            },
                                        },
                                    },
                                },
                                bottom: {
                                    position: 'bottom',
                                    attrs: {
                                        circle: {
                                            r: 4,
                                            magnet: true,
                                            stroke: '#5F95FF',
                                            strokeWidth: 1,
                                            fill: '#fff',
                                            style: {
                                                visibility: 'hidden',
                                            },
                                        },
                                    },
                                },
                                left: {
                                    position: 'left',
                                    attrs: {
                                        circle: {
                                            r: 4,
                                            magnet: true,
                                            stroke: '#5F95FF',
                                            strokeWidth: 1,
                                            fill: '#fff',
                                            style: {
                                                visibility: 'hidden',
                                            },
                                        },
                                    },
                                },
                            },
                            items: [
                                {
                                    group: 'top',
                                    id: '5a646225-05f9-4e91-8901-0865ded7e710',
                                },
                                {
                                    group: 'right',
                                    id: 'fa42db9f-85ce-4ff1-8ca0-a8d875b78650',
                                },
                                {
                                    group: 'bottom',
                                    id: 'adeb6b94-39f5-4781-abe4-73d50b0d82d9',
                                },
                                {
                                    group: 'left',
                                    id: 'f5256f39-6b49-4572-9062-e45a650b4435',
                                },
                            ],
                        },
                        id: '7b0b3342-91b7-413e-94c6-ec06e3f5b885',
                        zIndex: 2,
                        data: {
                            type: 'tm.Actor',
                            name: 'Customer phone',
                            description: '',
                            outOfScope: false,
                            reasonOutOfScope: '',
                            hasOpenThreats: false,
                            providesAuthentication: false,
                            threats: [],
                        },
                    },
                    {
                        position: {
                            x: 129.99999999999994,
                            y: 204.0000000000001,
                        },
                        size: {
                            width: 130,
                            height: 110,
                        },
                        attrs: {
                            text: {
                                text: 'Connected Car',
                            },
                            body: {
                                stroke: '#333333',
                                strokeWidth: 1.5,
                                strokeDasharray: null,
                            },
                        },
                        visible: true,
                        shape: 'process',
                        ports: {
                            groups: {
                                top: {
                                    position: 'top',
                                    attrs: {
                                        circle: {
                                            r: 4,
                                            magnet: true,
                                            stroke: '#5F95FF',
                                            strokeWidth: 1,
                                            fill: '#fff',
                                            style: {
                                                visibility: 'hidden',
                                            },
                                        },
                                    },
                                },
                                right: {
                                    position: 'right',
                                    attrs: {
                                        circle: {
                                            r: 4,
                                            magnet: true,
                                            stroke: '#5F95FF',
                                            strokeWidth: 1,
                                            fill: '#fff',
                                            style: {
                                                visibility: 'hidden',
                                            },
                                        },
                                    },
                                },
                                bottom: {
                                    position: 'bottom',
                                    attrs: {
                                        circle: {
                                            r: 4,
                                            magnet: true,
                                            stroke: '#5F95FF',
                                            strokeWidth: 1,
                                            fill: '#fff',
                                            style: {
                                                visibility: 'hidden',
                                            },
                                        },
                                    },
                                },
                                left: {
                                    position: 'left',
                                    attrs: {
                                        circle: {
                                            r: 4,
                                            magnet: true,
                                            stroke: '#5F95FF',
                                            strokeWidth: 1,
                                            fill: '#fff',
                                            style: {
                                                visibility: 'hidden',
                                            },
                                        },
                                    },
                                },
                            },
                            items: [
                                {
                                    group: 'top',
                                    id: 'f9242827-c2c9-4f9b-8ef3-03d3d00b6935',
                                },
                                {
                                    group: 'right',
                                    id: '12905ec4-2822-4239-b420-49c483514c98',
                                },
                                {
                                    group: 'bottom',
                                    id: 'b8ca633a-3ccc-4548-8cb3-f1bd6fa1ee37',
                                },
                                {
                                    group: 'left',
                                    id: 'd241a17c-a819-4032-8c5c-e6f747d3769b',
                                },
                            ],
                        },
                        id: '671ef60b-49c5-4d7b-8cba-a44a4c580050',
                        zIndex: 3,
                        data: {
                            type: 'tm.Process',
                            name: 'Connected Car',
                            description: '',
                            outOfScope: false,
                            reasonOutOfScope: '',
                            hasOpenThreats: false,
                            handlesCardPayment: false,
                            handlesGoodsOrServices: false,
                            isWebApplication: false,
                            privilegeLevel: '',
                            threats: [],
                        },
                    },
                    {
                        position: {
                            x: 130,
                            y: 390,
                        },
                        size: {
                            width: 60,
                            height: 60,
                        },
                        attrs: {
                            text: {
                                text: 'ABC',
                            },
                            body: {
                                stroke: '#333333',
                                strokeWidth: 1.5,
                                strokeDasharray: null,
                            },
                        },
                        visible: true,
                        shape: 'process',
                        ports: {
                            groups: {
                                top: {
                                    position: 'top',
                                    attrs: {
                                        circle: {
                                            r: 4,
                                            magnet: true,
                                            stroke: '#5F95FF',
                                            strokeWidth: 1,
                                            fill: '#fff',
                                            style: {
                                                visibility: 'hidden',
                                            },
                                        },
                                    },
                                },
                                right: {
                                    position: 'right',
                                    attrs: {
                                        circle: {
                                            r: 4,
                                            magnet: true,
                                            stroke: '#5F95FF',
                                            strokeWidth: 1,
                                            fill: '#fff',
                                            style: {
                                                visibility: 'hidden',
                                            },
                                        },
                                    },
                                },
                                bottom: {
                                    position: 'bottom',
                                    attrs: {
                                        circle: {
                                            r: 4,
                                            magnet: true,
                                            stroke: '#5F95FF',
                                            strokeWidth: 1,
                                            fill: '#fff',
                                            style: {
                                                visibility: 'hidden',
                                            },
                                        },
                                    },
                                },
                                left: {
                                    position: 'left',
                                    attrs: {
                                        circle: {
                                            r: 4,
                                            magnet: true,
                                            stroke: '#5F95FF',
                                            strokeWidth: 1,
                                            fill: '#fff',
                                            style: {
                                                visibility: 'hidden',
                                            },
                                        },
                                    },
                                },
                            },
                            items: [
                                {
                                    group: 'top',
                                    id: 'f9242827-c2c9-4f9b-8ef3-03d3d00b6935',
                                },
                                {
                                    group: 'right',
                                    id: '12905ec4-2822-4239-b420-49c483514c98',
                                },
                                {
                                    group: 'bottom',
                                    id: 'b8ca633a-3ccc-4548-8cb3-f1bd6fa1ee37',
                                },
                                {
                                    group: 'left',
                                    id: 'd241a17c-a819-4032-8c5c-e6f747d3769b',
                                },
                            ],
                        },
                        id: 'e034d60f-5399-4de9-b90e-b4483b948606',
                        zIndex: 4,
                        data: {
                            type: 'tm.Process',
                            name: 'ABC',
                            description: '',
                            outOfScope: false,
                            reasonOutOfScope: '',
                            hasOpenThreats: false,
                            handlesCardPayment: false,
                            handlesGoodsOrServices: false,
                            isWebApplication: false,
                            privilegeLevel: '',
                            threats: [],
                        },
                    },
                    {
                        position: {
                            x: 401.25,
                            y: 350,
                        },
                        size: {
                            width: 110,
                            height: 100,
                        },
                        attrs: {
                            text: {
                                text: 'CADZ mobile',
                            },
                            body: {
                                stroke: '#333333',
                                strokeWidth: 1.5,
                                strokeDasharray: null,
                            },
                        },
                        visible: true,
                        shape: 'process',
                        ports: {
                            groups: {
                                top: {
                                    position: 'top',
                                    attrs: {
                                        circle: {
                                            r: 4,
                                            magnet: true,
                                            stroke: '#5F95FF',
                                            strokeWidth: 1,
                                            fill: '#fff',
                                            style: {
                                                visibility: 'hidden',
                                            },
                                        },
                                    },
                                },
                                right: {
                                    position: 'right',
                                    attrs: {
                                        circle: {
                                            r: 4,
                                            magnet: true,
                                            stroke: '#5F95FF',
                                            strokeWidth: 1,
                                            fill: '#fff',
                                            style: {
                                                visibility: 'hidden',
                                            },
                                        },
                                    },
                                },
                                bottom: {
                                    position: 'bottom',
                                    attrs: {
                                        circle: {
                                            r: 4,
                                            magnet: true,
                                            stroke: '#5F95FF',
                                            strokeWidth: 1,
                                            fill: '#fff',
                                            style: {
                                                visibility: 'hidden',
                                            },
                                        },
                                    },
                                },
                                left: {
                                    position: 'left',
                                    attrs: {
                                        circle: {
                                            r: 4,
                                            magnet: true,
                                            stroke: '#5F95FF',
                                            strokeWidth: 1,
                                            fill: '#fff',
                                            style: {
                                                visibility: 'hidden',
                                            },
                                        },
                                    },
                                },
                            },
                            items: [
                                {
                                    group: 'top',
                                    id: 'f9242827-c2c9-4f9b-8ef3-03d3d00b6935',
                                },
                                {
                                    group: 'right',
                                    id: '12905ec4-2822-4239-b420-49c483514c98',
                                },
                                {
                                    group: 'bottom',
                                    id: 'b8ca633a-3ccc-4548-8cb3-f1bd6fa1ee37',
                                },
                                {
                                    group: 'left',
                                    id: 'd241a17c-a819-4032-8c5c-e6f747d3769b',
                                },
                            ],
                        },
                        id: '5aa3b660-f401-4665-b402-f6b0bca4ba94',
                        zIndex: 5,
                        data: {
                            type: 'tm.Process',
                            name: 'CADZ mobile',
                            description: '',
                            outOfScope: false,
                            reasonOutOfScope: '',
                            hasOpenThreats: false,
                            handlesCardPayment: false,
                            handlesGoodsOrServices: false,
                            isWebApplication: false,
                            privilegeLevel: '',
                            threats: [],
                        },
                    },
                    {
                        shape: 'flow',
                        attrs: {
                            line: {
                                stroke: '#333333',
                                targetMarker: {
                                    name: 'block',
                                },
                                sourceMarker: {
                                    name: '',
                                },
                                strokeDasharray: null,
                            },
                        },
                        width: 200,
                        height: 100,
                        zIndex: 10,
                        labels: [
                            {
                                markup: [
                                    {
                                        tagName: 'ellipse',
                                        selector: 'labelBody',
                                    },
                                    {
                                        tagName: 'text',
                                        selector: 'labelText',
                                    },
                                ],
                                attrs: {
                                    labelText: {
                                        text: '',
                                        textAnchor: 'middle',
                                        textVerticalAnchor: 'middle',
                                    },
                                    labelBody: {
                                        ref: 'labelText',
                                        refRx: '50%',
                                        refRy: '60%',
                                        fill: '#fff',
                                        strokeWidth: 0,
                                    },
                                },
                                position: {
                                    distance: 0.5,
                                    args: {
                                        keepGradient: true,
                                        ensureLegibility: true,
                                    },
                                },
                            },
                        ],
                        connector: 'smooth',
                        data: {
                            type: 'tm.Flow',
                            name: '',
                            description: '',
                            outOfScope: false,
                            reasonOutOfScope: '',
                            hasOpenThreats: false,
                            isBidirectional: false,
                            isEncrypted: false,
                            isPublicNetwork: false,
                            protocol: '',
                            threats: [],
                        },
                        id: '5e9b0dfb-811a-43db-af9b-f44ce6daef10',
                        source: {
                            cell: '671ef60b-49c5-4d7b-8cba-a44a4c580050',
                            port: 'b8ca633a-3ccc-4548-8cb3-f1bd6fa1ee37',
                        },
                        target: {
                            cell: 'e034d60f-5399-4de9-b90e-b4483b948606',
                            port: 'f9242827-c2c9-4f9b-8ef3-03d3d00b6935',
                        },
                        vertices: [],
                    },
                    {
                        shape: 'flow',
                        attrs: {
                            line: {
                                stroke: '#333333',
                                targetMarker: {
                                    name: 'block',
                                },
                                sourceMarker: {
                                    name: '',
                                },
                                strokeDasharray: null,
                            },
                        },
                        width: 200,
                        height: 100,
                        zIndex: 10,
                        labels: [
                            {
                                markup: [
                                    {
                                        tagName: 'ellipse',
                                        selector: 'labelBody',
                                    },
                                    {
                                        tagName: 'text',
                                        selector: 'labelText',
                                    },
                                ],
                                attrs: {
                                    labelText: {
                                        text: '',
                                        textAnchor: 'middle',
                                        textVerticalAnchor: 'middle',
                                    },
                                    labelBody: {
                                        ref: 'labelText',
                                        refRx: '50%',
                                        refRy: '60%',
                                        fill: '#fff',
                                        strokeWidth: 0,
                                    },
                                },
                                position: {
                                    distance: 0.5,
                                    args: {
                                        keepGradient: true,
                                        ensureLegibility: true,
                                    },
                                },
                            },
                        ],
                        connector: 'smooth',
                        data: {
                            type: 'tm.Flow',
                            name: 'Bluetooth',
                            description: '',
                            outOfScope: false,
                            reasonOutOfScope: '',
                            hasOpenThreats: false,
                            isBidirectional: false,
                            isEncrypted: false,
                            isPublicNetwork: false,
                            protocol: 'Bluetooth',
                            threats: [],
                        },
                        id: 'bcff68fc-5f14-4144-9275-8a8b3ea6c2c0',
                        source: {
                            cell: '671ef60b-49c5-4d7b-8cba-a44a4c580050',
                            port: '12905ec4-2822-4239-b420-49c483514c98',
                        },
                        target: {
                            cell: '5aa3b660-f401-4665-b402-f6b0bca4ba94',
                            port: 'd241a17c-a819-4032-8c5c-e6f747d3769b',
                        },
                        vertices: [],
                    },
                    {
                        shape: 'flow',
                        attrs: {
                            line: {
                                stroke: '#333333',
                                targetMarker: {
                                    name: 'block',
                                },
                                sourceMarker: {
                                    name: '',
                                },
                                strokeDasharray: null,
                            },
                        },
                        width: 200,
                        height: 100,
                        zIndex: 10,
                        labels: [
                            {
                                markup: [
                                    {
                                        tagName: 'ellipse',
                                        selector: 'labelBody',
                                    },
                                    {
                                        tagName: 'text',
                                        selector: 'labelText',
                                    },
                                ],
                                attrs: {
                                    labelText: {
                                        text: '',
                                        textAnchor: 'middle',
                                        textVerticalAnchor: 'middle',
                                    },
                                    labelBody: {
                                        ref: 'labelText',
                                        refRx: '50%',
                                        refRy: '60%',
                                        fill: '#fff',
                                        strokeWidth: 0,
                                    },
                                },
                                position: {
                                    distance: 0.5,
                                    args: {
                                        keepGradient: true,
                                        ensureLegibility: true,
                                    },
                                },
                            },
                        ],
                        connector: 'smooth',
                        data: {
                            type: 'tm.Flow',
                            name: 'Launch',
                            description: '',
                            outOfScope: false,
                            reasonOutOfScope: '',
                            hasOpenThreats: false,
                            isBidirectional: false,
                            isEncrypted: false,
                            isPublicNetwork: false,
                            protocol: '',
                            threats: [],
                        },
                        id: '634a9127-ff89-45fa-a83b-3bb00671259a',
                        source: {
                            cell: '7b0b3342-91b7-413e-94c6-ec06e3f5b885',
                            port: 'adeb6b94-39f5-4781-abe4-73d50b0d82d9',
                        },
                        target: {
                            cell: '5aa3b660-f401-4665-b402-f6b0bca4ba94',
                            port: 'f9242827-c2c9-4f9b-8ef3-03d3d00b6935',
                        },
                        vertices: [],
                    },
                    {
                        shape: 'flow',
                        attrs: {
                            line: {
                                stroke: '#333333',
                                targetMarker: {
                                    name: 'block',
                                },
                                sourceMarker: {
                                    name: '',
                                },
                                strokeDasharray: null,
                            },
                        },
                        width: 200,
                        height: 100,
                        zIndex: 10,
                        labels: [
                            {
                                markup: [
                                    {
                                        tagName: 'ellipse',
                                        selector: 'labelBody',
                                    },
                                    {
                                        tagName: 'text',
                                        selector: 'labelText',
                                    },
                                ],
                                attrs: {
                                    labelText: {
                                        text: '',
                                        textAnchor: 'middle',
                                        textVerticalAnchor: 'middle',
                                    },
                                    labelBody: {
                                        ref: 'labelText',
                                        refRx: '50%',
                                        refRy: '60%',
                                        fill: '#fff',
                                        strokeWidth: 0,
                                    },
                                },
                                position: {
                                    distance: 0.5,
                                    args: {
                                        keepGradient: true,
                                        ensureLegibility: true,
                                    },
                                },
                            },
                        ],
                        connector: 'smooth',
                        data: {
                            type: 'tm.Flow',
                            name: 'Launch',
                            description: '',
                            outOfScope: false,
                            reasonOutOfScope: '',
                            hasOpenThreats: false,
                            isBidirectional: false,
                            isEncrypted: false,
                            isPublicNetwork: false,
                            protocol: '',
                            threats: [],
                        },
                        id: '9b207c0e-1a97-4116-a5af-29c0ce16f9c5',
                        source: {
                            cell: '48498277-1e9f-49ef-8262-8dcb74c6c680',
                            port: 'adeb6b94-39f5-4781-abe4-73d50b0d82d9',
                        },
                        target: {
                            cell: '558d99e0-e64a-474a-8c91-799a8301a1a6',
                            port: 'f9242827-c2c9-4f9b-8ef3-03d3d00b6935',
                        },
                        vertices: [
                            {
                                x: 710,
                                y: 290,
                            },
                        ],
                    },
                    {
                        shape: 'flow',
                        attrs: {
                            line: {
                                stroke: '#333333',
                                targetMarker: {
                                    name: 'block',
                                },
                                sourceMarker: {
                                    name: '',
                                },
                                strokeDasharray: null,
                            },
                        },
                        width: 200,
                        height: 100,
                        zIndex: 10,
                        labels: [
                            {
                                markup: [
                                    {
                                        tagName: 'ellipse',
                                        selector: 'labelBody',
                                    },
                                    {
                                        tagName: 'text',
                                        selector: 'labelText',
                                    },
                                ],
                                attrs: {
                                    labelText: {
                                        text: '',
                                        textAnchor: 'middle',
                                        textVerticalAnchor: 'middle',
                                    },
                                    labelBody: {
                                        ref: 'labelText',
                                        refRx: '50%',
                                        refRy: '60%',
                                        fill: '#fff',
                                        strokeWidth: 0,
                                    },
                                },
                                position: {
                                    distance: 0.5,
                                    args: {
                                        keepGradient: true,
                                        ensureLegibility: true,
                                    },
                                },
                            },
                        ],
                        connector: 'smooth',
                        data: {
                            type: 'tm.Flow',
                            name: '',
                            description: '',
                            outOfScope: false,
                            reasonOutOfScope: '',
                            hasOpenThreats: false,
                            isBidirectional: false,
                            isEncrypted: false,
                            isPublicNetwork: false,
                            protocol: '',
                            threats: [],
                        },
                        id: '7ea05064-9162-41fe-bc27-9e574e490332',
                        source: {
                            cell: 'e38c302a-1195-47e9-b3ba-d81219187dd2',
                            port: 'b8ca633a-3ccc-4548-8cb3-f1bd6fa1ee37',
                        },
                        target: {
                            cell: '848b0077-0e7e-4e1d-8f0c-47b00cc431fd',
                            port: '5a646225-05f9-4e91-8901-0865ded7e710',
                        },
                        vertices: [
                            {
                                x: 1090,
                                y: 870,
                            },
                        ],
                    },
                    {
                        shape: 'flow',
                        attrs: {
                            line: {
                                stroke: '#333333',
                                targetMarker: {
                                    name: 'block',
                                },
                                sourceMarker: {
                                    name: '',
                                },
                                strokeDasharray: null,
                            },
                        },
                        width: 200,
                        height: 100,
                        zIndex: 10,
                        labels: [
                            {
                                markup: [
                                    {
                                        tagName: 'ellipse',
                                        selector: 'labelBody',
                                    },
                                    {
                                        tagName: 'text',
                                        selector: 'labelText',
                                    },
                                ],
                                attrs: {
                                    labelText: {
                                        text: '',
                                        textAnchor: 'middle',
                                        textVerticalAnchor: 'middle',
                                    },
                                    labelBody: {
                                        ref: 'labelText',
                                        refRx: '50%',
                                        refRy: '60%',
                                        fill: '#fff',
                                        strokeWidth: 0,
                                    },
                                },
                                position: {
                                    distance: 0.5,
                                    args: {
                                        keepGradient: true,
                                        ensureLegibility: true,
                                    },
                                },
                            },
                        ],
                        connector: 'smooth',
                        data: {
                            type: 'tm.Flow',
                            name: 'HTTP',
                            description: '',
                            outOfScope: false,
                            reasonOutOfScope: '',
                            hasOpenThreats: false,
                            isBidirectional: false,
                            isEncrypted: false,
                            isPublicNetwork: false,
                            protocol: 'HTTP',
                            threats: [],
                        },
                        id: '9115c415-b680-4a10-8440-7a996125a15a',
                        source: {
                            cell: '1902c8e6-ed01-46c5-a6fe-28ce965a5dec',
                            port: '12905ec4-2822-4239-b420-49c483514c98',
                        },
                        target: {
                            cell: 'e38c302a-1195-47e9-b3ba-d81219187dd2',
                            port: 'd241a17c-a819-4032-8c5c-e6f747d3769b',
                        },
                        vertices: [],
                    },
                    {
                        shape: 'flow',
                        attrs: {
                            line: {
                                stroke: '#333333',
                                targetMarker: {
                                    name: 'block',
                                },
                                sourceMarker: {
                                    name: '',
                                },
                                strokeDasharray: null,
                            },
                        },
                        width: 200,
                        height: 100,
                        zIndex: 10,
                        labels: [
                            {
                                markup: [
                                    {
                                        tagName: 'ellipse',
                                        selector: 'labelBody',
                                    },
                                    {
                                        tagName: 'text',
                                        selector: 'labelText',
                                    },
                                ],
                                attrs: {
                                    labelText: {
                                        text: '',
                                        textAnchor: 'middle',
                                        textVerticalAnchor: 'middle',
                                    },
                                    labelBody: {
                                        ref: 'labelText',
                                        refRx: '50%',
                                        refRy: '60%',
                                        fill: '#fff',
                                        strokeWidth: 0,
                                    },
                                },
                                position: {
                                    distance: 0.5,
                                    args: {
                                        keepGradient: true,
                                        ensureLegibility: true,
                                    },
                                },
                            },
                        ],
                        connector: 'smooth',
                        data: {
                            type: 'tm.Flow',
                            name: 'SSH',
                            description: '',
                            outOfScope: false,
                            reasonOutOfScope: '',
                            hasOpenThreats: false,
                            isBidirectional: false,
                            isEncrypted: false,
                            isPublicNetwork: false,
                            protocol: 'SSH',
                            threats: [],
                        },
                        id: '95b6f614-2599-4a4a-a516-fb088d3f046e',
                        source: {
                            cell: '1902c8e6-ed01-46c5-a6fe-28ce965a5dec',
                            port: '12905ec4-2822-4239-b420-49c483514c98',
                        },
                        target: {
                            cell: '6e0abf37-5f5b-43ea-a567-07d2580e0c03',
                            port: 'f9242827-c2c9-4f9b-8ef3-03d3d00b6935',
                        },
                        vertices: [
                            {
                                x: 820,
                                y: 760,
                            },
                        ],
                    },
                    {
                        shape: 'flow',
                        attrs: {
                            line: {
                                stroke: '#333333',
                                targetMarker: {
                                    name: 'block',
                                },
                                sourceMarker: {
                                    name: '',
                                },
                                strokeDasharray: null,
                            },
                        },
                        width: 200,
                        height: 100,
                        zIndex: 10,
                        labels: [
                            {
                                markup: [
                                    {
                                        tagName: 'ellipse',
                                        selector: 'labelBody',
                                    },
                                    {
                                        tagName: 'text',
                                        selector: 'labelText',
                                    },
                                ],
                                attrs: {
                                    labelText: {
                                        text: '',
                                        textAnchor: 'middle',
                                        textVerticalAnchor: 'middle',
                                    },
                                    labelBody: {
                                        ref: 'labelText',
                                        refRx: '50%',
                                        refRy: '60%',
                                        fill: '#fff',
                                        strokeWidth: 0,
                                    },
                                },
                                position: {
                                    distance: 0.5,
                                    args: {
                                        keepGradient: true,
                                        ensureLegibility: true,
                                    },
                                },
                            },
                        ],
                        connector: 'smooth',
                        data: {
                            type: 'tm.Flow',
                            name: 'HTTP/2',
                            description: '',
                            outOfScope: false,
                            reasonOutOfScope: '',
                            hasOpenThreats: false,
                            isBidirectional: false,
                            isEncrypted: false,
                            isPublicNetwork: false,
                            protocol: 'HTTP/2',
                            threats: [],
                        },
                        id: '28b21d9d-7c6e-42d5-8897-6c465cebe298',
                        source: {
                            cell: '1902c8e6-ed01-46c5-a6fe-28ce965a5dec',
                            port: 'b8ca633a-3ccc-4548-8cb3-f1bd6fa1ee37',
                        },
                        target: {
                            cell: 'ea829ca8-aae2-45fd-be06-a311b79b296b',
                            port: 'f9242827-c2c9-4f9b-8ef3-03d3d00b6935',
                        },
                        vertices: [
                            {
                                x: 733,
                                y: 760,
                            },
                        ],
                    },
                    {
                        shape: 'flow',
                        attrs: {
                            line: {
                                stroke: '#333333',
                                targetMarker: {
                                    name: 'block',
                                },
                                sourceMarker: {
                                    name: '',
                                },
                                strokeDasharray: null,
                            },
                        },
                        width: 200,
                        height: 100,
                        zIndex: 10,
                        labels: [
                            {
                                markup: [
                                    {
                                        tagName: 'ellipse',
                                        selector: 'labelBody',
                                    },
                                    {
                                        tagName: 'text',
                                        selector: 'labelText',
                                    },
                                ],
                                attrs: {
                                    labelText: {
                                        text: '',
                                        textAnchor: 'middle',
                                        textVerticalAnchor: 'middle',
                                    },
                                    labelBody: {
                                        ref: 'labelText',
                                        refRx: '50%',
                                        refRy: '60%',
                                        fill: '#fff',
                                        strokeWidth: 0,
                                    },
                                },
                                position: {
                                    distance: 0.5,
                                    args: {
                                        keepGradient: true,
                                        ensureLegibility: true,
                                    },
                                },
                            },
                        ],
                        connector: 'smooth',
                        data: {
                            type: 'tm.Flow',
                            name: 'HTTP',
                            description: '',
                            outOfScope: false,
                            reasonOutOfScope: '',
                            hasOpenThreats: false,
                            isBidirectional: false,
                            isEncrypted: false,
                            isPublicNetwork: false,
                            protocol: 'HTTP',
                            threats: [],
                        },
                        id: 'd07111c0-b70f-4044-aac6-cea56814d5db',
                        source: {
                            cell: '1902c8e6-ed01-46c5-a6fe-28ce965a5dec',
                            port: 'b8ca633a-3ccc-4548-8cb3-f1bd6fa1ee37',
                        },
                        target: {
                            cell: 'fa057d26-46cb-4bbd-bb4a-141257787447',
                            port: 'f9242827-c2c9-4f9b-8ef3-03d3d00b6935',
                        },
                        vertices: [
                            {
                                x: 620,
                                y: 790,
                            },
                        ],
                    },
                    {
                        shape: 'flow',
                        attrs: {
                            line: {
                                stroke: '#333333',
                                targetMarker: {
                                    name: 'block',
                                },
                                sourceMarker: {
                                    name: '',
                                },
                                strokeDasharray: null,
                            },
                        },
                        width: 200,
                        height: 100,
                        zIndex: 10,
                        labels: [
                            {
                                markup: [
                                    {
                                        tagName: 'ellipse',
                                        selector: 'labelBody',
                                    },
                                    {
                                        tagName: 'text',
                                        selector: 'labelText',
                                    },
                                ],
                                attrs: {
                                    labelText: {
                                        text: '',
                                        textAnchor: 'middle',
                                        textVerticalAnchor: 'middle',
                                    },
                                    labelBody: {
                                        ref: 'labelText',
                                        refRx: '50%',
                                        refRy: '60%',
                                        fill: '#fff',
                                        strokeWidth: 0,
                                    },
                                },
                                position: {
                                    distance: 0.5,
                                    args: {
                                        keepGradient: true,
                                        ensureLegibility: true,
                                    },
                                },
                            },
                        ],
                        connector: 'smooth',
                        data: {
                            type: 'tm.Flow',
                            name: 'HTTPS',
                            description: '',
                            outOfScope: false,
                            reasonOutOfScope: '',
                            hasOpenThreats: false,
                            isBidirectional: false,
                            isEncrypted: false,
                            isPublicNetwork: false,
                            protocol: 'HTTPS',
                            threats: [],
                        },
                        id: '8daf0a86-584c-44de-8f9f-afb9cf77a07f',
                        source: {
                            cell: '558d99e0-e64a-474a-8c91-799a8301a1a6',
                            port: 'b8ca633a-3ccc-4548-8cb3-f1bd6fa1ee37',
                        },
                        target: {
                            cell: '1902c8e6-ed01-46c5-a6fe-28ce965a5dec',
                            port: 'f9242827-c2c9-4f9b-8ef3-03d3d00b6935',
                        },
                        vertices: [],
                    },
                    {
                        shape: 'flow',
                        attrs: {
                            line: {
                                stroke: '#333333',
                                targetMarker: {
                                    name: 'block',
                                },
                                sourceMarker: {
                                    name: '',
                                },
                                strokeDasharray: null,
                            },
                        },
                        width: 200,
                        height: 100,
                        zIndex: 10,
                        labels: [
                            {
                                markup: [
                                    {
                                        tagName: 'ellipse',
                                        selector: 'labelBody',
                                    },
                                    {
                                        tagName: 'text',
                                        selector: 'labelText',
                                    },
                                ],
                                attrs: {
                                    labelText: {
                                        text: '',
                                        textAnchor: 'middle',
                                        textVerticalAnchor: 'middle',
                                    },
                                    labelBody: {
                                        ref: 'labelText',
                                        refRx: '50%',
                                        refRy: '60%',
                                        fill: '#fff',
                                        strokeWidth: 0,
                                    },
                                },
                                position: {
                                    distance: 0.5,
                                    args: {
                                        keepGradient: true,
                                        ensureLegibility: true,
                                    },
                                },
                            },
                        ],
                        connector: 'smooth',
                        data: {
                            type: 'tm.Flow',
                            name: 'HTTPS',
                            description: '',
                            outOfScope: false,
                            reasonOutOfScope: '',
                            hasOpenThreats: false,
                            isBidirectional: false,
                            isEncrypted: false,
                            isPublicNetwork: false,
                            protocol: '',
                            threats: [],
                        },
                        id: 'd9303ea2-8f48-4622-a87d-7a0401766713',
                        source: {
                            cell: '5aa3b660-f401-4665-b402-f6b0bca4ba94',
                            port: '12905ec4-2822-4239-b420-49c483514c98',
                        },
                        target: {
                            cell: '1902c8e6-ed01-46c5-a6fe-28ce965a5dec',
                            port: 'f9242827-c2c9-4f9b-8ef3-03d3d00b6935',
                        },
                        vertices: [
                            {
                                x: 620,
                                y: 450,
                            },
                        ],
                    },
                    {
                        shape: 'flow',
                        attrs: {
                            line: {
                                stroke: '#333333',
                                targetMarker: {
                                    name: 'block',
                                },
                                sourceMarker: {
                                    name: '',
                                },
                                strokeDasharray: null,
                            },
                        },
                        width: 200,
                        height: 100,
                        zIndex: 10,
                        labels: [
                            {
                                markup: [
                                    {
                                        tagName: 'ellipse',
                                        selector: 'labelBody',
                                    },
                                    {
                                        tagName: 'text',
                                        selector: 'labelText',
                                    },
                                ],
                                attrs: {
                                    labelText: {
                                        text: '',
                                        textAnchor: 'middle',
                                        textVerticalAnchor: 'middle',
                                    },
                                    labelBody: {
                                        ref: 'labelText',
                                        refRx: '50%',
                                        refRy: '60%',
                                        fill: '#fff',
                                        strokeWidth: 0,
                                    },
                                },
                                position: {
                                    distance: 0.5,
                                    args: {
                                        keepGradient: true,
                                        ensureLegibility: true,
                                    },
                                },
                            },
                        ],
                        connector: 'smooth',
                        data: {
                            type: 'tm.Flow',
                            name: '',
                            description: '',
                            outOfScope: false,
                            reasonOutOfScope: '',
                            hasOpenThreats: false,
                            isBidirectional: false,
                            isEncrypted: false,
                            isPublicNetwork: false,
                            protocol: '',
                            threats: [],
                        },
                        id: 'ea292269-6a55-4172-a9be-0bfd1f3c670c',
                        source: {
                            cell: 'e034d60f-5399-4de9-b90e-b4483b948606',
                            port: 'b8ca633a-3ccc-4548-8cb3-f1bd6fa1ee37',
                        },
                        target: {
                            cell: '392007cf-8756-43f6-b1d1-d73a887ad054',
                            port: 'fb2429b6-5727-47aa-a520-0b88452ecf5e',
                        },
                        vertices: [
                            {
                                x: 180,
                                y: 810,
                            },
                        ],
                    },
                    {
                        shape: 'flow',
                        attrs: {
                            line: {
                                stroke: '#333333',
                                targetMarker: {
                                    name: 'block',
                                },
                                sourceMarker: {
                                    name: '',
                                },
                                strokeDasharray: null,
                            },
                        },
                        width: 200,
                        height: 100,
                        zIndex: 10,
                        labels: [
                            {
                                markup: [
                                    {
                                        tagName: 'ellipse',
                                        selector: 'labelBody',
                                    },
                                    {
                                        tagName: 'text',
                                        selector: 'labelText',
                                    },
                                ],
                                attrs: {
                                    labelText: {
                                        text: '',
                                        textAnchor: 'middle',
                                        textVerticalAnchor: 'middle',
                                    },
                                    labelBody: {
                                        ref: 'labelText',
                                        refRx: '50%',
                                        refRy: '60%',
                                        fill: '#fff',
                                        strokeWidth: 0,
                                    },
                                },
                                position: {
                                    distance: 0.5,
                                    args: {
                                        keepGradient: true,
                                        ensureLegibility: true,
                                    },
                                },
                            },
                        ],
                        connector: 'smooth',
                        data: {
                            type: 'tm.Flow',
                            name: '',
                            description: '',
                            outOfScope: false,
                            reasonOutOfScope: '',
                            hasOpenThreats: false,
                            isBidirectional: false,
                            isEncrypted: false,
                            isPublicNetwork: false,
                            protocol: '',
                            threats: [],
                        },
                        id: 'db4db3f9-843b-4052-abab-c48495156cea',
                        source: {
                            cell: 'fa057d26-46cb-4bbd-bb4a-141257787447',
                            port: 'd241a17c-a819-4032-8c5c-e6f747d3769b',
                        },
                        target: {
                            cell: '392007cf-8756-43f6-b1d1-d73a887ad054',
                            port: '595e5c53-e6f3-4202-8ff1-7578e5869ad2',
                        },
                        vertices: [
                            {
                                x: 560,
                                y: 910,
                            },
                        ],
                    },
                    {
                        shape: 'flow',
                        attrs: {
                            line: {
                                stroke: '#333333',
                                targetMarker: {
                                    name: 'block',
                                },
                                sourceMarker: {
                                    name: '',
                                },
                                strokeDasharray: null,
                            },
                        },
                        width: 200,
                        height: 100,
                        zIndex: 10,
                        labels: [
                            {
                                markup: [
                                    {
                                        tagName: 'ellipse',
                                        selector: 'labelBody',
                                    },
                                    {
                                        tagName: 'text',
                                        selector: 'labelText',
                                    },
                                ],
                                attrs: {
                                    labelText: {
                                        text: '',
                                        textAnchor: 'middle',
                                        textVerticalAnchor: 'middle',
                                    },
                                    labelBody: {
                                        ref: 'labelText',
                                        refRx: '50%',
                                        refRy: '60%',
                                        fill: '#fff',
                                        strokeWidth: 0,
                                    },
                                },
                                position: {
                                    distance: 0.5,
                                    args: {
                                        keepGradient: true,
                                        ensureLegibility: true,
                                    },
                                },
                            },
                        ],
                        connector: 'smooth',
                        data: {
                            type: 'tm.Flow',
                            name: '',
                            description: '',
                            outOfScope: false,
                            reasonOutOfScope: '',
                            hasOpenThreats: false,
                            isBidirectional: false,
                            isEncrypted: false,
                            isPublicNetwork: false,
                            protocol: '',
                            threats: [],
                        },
                        id: 'decff498-4988-4cb0-9ccc-eb4ee0b657f9',
                        source: {
                            cell: '6e0abf37-5f5b-43ea-a567-07d2580e0c03',
                            port: 'b8ca633a-3ccc-4548-8cb3-f1bd6fa1ee37',
                        },
                        target: {
                            cell: '00f81686-5040-4803-88f9-dd9cd6599067',
                            port: '595e5c53-e6f3-4202-8ff1-7578e5869ad2',
                        },
                        vertices: [],
                    },
                    {
                        shape: 'flow',
                        attrs: {
                            line: {
                                stroke: '#333333',
                                targetMarker: {
                                    name: 'block',
                                },
                                sourceMarker: {
                                    name: 'block',
                                },
                                strokeDasharray: null,
                            },
                        },
                        width: 200,
                        height: 100,
                        zIndex: 10,
                        labels: [
                            {
                                markup: [
                                    {
                                        tagName: 'ellipse',
                                        selector: 'labelBody',
                                    },
                                    {
                                        tagName: 'text',
                                        selector: 'labelText',
                                    },
                                ],
                                attrs: {
                                    labelText: {
                                        text: '',
                                        textAnchor: 'middle',
                                        textVerticalAnchor: 'middle',
                                    },
                                    labelBody: {
                                        ref: 'labelText',
                                        refRx: '50%',
                                        refRy: '60%',
                                        fill: '#fff',
                                        strokeWidth: 0,
                                    },
                                },
                                position: {
                                    distance: 0.5,
                                    args: {
                                        keepGradient: true,
                                        ensureLegibility: true,
                                    },
                                },
                            },
                        ],
                        connector: 'smooth',
                        data: {
                            type: 'tm.Flow',
                            name: 'Kerberos',
                            description: '',
                            outOfScope: false,
                            reasonOutOfScope: '',
                            hasOpenThreats: false,
                            isBidirectional: true,
                            isEncrypted: false,
                            isPublicNetwork: false,
                            protocol: '',
                            threats: [],
                        },
                        id: 'ae2c63d7-e85a-4934-bc39-46b91eea9928',
                        source: {
                            cell: '1902c8e6-ed01-46c5-a6fe-28ce965a5dec',
                            port: 'd241a17c-a819-4032-8c5c-e6f747d3769b',
                        },
                        target: {
                            cell: '71a67ca8-5267-4e67-9c40-5497d3d6072f',
                            port: 'f9242827-c2c9-4f9b-8ef3-03d3d00b6935',
                        },
                        vertices: [
                            {
                                x: 530,
                                y: 700,
                            },
                        ],
                    },
                    {
                        position: {
                            x: 703,
                            y: 184,
                        },
                        size: {
                            width: 112.5,
                            height: 60,
                        },
                        attrs: {
                            text: {
                                text: 'Owner phone',
                            },
                            body: {
                                stroke: '#333333',
                                strokeWidth: 1.5,
                                strokeDasharray: null,
                            },
                        },
                        visible: true,
                        shape: 'actor',
                        ports: {
                            groups: {
                                top: {
                                    position: 'top',
                                    attrs: {
                                        circle: {
                                            r: 4,
                                            magnet: true,
                                            stroke: '#5F95FF',
                                            strokeWidth: 1,
                                            fill: '#fff',
                                            style: {
                                                visibility: 'hidden',
                                            },
                                        },
                                    },
                                },
                                right: {
                                    position: 'right',
                                    attrs: {
                                        circle: {
                                            r: 4,
                                            magnet: true,
                                            stroke: '#5F95FF',
                                            strokeWidth: 1,
                                            fill: '#fff',
                                            style: {
                                                visibility: 'hidden',
                                            },
                                        },
                                    },
                                },
                                bottom: {
                                    position: 'bottom',
                                    attrs: {
                                        circle: {
                                            r: 4,
                                            magnet: true,
                                            stroke: '#5F95FF',
                                            strokeWidth: 1,
                                            fill: '#fff',
                                            style: {
                                                visibility: 'hidden',
                                            },
                                        },
                                    },
                                },
                                left: {
                                    position: 'left',
                                    attrs: {
                                        circle: {
                                            r: 4,
                                            magnet: true,
                                            stroke: '#5F95FF',
                                            strokeWidth: 1,
                                            fill: '#fff',
                                            style: {
                                                visibility: 'hidden',
                                            },
                                        },
                                    },
                                },
                            },
                            items: [
                                {
                                    group: 'top',
                                    id: '5a646225-05f9-4e91-8901-0865ded7e710',
                                },
                                {
                                    group: 'right',
                                    id: 'fa42db9f-85ce-4ff1-8ca0-a8d875b78650',
                                },
                                {
                                    group: 'bottom',
                                    id: 'adeb6b94-39f5-4781-abe4-73d50b0d82d9',
                                },
                                {
                                    group: 'left',
                                    id: 'f5256f39-6b49-4572-9062-e45a650b4435',
                                },
                            ],
                        },
                        id: '48498277-1e9f-49ef-8262-8dcb74c6c680',
                        zIndex: 11,
                        data: {
                            type: 'tm.Actor',
                            name: 'Owner phone',
                            description: '',
                            outOfScope: false,
                            reasonOutOfScope: '',
                            hasOpenThreats: false,
                            providesAuthentication: false,
                            threats: [],
                        },
                    },
                    {
                        position: {
                            x: 709.25,
                            y: 350,
                        },
                        size: {
                            width: 100,
                            height: 100,
                        },
                        attrs: {
                            text: {
                                text: 'Ownz mobile',
                            },
                            body: {
                                stroke: '#333333',
                                strokeWidth: 1.5,
                                strokeDasharray: null,
                            },
                        },
                        visible: true,
                        shape: 'process',
                        ports: {
                            groups: {
                                top: {
                                    position: 'top',
                                    attrs: {
                                        circle: {
                                            r: 4,
                                            magnet: true,
                                            stroke: '#5F95FF',
                                            strokeWidth: 1,
                                            fill: '#fff',
                                            style: {
                                                visibility: 'hidden',
                                            },
                                        },
                                    },
                                },
                                right: {
                                    position: 'right',
                                    attrs: {
                                        circle: {
                                            r: 4,
                                            magnet: true,
                                            stroke: '#5F95FF',
                                            strokeWidth: 1,
                                            fill: '#fff',
                                            style: {
                                                visibility: 'hidden',
                                            },
                                        },
                                    },
                                },
                                bottom: {
                                    position: 'bottom',
                                    attrs: {
                                        circle: {
                                            r: 4,
                                            magnet: true,
                                            stroke: '#5F95FF',
                                            strokeWidth: 1,
                                            fill: '#fff',
                                            style: {
                                                visibility: 'hidden',
                                            },
                                        },
                                    },
                                },
                                left: {
                                    position: 'left',
                                    attrs: {
                                        circle: {
                                            r: 4,
                                            magnet: true,
                                            stroke: '#5F95FF',
                                            strokeWidth: 1,
                                            fill: '#fff',
                                            style: {
                                                visibility: 'hidden',
                                            },
                                        },
                                    },
                                },
                            },
                            items: [
                                {
                                    group: 'top',
                                    id: 'f9242827-c2c9-4f9b-8ef3-03d3d00b6935',
                                },
                                {
                                    group: 'right',
                                    id: '12905ec4-2822-4239-b420-49c483514c98',
                                },
                                {
                                    group: 'bottom',
                                    id: 'b8ca633a-3ccc-4548-8cb3-f1bd6fa1ee37',
                                },
                                {
                                    group: 'left',
                                    id: 'd241a17c-a819-4032-8c5c-e6f747d3769b',
                                },
                            ],
                        },
                        id: '558d99e0-e64a-474a-8c91-799a8301a1a6',
                        zIndex: 12,
                        data: {
                            type: 'tm.Process',
                            name: 'Ownz mobile',
                            description: '',
                            outOfScope: false,
                            reasonOutOfScope: '',
                            hasOpenThreats: false,
                            handlesCardPayment: false,
                            handlesGoodsOrServices: false,
                            isWebApplication: false,
                            privilegeLevel: '',
                            threats: [],
                        },
                    },
                    {
                        position: {
                            x: 620,
                            y: 605,
                        },
                        size: {
                            width: 120,
                            height: 120,
                        },
                        attrs: {
                            text: {
                                text: 'API Gateway',
                            },
                            body: {
                                stroke: '#333333',
                                strokeWidth: 1.5,
                                strokeDasharray: null,
                            },
                        },
                        visible: true,
                        shape: 'process',
                        ports: {
                            groups: {
                                top: {
                                    position: 'top',
                                    attrs: {
                                        circle: {
                                            r: 4,
                                            magnet: true,
                                            stroke: '#5F95FF',
                                            strokeWidth: 1,
                                            fill: '#fff',
                                            style: {
                                                visibility: 'hidden',
                                            },
                                        },
                                    },
                                },
                                right: {
                                    position: 'right',
                                    attrs: {
                                        circle: {
                                            r: 4,
                                            magnet: true,
                                            stroke: '#5F95FF',
                                            strokeWidth: 1,
                                            fill: '#fff',
                                            style: {
                                                visibility: 'hidden',
                                            },
                                        },
                                    },
                                },
                                bottom: {
                                    position: 'bottom',
                                    attrs: {
                                        circle: {
                                            r: 4,
                                            magnet: true,
                                            stroke: '#5F95FF',
                                            strokeWidth: 1,
                                            fill: '#fff',
                                            style: {
                                                visibility: 'hidden',
                                            },
                                        },
                                    },
                                },
                                left: {
                                    position: 'left',
                                    attrs: {
                                        circle: {
                                            r: 4,
                                            magnet: true,
                                            stroke: '#5F95FF',
                                            strokeWidth: 1,
                                            fill: '#fff',
                                            style: {
                                                visibility: 'hidden',
                                            },
                                        },
                                    },
                                },
                            },
                            items: [
                                {
                                    group: 'top',
                                    id: 'f9242827-c2c9-4f9b-8ef3-03d3d00b6935',
                                },
                                {
                                    group: 'right',
                                    id: '12905ec4-2822-4239-b420-49c483514c98',
                                },
                                {
                                    group: 'bottom',
                                    id: 'b8ca633a-3ccc-4548-8cb3-f1bd6fa1ee37',
                                },
                                {
                                    group: 'left',
                                    id: 'd241a17c-a819-4032-8c5c-e6f747d3769b',
                                },
                            ],
                        },
                        id: '1902c8e6-ed01-46c5-a6fe-28ce965a5dec',
                        zIndex: 13,
                        data: {
                            type: 'tm.Process',
                            name: 'API Gateway',
                            description: '',
                            outOfScope: false,
                            reasonOutOfScope: '',
                            hasOpenThreats: false,
                            handlesCardPayment: false,
                            handlesGoodsOrServices: false,
                            isWebApplication: false,
                            privilegeLevel: '',
                            threats: [],
                        },
                    },
                    {
                        position: {
                            x: 470,
                            y: 840,
                        },
                        size: {
                            width: 60,
                            height: 60,
                        },
                        attrs: {
                            text: {
                                text: 'Auth',
                            },
                            body: {
                                stroke: '#333333',
                                strokeWidth: 1.5,
                                strokeDasharray: null,
                            },
                        },
                        visible: true,
                        shape: 'process',
                        ports: {
                            groups: {
                                top: {
                                    position: 'top',
                                    attrs: {
                                        circle: {
                                            r: 4,
                                            magnet: true,
                                            stroke: '#5F95FF',
                                            strokeWidth: 1,
                                            fill: '#fff',
                                            style: {
                                                visibility: 'hidden',
                                            },
                                        },
                                    },
                                },
                                right: {
                                    position: 'right',
                                    attrs: {
                                        circle: {
                                            r: 4,
                                            magnet: true,
                                            stroke: '#5F95FF',
                                            strokeWidth: 1,
                                            fill: '#fff',
                                            style: {
                                                visibility: 'hidden',
                                            },
                                        },
                                    },
                                },
                                bottom: {
                                    position: 'bottom',
                                    attrs: {
                                        circle: {
                                            r: 4,
                                            magnet: true,
                                            stroke: '#5F95FF',
                                            strokeWidth: 1,
                                            fill: '#fff',
                                            style: {
                                                visibility: 'hidden',
                                            },
                                        },
                                    },
                                },
                                left: {
                                    position: 'left',
                                    attrs: {
                                        circle: {
                                            r: 4,
                                            magnet: true,
                                            stroke: '#5F95FF',
                                            strokeWidth: 1,
                                            fill: '#fff',
                                            style: {
                                                visibility: 'hidden',
                                            },
                                        },
                                    },
                                },
                            },
                            items: [
                                {
                                    group: 'top',
                                    id: 'f9242827-c2c9-4f9b-8ef3-03d3d00b6935',
                                },
                                {
                                    group: 'right',
                                    id: '12905ec4-2822-4239-b420-49c483514c98',
                                },
                                {
                                    group: 'bottom',
                                    id: 'b8ca633a-3ccc-4548-8cb3-f1bd6fa1ee37',
                                },
                                {
                                    group: 'left',
                                    id: 'd241a17c-a819-4032-8c5c-e6f747d3769b',
                                },
                            ],
                        },
                        id: '71a67ca8-5267-4e67-9c40-5497d3d6072f',
                        zIndex: 14,
                        data: {
                            type: 'tm.Process',
                            name: 'Auth',
                            description: '',
                            outOfScope: false,
                            reasonOutOfScope: '',
                            hasOpenThreats: false,
                            handlesCardPayment: false,
                            handlesGoodsOrServices: false,
                            isWebApplication: false,
                            privilegeLevel: '',
                            threats: [],
                        },
                    },
                    {
                        position: {
                            x: 590,
                            y: 850,
                        },
                        size: {
                            width: 60,
                            height: 60,
                        },
                        attrs: {
                            text: {
                                text: 'API',
                            },
                            body: {
                                stroke: '#333333',
                                strokeWidth: 1.5,
                                strokeDasharray: null,
                            },
                        },
                        visible: true,
                        shape: 'process',
                        ports: {
                            groups: {
                                top: {
                                    position: 'top',
                                    attrs: {
                                        circle: {
                                            r: 4,
                                            magnet: true,
                                            stroke: '#5F95FF',
                                            strokeWidth: 1,
                                            fill: '#fff',
                                            style: {
                                                visibility: 'hidden',
                                            },
                                        },
                                    },
                                },
                                right: {
                                    position: 'right',
                                    attrs: {
                                        circle: {
                                            r: 4,
                                            magnet: true,
                                            stroke: '#5F95FF',
                                            strokeWidth: 1,
                                            fill: '#fff',
                                            style: {
                                                visibility: 'hidden',
                                            },
                                        },
                                    },
                                },
                                bottom: {
                                    position: 'bottom',
                                    attrs: {
                                        circle: {
                                            r: 4,
                                            magnet: true,
                                            stroke: '#5F95FF',
                                            strokeWidth: 1,
                                            fill: '#fff',
                                            style: {
                                                visibility: 'hidden',
                                            },
                                        },
                                    },
                                },
                                left: {
                                    position: 'left',
                                    attrs: {
                                        circle: {
                                            r: 4,
                                            magnet: true,
                                            stroke: '#5F95FF',
                                            strokeWidth: 1,
                                            fill: '#fff',
                                            style: {
                                                visibility: 'hidden',
                                            },
                                        },
                                    },
                                },
                            },
                            items: [
                                {
                                    group: 'top',
                                    id: 'f9242827-c2c9-4f9b-8ef3-03d3d00b6935',
                                },
                                {
                                    group: 'right',
                                    id: '12905ec4-2822-4239-b420-49c483514c98',
                                },
                                {
                                    group: 'bottom',
                                    id: 'b8ca633a-3ccc-4548-8cb3-f1bd6fa1ee37',
                                },
                                {
                                    group: 'left',
                                    id: 'd241a17c-a819-4032-8c5c-e6f747d3769b',
                                },
                            ],
                        },
                        id: 'fa057d26-46cb-4bbd-bb4a-141257787447',
                        zIndex: 15,
                        data: {
                            type: 'tm.Process',
                            name: 'API',
                            description: '',
                            outOfScope: false,
                            reasonOutOfScope: '',
                            hasOpenThreats: false,
                            handlesCardPayment: false,
                            handlesGoodsOrServices: false,
                            isWebApplication: false,
                            privilegeLevel: '',
                            threats: [],
                        },
                    },
                    {
                        position: {
                            x: 709.25,
                            y: 850,
                        },
                        size: {
                            width: 60,
                            height: 60,
                        },
                        attrs: {
                            text: {
                                text: 'API AR',
                            },
                            body: {
                                stroke: '#333333',
                                strokeWidth: 1.5,
                                strokeDasharray: null,
                            },
                        },
                        visible: true,
                        shape: 'process',
                        ports: {
                            groups: {
                                top: {
                                    position: 'top',
                                    attrs: {
                                        circle: {
                                            r: 4,
                                            magnet: true,
                                            stroke: '#5F95FF',
                                            strokeWidth: 1,
                                            fill: '#fff',
                                            style: {
                                                visibility: 'hidden',
                                            },
                                        },
                                    },
                                },
                                right: {
                                    position: 'right',
                                    attrs: {
                                        circle: {
                                            r: 4,
                                            magnet: true,
                                            stroke: '#5F95FF',
                                            strokeWidth: 1,
                                            fill: '#fff',
                                            style: {
                                                visibility: 'hidden',
                                            },
                                        },
                                    },
                                },
                                bottom: {
                                    position: 'bottom',
                                    attrs: {
                                        circle: {
                                            r: 4,
                                            magnet: true,
                                            stroke: '#5F95FF',
                                            strokeWidth: 1,
                                            fill: '#fff',
                                            style: {
                                                visibility: 'hidden',
                                            },
                                        },
                                    },
                                },
                                left: {
                                    position: 'left',
                                    attrs: {
                                        circle: {
                                            r: 4,
                                            magnet: true,
                                            stroke: '#5F95FF',
                                            strokeWidth: 1,
                                            fill: '#fff',
                                            style: {
                                                visibility: 'hidden',
                                            },
                                        },
                                    },
                                },
                            },
                            items: [
                                {
                                    group: 'top',
                                    id: 'f9242827-c2c9-4f9b-8ef3-03d3d00b6935',
                                },
                                {
                                    group: 'right',
                                    id: '12905ec4-2822-4239-b420-49c483514c98',
                                },
                                {
                                    group: 'bottom',
                                    id: 'b8ca633a-3ccc-4548-8cb3-f1bd6fa1ee37',
                                },
                                {
                                    group: 'left',
                                    id: 'd241a17c-a819-4032-8c5c-e6f747d3769b',
                                },
                            ],
                        },
                        id: 'ea829ca8-aae2-45fd-be06-a311b79b296b',
                        zIndex: 16,
                        data: {
                            type: 'tm.Process',
                            name: 'API AR',
                            description: '',
                            outOfScope: false,
                            reasonOutOfScope: '',
                            hasOpenThreats: false,
                            handlesCardPayment: false,
                            handlesGoodsOrServices: false,
                            isWebApplication: false,
                            privilegeLevel: '',
                            threats: [],
                        },
                    },
                    {
                        position: {
                            x: 850,
                            y: 830,
                        },
                        size: {
                            width: 60,
                            height: 60,
                        },
                        attrs: {
                            text: {
                                text: 'API\nAM/FM',
                            },
                            body: {
                                stroke: '#333333',
                                strokeWidth: 1.5,
                                strokeDasharray: null,
                            },
                        },
                        visible: true,
                        shape: 'process',
                        ports: {
                            groups: {
                                top: {
                                    position: 'top',
                                    attrs: {
                                        circle: {
                                            r: 4,
                                            magnet: true,
                                            stroke: '#5F95FF',
                                            strokeWidth: 1,
                                            fill: '#fff',
                                            style: {
                                                visibility: 'hidden',
                                            },
                                        },
                                    },
                                },
                                right: {
                                    position: 'right',
                                    attrs: {
                                        circle: {
                                            r: 4,
                                            magnet: true,
                                            stroke: '#5F95FF',
                                            strokeWidth: 1,
                                            fill: '#fff',
                                            style: {
                                                visibility: 'hidden',
                                            },
                                        },
                                    },
                                },
                                bottom: {
                                    position: 'bottom',
                                    attrs: {
                                        circle: {
                                            r: 4,
                                            magnet: true,
                                            stroke: '#5F95FF',
                                            strokeWidth: 1,
                                            fill: '#fff',
                                            style: {
                                                visibility: 'hidden',
                                            },
                                        },
                                    },
                                },
                                left: {
                                    position: 'left',
                                    attrs: {
                                        circle: {
                                            r: 4,
                                            magnet: true,
                                            stroke: '#5F95FF',
                                            strokeWidth: 1,
                                            fill: '#fff',
                                            style: {
                                                visibility: 'hidden',
                                            },
                                        },
                                    },
                                },
                            },
                            items: [
                                {
                                    group: 'top',
                                    id: 'f9242827-c2c9-4f9b-8ef3-03d3d00b6935',
                                },
                                {
                                    group: 'right',
                                    id: '12905ec4-2822-4239-b420-49c483514c98',
                                },
                                {
                                    group: 'bottom',
                                    id: 'b8ca633a-3ccc-4548-8cb3-f1bd6fa1ee37',
                                },
                                {
                                    group: 'left',
                                    id: 'd241a17c-a819-4032-8c5c-e6f747d3769b',
                                },
                            ],
                        },
                        id: '6e0abf37-5f5b-43ea-a567-07d2580e0c03',
                        zIndex: 17,
                        data: {
                            type: 'tm.Process',
                            name: 'API\nAM/FM',
                            description: '',
                            outOfScope: false,
                            reasonOutOfScope: '',
                            hasOpenThreats: false,
                            handlesCardPayment: false,
                            handlesGoodsOrServices: false,
                            isWebApplication: false,
                            privilegeLevel: '',
                            threats: [],
                        },
                    },
                    {
                        position: {
                            x: 1080,
                            y: 725,
                        },
                        size: {
                            width: 60,
                            height: 60,
                        },
                        attrs: {
                            text: {
                                text: 'API AI',
                            },
                            body: {
                                stroke: '#333333',
                                strokeWidth: 1.5,
                                strokeDasharray: null,
                            },
                        },
                        visible: true,
                        shape: 'process',
                        ports: {
                            groups: {
                                top: {
                                    position: 'top',
                                    attrs: {
                                        circle: {
                                            r: 4,
                                            magnet: true,
                                            stroke: '#5F95FF',
                                            strokeWidth: 1,
                                            fill: '#fff',
                                            style: {
                                                visibility: 'hidden',
                                            },
                                        },
                                    },
                                },
                                right: {
                                    position: 'right',
                                    attrs: {
                                        circle: {
                                            r: 4,
                                            magnet: true,
                                            stroke: '#5F95FF',
                                            strokeWidth: 1,
                                            fill: '#fff',
                                            style: {
                                                visibility: 'hidden',
                                            },
                                        },
                                    },
                                },
                                bottom: {
                                    position: 'bottom',
                                    attrs: {
                                        circle: {
                                            r: 4,
                                            magnet: true,
                                            stroke: '#5F95FF',
                                            strokeWidth: 1,
                                            fill: '#fff',
                                            style: {
                                                visibility: 'hidden',
                                            },
                                        },
                                    },
                                },
                                left: {
                                    position: 'left',
                                    attrs: {
                                        circle: {
                                            r: 4,
                                            magnet: true,
                                            stroke: '#5F95FF',
                                            strokeWidth: 1,
                                            fill: '#fff',
                                            style: {
                                                visibility: 'hidden',
                                            },
                                        },
                                    },
                                },
                            },
                            items: [
                                {
                                    group: 'top',
                                    id: 'f9242827-c2c9-4f9b-8ef3-03d3d00b6935',
                                },
                                {
                                    group: 'right',
                                    id: '12905ec4-2822-4239-b420-49c483514c98',
                                },
                                {
                                    group: 'bottom',
                                    id: 'b8ca633a-3ccc-4548-8cb3-f1bd6fa1ee37',
                                },
                                {
                                    group: 'left',
                                    id: 'd241a17c-a819-4032-8c5c-e6f747d3769b',
                                },
                            ],
                        },
                        id: 'e38c302a-1195-47e9-b3ba-d81219187dd2',
                        zIndex: 18,
                        data: {
                            type: 'tm.Process',
                            name: 'API AI',
                            description: '',
                            outOfScope: false,
                            reasonOutOfScope: '',
                            hasOpenThreats: false,
                            handlesCardPayment: false,
                            handlesGoodsOrServices: false,
                            isWebApplication: false,
                            privilegeLevel: '',
                            threats: [],
                        },
                    },
                    {
                        position: {
                            x: 1054,
                            y: 937,
                        },
                        size: {
                            width: 112.5,
                            height: 60,
                        },
                        attrs: {
                            text: {
                                text: 'Whatson',
                            },
                            body: {
                                stroke: '#333333',
                                strokeWidth: 1.5,
                                strokeDasharray: null,
                            },
                        },
                        visible: true,
                        shape: 'actor',
                        ports: {
                            groups: {
                                top: {
                                    position: 'top',
                                    attrs: {
                                        circle: {
                                            r: 4,
                                            magnet: true,
                                            stroke: '#5F95FF',
                                            strokeWidth: 1,
                                            fill: '#fff',
                                            style: {
                                                visibility: 'hidden',
                                            },
                                        },
                                    },
                                },
                                right: {
                                    position: 'right',
                                    attrs: {
                                        circle: {
                                            r: 4,
                                            magnet: true,
                                            stroke: '#5F95FF',
                                            strokeWidth: 1,
                                            fill: '#fff',
                                            style: {
                                                visibility: 'hidden',
                                            },
                                        },
                                    },
                                },
                                bottom: {
                                    position: 'bottom',
                                    attrs: {
                                        circle: {
                                            r: 4,
                                            magnet: true,
                                            stroke: '#5F95FF',
                                            strokeWidth: 1,
                                            fill: '#fff',
                                            style: {
                                                visibility: 'hidden',
                                            },
                                        },
                                    },
                                },
                                left: {
                                    position: 'left',
                                    attrs: {
                                        circle: {
                                            r: 4,
                                            magnet: true,
                                            stroke: '#5F95FF',
                                            strokeWidth: 1,
                                            fill: '#fff',
                                            style: {
                                                visibility: 'hidden',
                                            },
                                        },
                                    },
                                },
                            },
                            items: [
                                {
                                    group: 'top',
                                    id: '5a646225-05f9-4e91-8901-0865ded7e710',
                                },
                                {
                                    group: 'right',
                                    id: 'fa42db9f-85ce-4ff1-8ca0-a8d875b78650',
                                },
                                {
                                    group: 'bottom',
                                    id: 'adeb6b94-39f5-4781-abe4-73d50b0d82d9',
                                },
                                {
                                    group: 'left',
                                    id: 'f5256f39-6b49-4572-9062-e45a650b4435',
                                },
                            ],
                        },
                        id: '848b0077-0e7e-4e1d-8f0c-47b00cc431fd',
                        zIndex: 19,
                        data: {
                            type: 'tm.Actor',
                            name: 'Whatson',
                            description: '',
                            outOfScope: false,
                            reasonOutOfScope: '',
                            hasOpenThreats: false,
                            providesAuthentication: false,
                            threats: [],
                        },
                    },
                    {
                        position: {
                            x: 470,
                            y: 968,
                        },
                        size: {
                            width: 90,
                            height: 50,
                        },
                        attrs: {
                            text: {
                                text: 'Cars DB',
                            },
                            topLine: {
                                strokeWidth: 1.5,
                                strokeDasharray: null,
                            },
                            bottomLine: {
                                strokeWidth: 1.5,
                                strokeDasharray: null,
                            },
                        },
                        visible: true,
                        shape: 'store',
                        ports: {
                            groups: {
                                top: {
                                    position: 'top',
                                    attrs: {
                                        circle: {
                                            r: 4,
                                            magnet: true,
                                            stroke: '#5F95FF',
                                            strokeWidth: 1,
                                            fill: '#fff',
                                            style: {
                                                visibility: 'hidden',
                                            },
                                        },
                                    },
                                },
                                right: {
                                    position: 'right',
                                    attrs: {
                                        circle: {
                                            r: 4,
                                            magnet: true,
                                            stroke: '#5F95FF',
                                            strokeWidth: 1,
                                            fill: '#fff',
                                            style: {
                                                visibility: 'hidden',
                                            },
                                        },
                                    },
                                },
                                bottom: {
                                    position: 'bottom',
                                    attrs: {
                                        circle: {
                                            r: 4,
                                            magnet: true,
                                            stroke: '#5F95FF',
                                            strokeWidth: 1,
                                            fill: '#fff',
                                            style: {
                                                visibility: 'hidden',
                                            },
                                        },
                                    },
                                },
                                left: {
                                    position: 'left',
                                    attrs: {
                                        circle: {
                                            r: 4,
                                            magnet: true,
                                            stroke: '#5F95FF',
                                            strokeWidth: 1,
                                            fill: '#fff',
                                            style: {
                                                visibility: 'hidden',
                                            },
                                        },
                                    },
                                },
                            },
                            items: [
                                {
                                    group: 'top',
                                    id: '595e5c53-e6f3-4202-8ff1-7578e5869ad2',
                                },
                                {
                                    group: 'right',
                                    id: '4b4ec902-595e-4ee9-b2c0-7aa454ff0685',
                                },
                                {
                                    group: 'bottom',
                                    id: '7d472b47-41fb-4ca7-8dd7-05e81d20c59a',
                                },
                                {
                                    group: 'left',
                                    id: 'fb2429b6-5727-47aa-a520-0b88452ecf5e',
                                },
                            ],
                        },
                        id: '392007cf-8756-43f6-b1d1-d73a887ad054',
                        zIndex: 20,
                        data: {
                            type: 'tm.Store',
                            name: 'Cars DB',
                            description: '',
                            outOfScope: false,
                            reasonOutOfScope: '',
                            hasOpenThreats: false,
                            isALog: false,
                            isEncrypted: false,
                            isSigned: false,
                            storesCredentials: false,
                            storesInventory: false,
                            threats: [],
                        },
                    },
                    {
                        position: {
                            x: 790,
                            y: 947,
                        },
                        size: {
                            width: 120,
                            height: 60,
                        },
                        attrs: {
                            text: {
                                text: 'Flatfile\nradio stations',
                            },
                            topLine: {
                                strokeWidth: 1.5,
                                strokeDasharray: null,
                            },
                            bottomLine: {
                                strokeWidth: 1.5,
                                strokeDasharray: null,
                            },
                        },
                        visible: true,
                        shape: 'store',
                        ports: {
                            groups: {
                                top: {
                                    position: 'top',
                                    attrs: {
                                        circle: {
                                            r: 4,
                                            magnet: true,
                                            stroke: '#5F95FF',
                                            strokeWidth: 1,
                                            fill: '#fff',
                                            style: {
                                                visibility: 'hidden',
                                            },
                                        },
                                    },
                                },
                                right: {
                                    position: 'right',
                                    attrs: {
                                        circle: {
                                            r: 4,
                                            magnet: true,
                                            stroke: '#5F95FF',
                                            strokeWidth: 1,
                                            fill: '#fff',
                                            style: {
                                                visibility: 'hidden',
                                            },
                                        },
                                    },
                                },
                                bottom: {
                                    position: 'bottom',
                                    attrs: {
                                        circle: {
                                            r: 4,
                                            magnet: true,
                                            stroke: '#5F95FF',
                                            strokeWidth: 1,
                                            fill: '#fff',
                                            style: {
                                                visibility: 'hidden',
                                            },
                                        },
                                    },
                                },
                                left: {
                                    position: 'left',
                                    attrs: {
                                        circle: {
                                            r: 4,
                                            magnet: true,
                                            stroke: '#5F95FF',
                                            strokeWidth: 1,
                                            fill: '#fff',
                                            style: {
                                                visibility: 'hidden',
                                            },
                                        },
                                    },
                                },
                            },
                            items: [
                                {
                                    group: 'top',
                                    id: '595e5c53-e6f3-4202-8ff1-7578e5869ad2',
                                },
                                {
                                    group: 'right',
                                    id: '4b4ec902-595e-4ee9-b2c0-7aa454ff0685',
                                },
                                {
                                    group: 'bottom',
                                    id: '7d472b47-41fb-4ca7-8dd7-05e81d20c59a',
                                },
                                {
                                    group: 'left',
                                    id: 'fb2429b6-5727-47aa-a520-0b88452ecf5e',
                                },
                            ],
                        },
                        id: '00f81686-5040-4803-88f9-dd9cd6599067',
                        zIndex: 21,
                        data: {
                            type: 'tm.Store',
                            name: 'Flatfile\nradio stations',
                            description: '',
                            outOfScope: false,
                            reasonOutOfScope: '',
                            hasOpenThreats: false,
                            isALog: false,
                            isEncrypted: false,
                            isSigned: false,
                            storesCredentials: false,
                            storesInventory: false,
                            threats: [],
                        },
                    },
                ],
            },
        ],
        diagramTop: 0,
        reviewer: 'A security architect',
        threatTop: 0,
    },
};
