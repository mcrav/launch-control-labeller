import { useRef } from 'react';
import store from './store';
import './App.scss';
import { connect } from 'react-redux';
import launchControlSlice from './launchControlSlice';

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

const load = (file) => {
  const { loadMappings } = launchControlSlice.actions;
  const reader = new FileReader();
  reader.onload = (e) => {
    store.dispatch(loadMappings({ mappings: JSON.parse(e.target.result) }));
  };
  reader.readAsText(file);
};

function UnconnectedEditPanel({ state }) {
  const { editing } = state;
  const loadInputRef = useRef();
  const { updateControlValue, startEditing } = launchControlSlice.actions;
  return (
    <form className="shadow-sm mr-2 ml-1 py-4 px-3 d-flex flex-column align-items-center  ">
      <div className="form-group d-flex mb-4">
        <button
          type="button"
          className="btn toolbar-btn btn-dark"
          onClick={() => loadInputRef.current.click()}
        >
          Load
        </button>
        <input
          type="file"
          className="d-none"
          ref={loadInputRef}
          onChange={() => load(loadInputRef.current.files[0])}
        ></input>
        <button
          type="button"
          className="btn toolbar-btn mx-2 btn-dark"
          onClick={() => save(state)}
        >
          Save
        </button>
      </div>
      <div className="form-group">
        <h1 className="instructions">Instructions</h1>
        <ol>
          <li>Click a control</li>
          <li>Edit the label here</li>
        </ol>
        {/* <label className="mb-1">Editing {editing}</label> */}
        <input
          className="form-control"
          type="text"
          value={state.controls[editing]}
          disabled={editing === null}
          placeholder="Enter mapping label here..."
          onClick={(e) => {
            e.stopPropagation();
          }}
          onChange={(e) => {
            store.dispatch(
              updateControlValue({ controlId: editing, value: e.target.value })
            );
          }}
        ></input>
      </div>
    </form>
  );
}

const mapStateToProps = (state) => {
  return {
    state: state.launchControl,
  };
};

const EditPanel = connect(mapStateToProps)(UnconnectedEditPanel);

export default EditPanel;
