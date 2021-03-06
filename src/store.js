import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import launchControlSlice from './launchControlSlice.js';
const middleware = [...getDefaultMiddleware()];

const store = configureStore({
  reducer: {
    launchControl: launchControlSlice.reducer,
  },
  middleware,
});

export default store;
