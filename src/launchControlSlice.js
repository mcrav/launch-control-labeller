import { createSlice } from '@reduxjs/toolkit';

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
