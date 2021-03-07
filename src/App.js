import store from './store';
import './App.scss';
import { connect } from 'react-redux';
import launchControlSlice from './launchControlSlice';
import LaunchControlXL from './LaunchControlXL';
import EditPanel from './EditPanel';

function UnconnectedApp({ state }) {
  const { deselect } = launchControlSlice.actions;
  return (
    <div
      className="w-100 h-100 d-flex justify-content-center align-items-center"
      onClick={() => store.dispatch(deselect())}
    >
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
