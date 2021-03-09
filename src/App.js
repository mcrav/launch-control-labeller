import React, { useState } from 'react';

// Sass
import './App.scss';

// Redux
import store from './store';
import launchControlSlice from './launchControlSlice';

// Components
import LaunchControlXL from './LaunchControlXL';
import EditPanel from './EditPanel';

// Unpack Redux actions
const { deselect, shiftEditingControl } = launchControlSlice.actions;

const App = () => {
  const [labelInputRef, setLabelInputRef] = useState(null);
  return (
    <div
      className="w-100 h-100 d-flex justify-content-center align-items-center"
      // Deselect controls when clicking anywhere in app
      onClick={() => store.dispatch(deselect())}
      onKeyDown={(e) => {
        console.log(e.key);
        // Deselect all controls on enter press
        if (e.key === 'Enter') {
          store.dispatch(deselect());
          // Go to next control on right arrow press
        } else if (e.key === 'ArrowRight') {
          store.dispatch(shiftEditingControl(1));
          // Go to previous control on left arrow press
        } else if (e.key === 'ArrowLeft') {
          store.dispatch(shiftEditingControl(-1));
        }
      }}
    >
      <LaunchControlXL labelInputRef={labelInputRef} />
      <EditPanel
        onLabelInputRef={(labelInputRef) => setLabelInputRef(labelInputRef)}
      />
    </div>
  );
};

export default App;
