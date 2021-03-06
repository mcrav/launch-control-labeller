import React, { useEffect, useRef } from 'react';

// Redux
import store from './store';
import { connect } from 'react-redux';
import launchControlSlice from './launchControlSlice';

// Unpack Redux actions
const { updateControlValue, loadMappings } = launchControlSlice.actions;

/**
 * Offer user download of JSON file containing all their mapping labels
 */
const save = (state) => {
  const element = document.createElement('a');
  const file = new Blob([JSON.stringify(state.controls)], {
    type: 'application/json',
  });
  element.href = window.URL.createObjectURL(file);
  element.setAttribute('download', 'launch-control-xl-mappings.json');
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

/**
 * Load user's mapping labels from saved JSON file.
 */
const load = (file) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    store.dispatch(loadMappings({ mappings: JSON.parse(e.target.result) }));
  };
  reader.readAsText(file);
};

/**
 * Edit panel allowing user to edit labels, and load / save all mapping labels
 */
function UnconnectedEditPanel({ state, onLabelInputRef }) {
  const { editing } = state;
  // Ref to invisible file input used for loading JSON file with mapping labels
  const loadInputRef = useRef();
  // Ref to label input field so that it can be focused when a control is selected
  const labelInputRef = useRef();
  // Send the label input ref to callback so it can be passed to LaunchControlXL
  // component
  useEffect(() => {
    onLabelInputRef(labelInputRef);
  }, [onLabelInputRef]);
  return (
    <div className="edit-panel shadow-sm mr-2 ml-1 py-4 px-3 d-flex flex-column align-items-center">
      {/* Save / Load Buttons */}
      <div className="form-group d-flex mb-4">
        {/* Load */}
        <button
          type="button"
          className="btn toolbar-btn btn-dark"
          onClick={() => loadInputRef.current.click()}
        >
          Load
        </button>
        {/* Invisible input to use for loading JSON file */}
        <input
          type="file"
          className="d-none"
          ref={loadInputRef}
          onChange={() => load(loadInputRef.current.files[0])}
        ></input>
        {/* Save */}
        <button
          type="button"
          className="btn toolbar-btn mx-2 btn-dark"
          onClick={() => save(state)}
        >
          Save
        </button>
      </div>
      {/* Edit Mapping Labels */}
      <div className="form-group">
        <h1 className="instructions">Instructions</h1>
        <ol>
          <li>Click a control</li>
          <li>Edit the label here</li>
        </ol>
        <input
          ref={labelInputRef}
          className="form-control"
          type="text"
          value={state.controls[editing]}
          placeholder="Enter mapping label here..."
          // Stop clicking here deselecting controls
          onClick={(e) => {
            // Don't deselect control when editing label
            e.stopPropagation();
          }}
          onChange={(e) => {
            store.dispatch(
              updateControlValue({ controlId: editing, value: e.target.value })
            );
          }}
        ></input>
      </div>
    </div>
  );
}

// Connect to Redux state
const mapStateToProps = (state) => {
  return {
    state: state.launchControl,
  };
};

const EditPanel = connect(mapStateToProps)(UnconnectedEditPanel);

export default EditPanel;
