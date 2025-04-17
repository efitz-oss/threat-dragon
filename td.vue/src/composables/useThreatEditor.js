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
        console.debug('resetState called - resetting threat editor state');

        // Check cell reference before resetting state
        const cellRef = store.state.cell.ref;
        console.debug('Cell reference state in resetState (before reset):', {
            cellExists: !!cellRef,
            cellData: cellRef ? !!cellRef.data : 'no cell',
            cellId: cellRef ? cellRef.id : 'no cell'
        });

        editingThreat.value = null;
        originalThreat.value = null;
        isEditing.value = false;
        isNewThreat.value = false;

        // Check cell reference after resetting state
        const cellRefAfter = store.state.cell.ref;
        console.debug('Cell reference state in resetState (after reset):', {
            cellExists: !!cellRefAfter,
            cellData: cellRefAfter ? !!cellRefAfter.data : 'no cell',
            cellId: cellRefAfter ? cellRefAfter.id : 'no cell'
        });
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
        console.debug('saveThreat called with:', {
            editingThreat: editingThreat.value ? editingThreat.value.id : 'null',
            isNewThreat: isNewThreat.value,
            cellExists: !!cell.value,
            cellData: cell.value ? !!cell.value.data : 'no cell'
        });

        if (!editingThreat.value) {
            console.error('Cannot save threat: editingThreat is null or undefined');
            return;
        }

        if (!cell.value) {
            console.error('Cannot save threat: cell reference is null or undefined');
            return;
        }

        if (!cell.value.data) {
            console.error('Cannot save threat: cell.data is null or undefined');
            return;
        }

        // Log detailed information about the cell and threat
        console.debug('Cell details:', {
            id: cell.value.id,
            type: cell.value.data.type,
            name: cell.value.data.name,
            hasThreats: !!cell.value.data.threats,
            threatCount: cell.value.data.threats ? cell.value.data.threats.length : 0
        });

        console.debug('Threat details:', {
            id: editingThreat.value.id,
            title: editingThreat.value.title,
            status: editingThreat.value.status,
            isNew: isNewThreat.value
        });

        try {
            if (isNewThreat.value) {
                // For new threats: Add to the store for the first time
                if (!cell.value.data.threats) {
                    cell.value.data.threats = [];
                    console.debug('Initialized empty threats array for cell');
                }

                // Make a deep copy of the threat to avoid reference issues
                const threatCopy = JSON.parse(JSON.stringify(editingThreat.value));
                cell.value.data.threats.push(threatCopy);
                console.debug('Added new threat to store:', editingThreat.value.id);
                console.debug('Cell threats after adding:', cell.value.data.threats.length);
            } else {
                // For existing threats: Update in the store
                const index = cell.value.data.threats.findIndex(t => t.id === editingThreat.value.id);
                if (index >= 0) {
                    // Make a deep copy of the threat to avoid reference issues
                    const threatCopy = JSON.parse(JSON.stringify(editingThreat.value));
                    cell.value.data.threats[index] = threatCopy;
                    console.debug('Updated existing threat in store:', editingThreat.value.id);
                } else {
                    console.warn('Could not find existing threat with ID:', editingThreat.value.id);
                }
            }

            // Update UI and store
            cell.value.data.hasOpenThreats = cell.value.data.threats.some(t => t.status === 'Open');
            console.debug('Dispatching CELL_DATA_UPDATED with:', {
                cellId: cell.value.id,
                threatCount: cell.value.data.threats.length,
                hasOpenThreats: cell.value.data.hasOpenThreats
            });

            store.dispatch(CELL_DATA_UPDATED, cell.value.data);
            store.dispatch(tmActions.modified);
            dataChanged.updateStyleAttrs(cell.value);

            console.debug('Threat saved successfully');
        } catch (error) {
            console.error('Error saving threat:', error);
        }

        // Don't reset state immediately - let the component handle it
        // This ensures the component can properly handle the UI state
        console.debug('Threat saved successfully, returning control to component');

        // The component will handle resetting the state after UI updates
        // This prevents issues with the modal being hidden while still in editing state
    };

    // Cancel editing
    const cancelEdit = () => {
        // For new threats: Nothing to clean up in the store
        // For existing threats: Revert any changes in the UI
        console.debug('Canceling edit of threat:', editingThreat.value?.id, 'isNew:', isNewThreat.value);

        // Check cell reference before resetting state
        const cellRef = store.state.cell.ref;
        console.debug('Cell reference state before cancelEdit resets state:', {
            cellExists: !!cellRef,
            cellData: cellRef ? !!cellRef.data : 'no cell',
            cellId: cellRef ? cellRef.id : 'no cell'
        });

        resetState();

        // Check cell reference after resetting state
        const cellRefAfter = store.state.cell.ref;
        console.debug('Cell reference state after cancelEdit resets state:', {
            cellExists: !!cellRefAfter,
            cellData: cellRefAfter ? !!cellRefAfter.data : 'no cell',
            cellId: cellRefAfter ? cellRefAfter.id : 'no cell'
        });
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
        deleteThreat,
        resetState
    };
}