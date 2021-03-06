import store from './store';
import './App.scss';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import launchControlSlice from './launchControlSlice';

function LaunchControlXL() {
  return (
    <div className="launch-control-container d-inline-flex flex-column shadow-lg">
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

function UnconnectedSlider({ id, state }) {
  useEffect(initializeControlEffect(id), [id]);
  const { startEditing } = launchControlSlice.actions;
  return (
    <div
      className={`${
        state.editing === id ? 'highlight' : null
      } slider control d-flex flex-column justify-content-center shadow-sm`}
      onClick={() => store.dispatch(startEditing({ controlId: id }))}
    >
      {state.controls[id]}
    </div>
  );
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
  const { startEditing } = launchControlSlice.actions;
  return (
    <div
      className={`${
        state.editing === id ? 'highlight' : null
      } button control d-flex-justify-content-center align-items-center shadow-sm`}
      onClick={() => store.dispatch(startEditing({ controlId: id }))}
    >
      {state.controls[id]}
    </div>
  );
}

function Knobs() {
  return (
    <div className="d-flex flex-column mb-4">
      <KnobsRow rowId={1} />
      <KnobsRow rowId={2} />
      <KnobsRow rowId={3} />
    </div>
  );
}

function KnobsRow({ rowId }) {
  const knobs = [];
  for (let i = 0; i < 8; i++) {
    knobs.push(<Knob id={`knob-${rowId}-${i + 1}`} />);
  }
  return <div className="d-flex">{knobs}</div>;
}

function UnconnectedKnob({ state, id }) {
  useEffect(initializeControlEffect(id), [id]);
  const { startEditing } = launchControlSlice.actions;
  return (
    <div
      className={`${
        state.editing === id ? 'highlight' : null
      } knob control shadow-sm`}
      onClick={() => store.dispatch(startEditing({ controlId: id }))}
    >
      {state.controls[id]}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    state: state.launchControl,
  };
};

const Knob = connect(mapStateToProps)(UnconnectedKnob);
const Button = connect(mapStateToProps)(UnconnectedButton);
const Slider = connect(mapStateToProps)(UnconnectedSlider);

export default LaunchControlXL;
