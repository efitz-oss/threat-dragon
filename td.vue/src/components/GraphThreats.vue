<template>
    <b-card class="threat-card">
        <b-card-text>
            <b-row>
                <b-col>
                    <a v-if="!!number" href="javascript:void(0)" @click="threatSelected()"
                    >#{{ number }} {{ title || 'Unknown Threat' }}</a
                    >
                    <a v-else href="javascript:void(0)" @click="threatSelected()">{{
                        title || 'Unknown Threat'
                    }}</a>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    {{ type }}
                </b-col>
            </b-row>
            <b-row>
                <b-col>
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
                <b-col align-h="end">
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
        id: { type: String },
        status: { type: String },
        severity: { type: String },
        description: { type: String },
        title: { type: String },
        type: { type: String },
        mitigation: { type: String },
        modelType: { type: String },
        number: { type: Number }
    },
    methods: {
        threatSelected() {
            this.$emit('threatSelected', this.id, 'old');
        }
    }
};
</script>

<style lang="scss" scoped>
@use '@/styles/colors.scss' as colors; /* Import SCSS variables */
.threat-card {
    font-size: 14px;
}
.threat-title {
    margin-bottom: 5px;
}
.threat-icon {
    margin: 2px;
}
.green-icon {
    color: colors.$green; /* Use SCSS variable */
}
.red-icon {
    color: colors.$red; /* Use SCSS variable */
}
.yellow-icon {
    color: colors.$yellow; /* Use SCSS variable */
}
</style>
