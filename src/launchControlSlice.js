import { createSlice } from '@reduxjs/toolkit';

const launchControlSlice = createSlice({
  name: 'launchControl',
  initialState: {
    editing: null,
    controls: { null: '' },
  },
  reducers: {
    initializeControl: (state, action) => {
      const { controlId } = action.payload;
      state.controls[controlId] = '';
      return state;
    },
    startEditing: (state, action) => {
      const { controlId } = action.payload;
      if (state.editing === controlId) {
        state.editing = null;
      } else {
        state.editing = controlId;
      }
      return state;
    },
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
