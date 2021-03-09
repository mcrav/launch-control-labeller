import { createSlice } from '@reduxjs/toolkit';

const controlSequence = [];
const ranges = [
  // Knobs row 1
  [13, 21],
  // Knobs row 2
  [29, 37],
  // Knobs row 3
  [49, 57],
  // Sliders
  [77, 85],
  // Buttons top left four
  [41, 45],
  // Buttons top right four
  [57, 60],
  // Buttons bottom left four
  [73, 77],
  // Buttons bottom right four
  [89, 93],
];

ranges.forEach((range) => {
  for (let i = range[0]; i < range[1]; i++) {
    controlSequence.push(i);
  }
});

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
    shiftEditingControl: (state, action) => {
      if (state.editing !== null) {
        const editingIndex = controlSequence.indexOf(state.editing);
        state.editing = controlSequence[editingIndex + action.payload];
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
