import { createSlice } from '@reduxjs/toolkit';

// Initialize control sequence to allow arrow key navigation through controls
// Every value is a control ID, and every 8 values is a row of controls. It
// reads left to right top to bottom over the control IDs.
const controlSequence = [
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  29,
  30,
  31,
  32,
  33,
  34,
  35,
  36,
  49,
  50,
  51,
  52,
  53,
  54,
  55,
  56,
  77,
  78,
  79,
  80,
  81,
  82,
  83,
  84,
  41,
  42,
  43,
  44,
  57,
  58,
  59,
  60,
  73,
  74,
  75,
  76,
  89,
  90,
  91,
  92,
];

/**
 * State for editing Launch Control XL MIDI mapping labels
 */
const launchControlSlice = createSlice({
  name: 'launchControl',
  initialState: {
    // Ref to label input so it can be clicked when control selected
    labelInputRef: null,
    // Control ID currently being edited
    editing: null,
    // Labels for all controls
    controls: { null: '' },
  },
  reducers: {
    // Initialize control ID with blank label.
    initializeControl: (state, action) => {
      const { controlId } = action.payload;
      state.controls[controlId] = '';
      return state;
    },
    // Load mappings (from file)
    loadMappings: (state, action) => {
      const { mappings } = action.payload;
      Object.keys(mappings).forEach((controlId) => {
        state.controls[controlId] = mappings[controlId];
      });
      return state;
    },
    // Start editing the given control's label. If the control clicked is the
    // same as the one currently being edited, deselect instead.
    startEditing: (state, action) => {
      const { controlId } = action.payload;
      if (state.editing === controlId) {
        state.editing = null;
      } else {
        state.editing = controlId;
      }
      return state;
    },
    // Shift currently selected control. Used for arrow key navigation
    shiftEditingControl: (state, action) => {
      if (state.editing !== null) {
        const editingIndex = controlSequence.indexOf(state.editing);
        switch (action.payload) {
          case 'left':
            if (editingIndex > 0) {
              state.editing = controlSequence[editingIndex - 1];
            }
            break;
          case 'right':
            if (editingIndex + 1 < controlSequence.length) {
              state.editing = controlSequence[editingIndex + 1];
            }
            break;
          case 'up':
            if (editingIndex - 8 >= 0) {
              state.editing = controlSequence[editingIndex - 8];
            }
            break;
          case 'down':
            if (editingIndex + 8 < controlSequence.length) {
              state.editing = controlSequence[editingIndex + 8];
            }
            break;
          default:
            return;
        }
      }
      return state;
    },
    // Deselect control currently being edited.
    deselect: (state, action) => {
      state.editing = null;
      return state;
    },
    // Update label for control.
    updateControlValue: (state, action) => {
      const { controlId, value } = action.payload;
      if (controlId !== null) {
        state.controls[controlId] = value;
      }
      return state;
    },
  },
});

export default launchControlSlice;
