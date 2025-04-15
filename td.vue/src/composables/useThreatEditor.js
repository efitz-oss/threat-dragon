import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { v4 as uuidv4 } from 'uuid';
import tmActions from '@/store/actions/threatmodel.js';
import { CELL_DATA_UPDATED } from '@/store/actions/cell.js';
import dataChanged from '@/service/x6/graph/data-changed.js';

export function useThreatEditor() {
    const store = useStore();
    const isEditing = ref(false);
    const editingThreat = ref(null);  // Working copy for editing
    const isNewThreat = ref(false);   // Flag for new vs existing
    const originalThreat = ref(null); // Original for cancel operations

    // Reset all state
    const resetState = () => {
        editingThreat.value = null;
        originalThreat.value = null;
        isEditing.value = false;
        isNewThreat.value = false;
    };

    // Get the cell from the store
    const cell = computed(() => store.state.cell.ref);

    // Create a new threat (in memory only, not persisted)
    const createNewThreat = (modelType, cellType, threatNumber) => {
        const newThreat = {
            id: uuidv4(),
            title: `New ${modelType} Threat`,
            status: 'Open',
            severity: 'TBD',
            description: '',
            mitigation: '',
            modelType,
            score: '',
            number: threatNumber
        };

        // Set up editing state
        editingThreat.value = newThreat;
        originalThreat.value = null; // No original for new threats
        isNewThreat.value = true;
        isEditing.value = true;

        return newThreat;
    };

    // Start editing an existing threat
    const editExistingThreat = (threatId) => {
        if (!cell.value || !cell.value.data.threats) return;

        const threatToEdit = cell.value.data.threats.find(t => t.id === threatId);
        if (!threatToEdit) {
            console.warn(`Threat with ID ${threatId} not found`);
            return;
        }

        // Store the original for potential cancel operations
        originalThreat.value = JSON.parse(JSON.stringify(threatToEdit));

        // Create a working copy for editing
        editingThreat.value = JSON.parse(JSON.stringify(threatToEdit));
        isNewThreat.value = false;
        isEditing.value = true;
    };

    // Save changes
    const saveThreat = () => {
        if (!editingThreat.value || !cell.value) return;

        if (isNewThreat.value) {
            // For new threats: Add to the store for the first time
            if (!cell.value.data.threats) {
                cell.value.data.threats = [];
            }

            cell.value.data.threats.push(editingThreat.value);
            console.debug('Added new threat to store:', editingThreat.value.id);
        } else {
            // For existing threats: Update in the store
            const index = cell.value.data.threats.findIndex(t => t.id === editingThreat.value.id);
            if (index >= 0) {
                cell.value.data.threats[index] = editingThreat.value;
                console.debug('Updated existing threat in store:', editingThreat.value.id);
            }
        }

        // Update UI and store
        cell.value.data.hasOpenThreats = cell.value.data.threats.some(t => t.status === 'Open');
        store.dispatch(CELL_DATA_UPDATED, cell.value.data);
        store.dispatch(tmActions.modified);
        dataChanged.updateStyleAttrs(cell.value);

        resetState();
    };

    // Cancel editing
    const cancelEdit = () => {
        // For new threats: Nothing to clean up in the store
        // For existing threats: Revert any changes in the UI
        console.debug('Canceling edit of threat:', editingThreat.value?.id, 'isNew:', isNewThreat.value);
        resetState();
    };

    // Delete an existing threat
    const deleteThreat = () => {
        if (!editingThreat.value || !cell.value || isNewThreat.value) return;

        // Remove the threat from the store
        cell.value.data.threats = cell.value.data.threats.filter(
            t => t.id !== editingThreat.value.id
        );

        console.debug('Deleted threat from store:', editingThreat.value.id);

        // Update UI and store
        cell.value.data.hasOpenThreats = cell.value.data.threats.some(t => t.status === 'Open');
        store.dispatch(CELL_DATA_UPDATED, cell.value.data);
        store.dispatch(tmActions.modified);
        dataChanged.updateStyleAttrs(cell.value);

        resetState();
    };

    return {
        // State
        isEditing,
        editingThreat,
        isNewThreat,
        originalThreat,

        // Methods
        createNewThreat,
        editExistingThreat,
        saveThreat,
        cancelEdit,
        deleteThreat
    };
}