import { createSlice } from '@reduxjs/toolkit';

const launchControlSlice = createSlice({
  name: 'launchControl',
  initialState: {},
  reducers: {
    initializeControl: (state, action) => {
      const { controlId } = action.payload;
      state[controlId] = { editing: false, value: '' };
      return state;
    },
    updateControlValue: (state, action) => {
      const { controlId, value } = action.payload;
      state[controlId].value = value;
      return state;
    },
  },
});

export default launchControlSlice;
