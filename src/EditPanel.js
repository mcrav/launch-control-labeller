import store from './store';
import './App.scss';
import { connect } from 'react-redux';
import launchControlSlice from './launchControlSlice';

function UnconnectedEditPanel({ state }) {
  const { editing } = state;
  const { updateControlValue, startEditing } = launchControlSlice.actions;
  return (
    <form className="shadow-sm mx-3 py-4 px-3 d-flex flex-column justify-content-between">
      <div className="form-group d-flex mb-5">
        <button type="button" className="btn toolbar-btn btn-dark">
          Load
        </button>
        <button type="button" className="btn toolbar-btn mx-2 btn-dark">
          Save
        </button>
      </div>
      <div className="form-group p-4">
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
          onChange={(e) =>
            store.dispatch(
              updateControlValue({ controlId: editing, value: e.target.value })
            )
          }
        ></input>
      </div>
      <div className="form-group">
        <button
          type="button"
          className="btn toolbar-btn"
          onClick={() => store.dispatch(startEditing({ controlId: null }))}
        >
          Deselect
        </button>
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
