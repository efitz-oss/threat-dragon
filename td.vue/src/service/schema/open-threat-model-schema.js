export const schema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: 'https://iriusrisk.com/schema/otm-0.2.0.schema.json',
    title: 'Open Threat Model Specification',
    $comment:
        'Open Threat Model JSON schema is published under the terms of the Apache License 2.0.',
    type: 'object',
    required: ['otmVersion', 'project'],
    properties: {
        otmVersion: {
            type: 'string'
        },
        project: {
            type: 'object',
            required: ['name', 'id'],
            properties: {
                name: { type: 'string' },
                id: { type: 'string' },
                description: { type: ['string', 'null'] },
                owner: { type: ['string', 'null'] },
                ownerContact: { type: ['string', 'null'] },
                tags: {
                    type: ['array', 'null'],
                    items: {
                        type: 'string'
                    }
                },
                attributes: { type: ['object', 'null'] }
            }
        },
        representations: {
            type: ['array', 'null'],
            items: {
                type: 'object',
                required: ['name', 'id', 'type'],
                properties: {
                    name: { type: 'string' },
                    id: { type: 'string' },
                    type: { type: 'string' },
                    description: { type: ['string', 'null'] },
                    size: { $ref: '#/definitions/size' },
                    repository: {
                        type: ['object', 'null'],
                        required: ['url'],
                        properties: {
                            url: { type: ['string', 'null'] }
                        }
                    },
                    attributes: { type: ['object', 'null'] }
                }
            }
        },
        assets: {
            type: ['array', 'null'],
            items: {
                type: 'object',
                required: ['name', 'id', 'risk'],
                properties: {
                    name: { type: 'string' },
                    id: { type: 'string' },
                    description: { type: ['string', 'null'] },
                    risk: {
                        type: 'object',
                        required: ['confidentiality', 'integrity', 'availability'],
                        properties: {
                            confidentiality: { type: 'number' },
                            integrity: { type: 'number' },
                            availability: { type: 'number' },
                            comment: { type: ['string', 'null'] }
                        }
                    },
                    attributes: { type: ['object', 'null'] }
                }
            }
        },
        trustZones: {
            type: 'array',
            items: {
                type: 'object',
                required: ['id', 'name', 'risk'],
                properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    type: { type: 'string' },
                    description: { type: ['string', 'null'] },
                    risk: {
                        type: 'object',
                        required: ['trustRating'],
                        properties: {
                            trustRating: { type: 'number' }
                        }
                    },
                    parent: { $ref: '#/definitions/parent' },
                    representations: {
                        type: ['array', 'null'],
                        items: { $ref: '#/definitions/representationElement' }
                    },
                    attributes: { type: ['object', 'null'] }
                }
            }
        },
        components: {
            type: ['array', 'null'],
            items: {
                type: 'object',
                required: ['id', 'name', 'type', 'parent'],
                properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    type: { type: 'string' },
                    description: { type: ['string', 'null'] },
                    parent: { $ref: '#/definitions/parent' },
                    representations: {
                        type: ['array', 'null'],
                        items: { $ref: '#/definitions/representationElement' }
                    },
                    assets: { $ref: '#/definitions/assetInstance' },
                    threats: {
                        type: ['array', 'null'],
                        items: { $ref: '#/definitions/threat' }
                    },
                    tags: {
                        type: ['array', 'null'],
                        items: {
                            type: ['string', 'null']
                        }
                    },
                    attributes: { type: ['object', 'null'] }
                }
            }
        },
        dataflows: {
            type: 'array',
            items: {
                type: 'object',
                required: ['id', 'name', 'source', 'destination'],
                properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    description: { type: ['string', 'null'] },
                    bidirectional: { type: ['boolean', 'null'] },
                    source: { type: 'string' },
                    destination: { type: 'string' },
                    assets: {
                        type: ['array', 'null'],
                        items: { type: ['string', 'null'] }
                    },
                    threats: {
                        type: ['array', 'null'],
                        items: { $ref: '#/definitions/threat' }
                    },
                    tags: {
                        type: ['array', 'null'],
                        items: {
                            type: ['string', 'null']
                        }
                    },
                    attributes: { type: ['object', 'null'] }
                }
            }
        },
        threats: {
            type: ['array', 'null'],
            items: {
                type: 'object',
                required: ['id', 'name', 'risk'],
                properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    description: { type: ['string', 'null'] },
                    categories: {
                        type: ['array', 'null'],
                        items: { type: ['string', 'null'] }
                    },
                    cwes: {
                        type: ['array', 'null'],
                        items: { type: ['string', 'null'] }
                    },
                    risk: {
                        type: 'object',
                        required: ['likelihood', 'impact'],
                        properties: {
                            likelihood: { type: ['number', 'null'] },
                            likelihoodComment: { type: ['string', 'null'] },
                            impact: { type: 'number' },
                            impactComment: { type: 'string' }
                        }
                    },
                    tags: {
                        type: ['array', 'null'],
                        items: {
                            type: ['string', 'null']
                        }
                    },
                    attributes: { type: ['object', 'null'] }
                }
            }
        },
        mitigations: {
            type: ['array', 'null'],
            items: {
                type: 'object',
                required: ['id', 'name', 'riskReduction'],
                properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    description: { type: ['string', 'null'] },
                    riskReduction: { type: 'number' },
                    attributes: { type: ['object', 'null'] }
                }
            }
        }
    },
    definitions: {
        size: {
            type: ['object', 'null'],
            required: ['width', 'height'],
            properties: {
                width: { type: 'number' },
                height: { type: 'number' }
            }
        },
        parent: {
            type: 'object',
            oneOf: [{ required: ['trustZone'] }, { required: ['component'] }],
            properties: {
                trustZone: { type: 'string' },
                component: { type: 'string' }
            }
        },
        position: {
            type: ['object', 'null'],
            required: ['x', 'y'],
            properties: {
                x: { type: 'number' },
                y: { type: 'number' }
            }
        },
        representationElement: {
            type: 'object',
            required: ['representation', 'id'],
            properties: {
                representation: { type: 'string' },
                name: { type: ['string', 'null'] },
                id: { type: 'string' },
                position: { $ref: '#/definitions/position' },
                size: { $ref: '#/definitions/size' },
                file: { type: ['string', 'null'] },
                line: { type: ['number', 'null'] },
                codeSnippet: { type: ['string', 'null'] },
                attributes: { type: ['object', 'null'] }
            }
        },
        threat: {
            type: 'object',
            required: ['threat', 'state'],
            properties: {
                threat: { type: 'string' },
                state: { type: 'string' },
                mitigations: {
                    type: 'array',
                    items: {
                        type: ['object', 'null'],
                        required: ['mitigation', 'state'],
                        properties: {
                            mitigation: { type: ['string', 'null'] },
                            state: { type: ['string', 'null'] }
                        }
                    }
                }
            }
        },
        assetInstance: {
            type: ['object', 'null'],
            properties: {
                processed: {
                    type: ['array', 'null'],
                    items: {
                        type: ['string', 'null']
                    }
                },
                stored: {
                    type: ['array', 'null'],
                    items: {
                        type: ['string', 'null']
                    }
                }
            }
        }
    }
};
