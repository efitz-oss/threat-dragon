import {
    CELL_DATA_UPDATED,
    CELL_SELECTED,
    CELL_UNSELECTED
} from '../actions/cell.js';

export const clearState = (state) => {
    state.ref = null;
    state.threats = [];
};

const state = {
    ref: null,
    threats: []
};

const actions = {
    [CELL_SELECTED]: ({ commit }, ref) => commit(CELL_SELECTED, ref),
    [CELL_UNSELECTED]: ({ commit }) => commit(CELL_UNSELECTED),
    [CELL_DATA_UPDATED]: ({ commit }, data) => commit(CELL_DATA_UPDATED, data)
};

const mutations = {
    [CELL_SELECTED]: (state, ref) => {
        state.ref = ref;
        if (state.ref && state.ref.data && state.ref.data.threats) {
            // Replace Vue.set with direct array assignment for Vue 3 reactivity
            state.threats = [...state.ref.data.threats];
        }
    },
    [CELL_UNSELECTED]: (state) => clearState(state),
    [CELL_DATA_UPDATED]: (state, data) => {
        if (!state.ref || !state.ref.setData) {
            return;
        }

        state.ref.setData(data);

        if (data.threats) {
            // Replace Vue.set with direct array assignment for Vue 3 reactivity
            state.threats = [...data.threats];
        }
    }
};

const getters = {};

export default {
    state,
    actions,
    mutations,
    getters
};
