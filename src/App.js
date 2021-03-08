import React, { useEffect } from 'react';

// Sass
import './App.scss';

// Redux
import store from './store';
import launchControlSlice from './launchControlSlice';

// Components
import LaunchControlXL from './LaunchControlXL';
import EditPanel from './EditPanel';

// Unpack Redux actions
const { deselect } = launchControlSlice.actions;

const App = () => {
  return (
    <div
      className="w-100 h-100 d-flex justify-content-center align-items-center"
      // Deselect controls when clicking anywhere in app
      onClick={() => store.dispatch(deselect())}
    >
      <LaunchControlXL />
      <EditPanel />
    </div>
  );
};

export default App;
