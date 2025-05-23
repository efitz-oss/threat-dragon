export const schema = {
    $id: 'https://owasp.org/www-project-threat-dragon/assets/schemas/owasp.threat-dragon.schema.V1.json',
    title: 'Threat Dragon model schema',
    description: 'The threat models used by OWASP Threat Dragon',
    type: 'object',
    properties: {
        version: {
            description: 'Threat Dragon version used in the model',
            type: 'string',
            maxLength: 5
        },
        summary: {
            description: 'Threat model project meta-data',
            type: 'object',
            properties: {
                description: {
                    description: 'Description of the threat model used for report outputs',
                    type: 'string'
                },
                id: {
                    description: 'A unique identifier for this main threat model object',
                    type: 'integer',
                    minimum: 0
                },
                owner: {
                    description: 'The original creator or overall owner of the model',
                    type: 'string'
                },
                title: {
                    description: 'Threat model title',
                    type: 'string'
                }
            },
            required: ['title']
        },
        detail: {
            description: 'Threat model definition',
            type: 'object',
            properties: {
                contributors: {
                    description: 'An array of contributors to the threat model project',
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            name: {
                                description: 'The name of the contributor',
                                type: 'string'
                            }
                        }
                    }
                },
                diagrams: {
                    description: 'An array of single or multiple threat data-flow diagrams',
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            diagramType: {
                                description: 'The methodology used by the data-flow diagram',
                                type: 'string',
                                minLength: 3
                            },
                            id: {
                                description: 'The sequence number of the diagram',
                                type: 'integer',
                                minimum: 0
                            },
                            size: {
                                description: 'The size of the diagram drawing canvas',
                                type: 'object',
                                properties: {
                                    height: {
                                        description: 'The height of the diagram drawing canvas',
                                        type: 'integer',
                                        minimum: 50
                                    },
                                    width: {
                                        description: 'The width of the diagram drawing canvas',
                                        type: 'integer',
                                        minimum: 50
                                    }
                                },
                                required: ['height', 'width']
                            },
                            thumbnail: {
                                description: 'The path to the thumbnail image for the diagram',
                                type: 'string'
                            },
                            title: {
                                description: 'The title of the data-flow diagram',
                                type: 'string'
                            },
                            version: {
                                description: 'Threat Dragon version used in the diagram',
                                type: 'string',
                                maxLength: 5
                            },
                            diagramJson: {
                                description: 'The data-flow diagram components',
                                type: 'object',
                                properties: {
                                    cells: {
                                        description: 'The individual diagram components',
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                attrs: {
                                                    description: 'The component display attributes',
                                                    type: 'object',
                                                    properties: {
                                                        '.element-shape': {
                                                            description:
                                                                'The component shape attributes',
                                                            type: 'object',
                                                            properties: {
                                                                class: {
                                                                    description:
                                                                        'The component shape display attributes',
                                                                    type: 'string'
                                                                }
                                                            }
                                                        },
                                                        text: {
                                                            description: 'The component text',
                                                            type: 'object',
                                                            properties: {
                                                                text: {
                                                                    description:
                                                                        'The component text contents',
                                                                    type: 'string'
                                                                }
                                                            },
                                                            required: ['text']
                                                        },
                                                        '.element-text': {
                                                            description:
                                                                'The component text attributes',
                                                            type: 'object',
                                                            properties: {
                                                                class: {
                                                                    description:
                                                                        'The component text display attributes',
                                                                    type: 'string'
                                                                }
                                                            }
                                                        }
                                                    }
                                                },
                                                angle: {
                                                    description: 'The component rotation angle',
                                                    type: 'integer'
                                                },
                                                description: {
                                                    description: 'The component description',
                                                    type: 'string'
                                                },
                                                handlesCardPayment: {
                                                    description:
                                                        'The component flag set if the process handles credit card payment',
                                                    type: 'boolean'
                                                },
                                                handlesGoodsOrServices: {
                                                    description:
                                                        'The component flag set if the process is part of a retail site',
                                                    type: 'boolean'
                                                },
                                                hasOpenThreats: {
                                                    description:
                                                        'The component flag set if there are open threats',
                                                    type: 'boolean'
                                                },
                                                id: {
                                                    description:
                                                        'The component unique identifier (UUID)',
                                                    type: 'string',
                                                    minLength: 36
                                                },
                                                isALog: {
                                                    description:
                                                        'The component flag set if the store contains logs',
                                                    type: 'boolean'
                                                },
                                                isWebApplication: {
                                                    description:
                                                        'The component flag set if the process is a web application',
                                                    type: 'boolean'
                                                },
                                                isEncrypted: {
                                                    description:
                                                        'The component flag set if the data flow or store is encrypted',
                                                    type: 'boolean'
                                                },
                                                isSigned: {
                                                    description:
                                                        'The component flag set if the data store uses signatures',
                                                    type: 'boolean'
                                                },
                                                isTrustBoundary: {
                                                    description:
                                                        'The flag set if the component is a trust boundary curve or trust boundary box',
                                                    type: 'boolean'
                                                },
                                                labels: {
                                                    description:
                                                        'The floating labels used for boundary or data-flow',
                                                    type: 'array',
                                                    items: {
                                                        type: 'object',
                                                        properties: {
                                                            position: {
                                                                description: 'The label position',
                                                                type: 'number'
                                                            },
                                                            attrs: {
                                                                description:
                                                                    'The label text attributes',
                                                                type: 'object',
                                                                properties: {
                                                                    text: {
                                                                        description:
                                                                            'The text attributes',
                                                                        type: 'object',
                                                                        properties: {
                                                                            'font-size': {
                                                                                description:
                                                                                    'The text size',
                                                                                type: 'string'
                                                                            },
                                                                            'font-weight': {
                                                                                description:
                                                                                    'The text weight',
                                                                                type: 'string'
                                                                            },
                                                                            text: {
                                                                                description:
                                                                                    'The text content',
                                                                                type: 'string'
                                                                            }
                                                                        },
                                                                        required: [
                                                                            'font-size',
                                                                            'font-weight',
                                                                            'text'
                                                                        ]
                                                                    }
                                                                },
                                                                required: ['text']
                                                            }
                                                        },
                                                        required: ['attrs', 'position']
                                                    }
                                                },
                                                outOfScope: {
                                                    description:
                                                        'The component flag set if it is not in scope',
                                                    type: 'boolean'
                                                },
                                                position: {
                                                    description: 'The component position',
                                                    type: 'object',
                                                    properties: {
                                                        x: {
                                                            description:
                                                                'The component horizontal position',
                                                            type: 'number'
                                                        },
                                                        y: {
                                                            description:
                                                                'The component vertical position',
                                                            type: 'number'
                                                        }
                                                    },
                                                    required: ['x', 'y']
                                                },
                                                privilegeLevel: {
                                                    description:
                                                        "The component's level of privilege/permissions",
                                                    type: 'string'
                                                },
                                                reasonOutOfScope: {
                                                    description:
                                                        'The component description if out of scope',
                                                    type: 'string'
                                                },
                                                size: {
                                                    description: 'The component size',
                                                    type: 'object',
                                                    properties: {
                                                        height: {
                                                            description: 'The component height',
                                                            type: 'number',
                                                            minimum: 10
                                                        },
                                                        width: {
                                                            description: 'The component width',
                                                            type: 'number',
                                                            minimum: 10
                                                        }
                                                    },
                                                    required: ['height', 'width']
                                                },
                                                smooth: {
                                                    description:
                                                        'The component curve type, for data flows and boundaries',
                                                    type: 'boolean'
                                                },
                                                source: {
                                                    description: 'The component curve source',
                                                    type: 'object',
                                                    properties: {
                                                        id: {
                                                            description:
                                                                'The data-flow source component',
                                                            type: 'string'
                                                        },
                                                        x: {
                                                            description:
                                                                'The boundary horizontal curve source',
                                                            type: 'integer'
                                                        },
                                                        y: {
                                                            description:
                                                                'The boundary vertical curve source',
                                                            type: 'integer'
                                                        }
                                                    }
                                                },
                                                storesCredentials: {
                                                    description:
                                                        'The component flag set if store contains credentials/PII',
                                                    type: 'boolean'
                                                },
                                                storesInventory: {
                                                    description:
                                                        'The component flag set if store is part of a retail web application',
                                                    type: 'boolean'
                                                },
                                                target: {
                                                    description: 'The component curve target',
                                                    type: 'object',
                                                    properties: {
                                                        id: {
                                                            description:
                                                                'The data-flow target component',
                                                            type: 'string'
                                                        },
                                                        x: {
                                                            description:
                                                                'The boundary horizontal curve target',
                                                            type: 'integer'
                                                        },
                                                        y: {
                                                            description:
                                                                'The boundary vertical curve target',
                                                            type: 'integer'
                                                        }
                                                    }
                                                },
                                                threats: {
                                                    description:
                                                        'The threats associated with the component',
                                                    type: 'array',
                                                    items: {
                                                        type: 'object',
                                                        properties: {
                                                            description: {
                                                                description:
                                                                    'The threat description',
                                                                type: 'string'
                                                            },
                                                            mitigation: {
                                                                description:
                                                                    'The threat mitigation',
                                                                type: 'string'
                                                            },
                                                            modelType: {
                                                                description:
                                                                    'The threat methodology type',
                                                                type: 'string'
                                                            },
                                                            number: {
                                                                description:
                                                                    'The unique number for the threat',
                                                                type: 'integer',
                                                                minimum: 0
                                                            },
                                                            score: {
                                                                description:
                                                                    'The custom score/risk for the threat',
                                                                type: 'string'
                                                            },
                                                            severity: {
                                                                description:
                                                                    'The threat severity as High, Medium or Low',
                                                                type: 'string'
                                                            },
                                                            status: {
                                                                description:
                                                                    'The threat status as NA, Open or Mitigated',
                                                                type: 'string'
                                                            },
                                                            threatId: {
                                                                description:
                                                                    'The threat ID as a UUID',
                                                                type: 'string',
                                                                minLength: 36
                                                            },
                                                            title: {
                                                                description: 'The threat title',
                                                                type: 'string'
                                                            },
                                                            type: {
                                                                description:
                                                                    'The threat type, selection according to modelType',
                                                                type: 'string'
                                                            }
                                                        },
                                                        required: [
                                                            'description',
                                                            'mitigation',
                                                            'severity',
                                                            'status',
                                                            'title',
                                                            'type'
                                                        ]
                                                    }
                                                },
                                                type: {
                                                    description: 'The component type',
                                                    type: 'string'
                                                },
                                                vertices: {
                                                    description:
                                                        'The boundary or data-flow curve points',
                                                    type: 'array',
                                                    items: {
                                                        type: 'object',
                                                        properties: {
                                                            x: {
                                                                description:
                                                                    'The horizontal value of the curve point',
                                                                type: 'integer'
                                                            },
                                                            y: {
                                                                description:
                                                                    'The vertical value of the curve point',
                                                                type: 'integer'
                                                            }
                                                        },
                                                        required: ['x', 'y']
                                                    }
                                                },
                                                z: {
                                                    description: 'The component Z-plane',
                                                    type: 'integer'
                                                }
                                            },
                                            required: ['attrs', 'id', 'size', 'type', 'z']
                                        }
                                    }
                                }
                            }
                        },
                        required: ['diagramType', 'id', 'size', 'thumbnail', 'title', 'diagramJson']
                    }
                },
                diagramTop: {
                    description: 'The highest diagram number in the threat model',
                    type: 'integer',
                    minimum: 0
                },
                reviewer: {
                    description: 'The reviewer of the overall threat model',
                    type: 'string'
                },
                threatTop: {
                    description: 'The highest threat number in the threat model',
                    type: 'integer',
                    minimum: 0
                }
            },
            required: ['contributors', 'diagrams']
        }
    },
    required: ['summary', 'detail']
};
