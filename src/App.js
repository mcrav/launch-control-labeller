import store from './store';
import './App.scss';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import launchControlSlice from './launchControlSlice';
import LaunchControlXL from './LaunchControlXL';
import EditPanel from './EditPanel';

function UnconnectedApp({ state }) {
  const { updateControlValue, startEditing } = launchControlSlice.actions;
  const { editing } = state;
  return (
    <div className="w-100 h-100 d-flex justify-content-center mt-5">
      <LaunchControlXL />
      <EditPanel />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    state: state.launchControl,
  };
};

const App = connect(mapStateToProps)(UnconnectedApp);

export default App;
