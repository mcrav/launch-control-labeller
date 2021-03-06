import store from './store';
import './App.scss';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import launchControlSlice from './launchControlSlice';

function App() {
  return (
    <div className="w-100 h-100 d-flex justify-content-center align-items-center p-5">
      <LaunchControlXL />
    </div>
  );
}

function LaunchControlXL() {
  return (
    <div className="launch-control-container d-inline-flex flex-column">
      <Knobs />
      <Sliders />
      <Buttons />
    </div>
  );
}

function Sliders() {
  const sliders = [];
  for (let i = 0; i < 8; i++) {
    sliders.push(<Slider id={`slider-${i + 1}`} />);
  }
  return <div className="d-flex mb-4">{sliders}</div>;
}

function UnconnectedSlider({ id }) {
  useEffect(initializeControlEffect(id), [id]);
  return <div className="slider" />;
}

function Buttons() {
  return (
    <div className="d-flex flex-column">
      <ButtonsRow rowId="1" />
      <ButtonsRow rowId="2" />
    </div>
  );
}

function ButtonsRow({ rowId }) {
  const buttons = [];
  for (let i = 0; i < 8; i++) {
    buttons.push(<Button id={`button-${rowId}-${i + 1}`} />);
  }
  return <div className="d-flex">{buttons}</div>;
}

const initializeControlEffect = (id) => {
  return () => {
    const { initializeControl } = launchControlSlice.actions;
    store.dispatch(initializeControl({ controlId: id }));
  };
};

function UnconnectedButton({ id, state }) {
  useEffect(initializeControlEffect(id), [id]);
  console.log(state);
  return <div className="button" />;
}

function Knobs() {
  return (
    <div className="d-flex flex-column mb-4">
      <KnobsRow />
      <KnobsRow />
      <KnobsRow />
    </div>
  );
}

function KnobsRow() {
  const knobs = [];
  for (let i = 0; i < 8; i++) {
    knobs.push(<Knob id={`knob-${i + 1}`} />);
  }
  return <div className="d-flex">{knobs}</div>;
}

function UnconnectedKnob({ state, id }) {
  useEffect(initializeControlEffect(id), [id]);
  return <div className="knob"></div>;
}

const mapStateToProps = (state) => {
  return {
    state: state.launchControl,
  };
};
const Knob = connect(mapStateToProps)(UnconnectedKnob);
const Button = connect(mapStateToProps)(UnconnectedButton);
const Slider = connect(mapStateToProps)(UnconnectedSlider);

export default App;
