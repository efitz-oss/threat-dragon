<template>
    <b-card class="threat-card h-100">
        <b-card-text>
            <b-row>
                <b-col>
                    <a
                        v-if="!!number"
                        href="javascript:void(0)"
                        class="threat-title text-truncate d-block"
                        @click="threatSelected()"
                    >#{{ number }} {{ title || 'Unknown Threat' }}</a
                    >
                    <a 
                        v-else 
                        href="javascript:void(0)" 
                        class="threat-title text-truncate d-block"
                        @click="threatSelected()"
                    >{{
                        title || 'Unknown Threat'
                    }}</a>
                </b-col>
            </b-row>
            <b-row class="mt-2">
                <b-col>
                    <span class="threat-type text-truncate d-block">{{ type }}</span>
                </b-col>
            </b-row>
            <b-row class="mt-2">
                <b-col cols="6">
                    <font-awesome-icon
                        v-if="status !== 'Open'"
                        icon="check"
                        class="threat-icon green-icon"
                        :title="status"
                    />
                    <font-awesome-icon
                        v-if="status === 'Open'"
                        icon="exclamation-triangle"
                        class="threat-icon red-icon"
                        :title="status"
                    />
                    <font-awesome-icon
                        v-if="severity === 'High'"
                        icon="circle"
                        class="threat-icon red-icon"
                        :title="severity"
                    />
                    <font-awesome-icon
                        v-if="severity === 'Medium'"
                        icon="circle"
                        class="threat-icon yellow-icon"
                        :title="severity"
                    />
                    <font-awesome-icon
                        v-if="severity === 'Low'"
                        icon="circle"
                        class="threat-icon green-icon"
                        :title="severity"
                    />
                </b-col>
                <b-col cols="6" class="text-right">
                    <b-badge v-if="!!modelType">
                        {{ modelType }}
                    </b-badge>
                </b-col>
            </b-row>
        </b-card-text>
    </b-card>
</template>

<script>
export default {
    name: 'TdGraphThreats',
    props: {
        id: { 
            type: String,
            default: ''
        },
        status: { 
            type: String,
            default: ''
        },
        severity: { 
            type: String,
            default: ''
        },
        description: { 
            type: String,
            default: ''
        },
        title: { 
            type: String,
            default: ''
        },
        type: { 
            type: String,
            default: ''
        },
        mitigation: { 
            type: String,
            default: ''
        },
        modelType: { 
            type: String,
            default: ''
        },
        number: { 
            type: Number,
            default: null
        }
    },
    emits: ['threatSelected'],
    methods: {
        threatSelected() {
            // Use nextTick to ensure the emit happens after any previous events
            this.$nextTick(() => {
                this.$emit('threatSelected', this.id, 'old');
            });
        }
    }
};
</script>

<style lang="scss" scoped>
    @use '@/styles/colors.scss' as colors;

    .threat-card {
        font-size: 14px;
        transition: transform 0.2s;
        
        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
    }

    .threat-title {
        margin-bottom: 5px;
        font-weight: 500;
        line-height: 1.2;
        max-width: 100%;
    }
    
    .threat-type {
        font-size: 12px;
        color: #666;
        max-width: 100%;
    }

    .threat-icon {
        margin: 2px;
    }

    .green-icon {
        color: colors.$green;
    }

    .red-icon {
        color: colors.$red;
    }

    .yellow-icon {
        color: colors.$yellow;
    }
</style>