<template>
    <div ref="diagram_container" class="td-readonly-diagram" />
</template>

<script>
import debounce from '@/service/debounce.js';
import diagramService from '@/service/migration/diagram.js';

const debounceTimeoutMs = 100;

export default {
    name: 'TdReadOnlyDiagram',
    props: {
        diagram: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            graph: null,
        };
    },
    mounted() {
        this.init();
    },
    created() {
        window.addEventListener('resize', debounce(this.resize, debounceTimeoutMs));
    },
    unmounted() {
        window.removeEventListener('resize', this.resize);
        diagramService.dispose(this.graph);
    },
    methods: {
        init() {
            this.graph = diagramService.draw(this.$refs.diagram_container, this.diagram);
            this.resize();
        },
        resize() {
            // Magic number warning... Needs more testing, this seems to work fine for firefox/chrome on linx,
            // but may be OS dependent and/or printer dependent
            const height = 700;
            const maxWidth = 1000;

            const width = this.$parent.$el.clientWidth;
            this.graph.resize(Math.min(width, maxWidth) - 50, height - 50);
            this.graph.scaleContentToFit({
                padding: 3,
            });
        },
    },
};
</script>

<style lang="scss" scoped>
    .td-readonly-diagram {
        min-height: 600px;
        max-width: 95%;
    }
</style>
