import store from './store';
import './App.scss';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import launchControlSlice from './launchControlSlice';

// Unpack Redux actions
const { initializeControl, startEditing } = launchControlSlice.actions;

/**
 * Component looking like mappable section of Launch Control XL device, allowing
 * labels to be added to controls.
 */
function LaunchControlXL() {
  return (
    // Smaller margin on right as EditPanel also has margin on left.
    <div className="launch-control-container shadow-lg ml-2 mr-1">
      <Knobs />
      <Sliders />
      <Buttons />
    </div>
  );
}

/**
 * Knobs
 */

/**
 * Three rows of eight knobs
 */
function Knobs() {
  return (
    <div className="d-flex flex-column mb-4">
      <KnobsRow rowId={1} />
      <KnobsRow rowId={2} />
      <KnobsRow rowId={3} />
    </div>
  );
}

/**
 * One row of eight knobs
 */
function KnobsRow({ rowId }) {
  const knobs = [];
  for (let i = 0; i < 8; i++) {
    const id = `knob-${rowId}-${i + 1}`;
    knobs.push(<Knob id={id} key={id} />);
  }
  return <div className="d-flex">{knobs}</div>;
}

/**
 * Single knob which, when clicked, selects itself and allows label editing
 */
function UnconnectedKnob({ state, id }) {
  // Initialize control in state with blank label
  useEffect(() => {
    store.dispatch(initializeControl({ controlId: id }));
  }, [id]);
  return (
    <div
      className={`${
        state.editing === id ? 'highlight' : null
      } knob control shadow-sm`}
      onClick={(e) => {
        // Stop click triggering deselect
        e.stopPropagation();
        store.dispatch(startEditing({ controlId: id }));
      }}
    >
      {state.controls[id]}
    </div>
  );
}

/**
 * Sliders
 */

/**
 * One row of eight sliders
 */
function Sliders() {
  const sliders = [];
  for (let i = 0; i < 8; i++) {
    const id = `slider-${i + 1}`;
    sliders.push(<Slider id={id} key={id} />);
  }
  return <div className="d-flex mb-4">{sliders}</div>;
}

/**
 * Single slider which, when clicked, selects itself and allows label editing
 */
function UnconnectedSlider({ id, state }) {
  useEffect(() => {
    store.dispatch(initializeControl({ controlId: id }));
  }, [id]);
  return (
    <div
      className={`${
        state.editing === id ? 'highlight' : null
      } slider control d-flex flex-column justify-content-center shadow-sm`}
      onClick={(e) => {
        e.stopPropagation();
        store.dispatch(startEditing({ controlId: id }));
      }}
    >
      {state.controls[id]}
    </div>
  );
}

/**
 * Buttons
 */

/**
 * Two rows of eight buttons
 */
function Buttons() {
  return (
    <div className="d-flex flex-column">
      <ButtonsRow rowId="1" />
      <ButtonsRow rowId="2" />
    </div>
  );
}

/**
 * One row of eight buttons
 */
function ButtonsRow({ rowId }) {
  const buttons = [];
  for (let i = 0; i < 8; i++) {
    const id = `button-${rowId}-${i + 1}`;
    buttons.push(<Button id={id} key={id} />);
  }
  return <div className="d-flex">{buttons}</div>;
}

/**
 * Single button which, when clicked, selects itself and allows label editing
 */
function UnconnectedButton({ id, state }) {
  useEffect(() => {
    store.dispatch(initializeControl({ controlId: id }));
  }, [id]);
  return (
    <div
      className={`${
        state.editing === id ? 'highlight' : null
      } button control d-flex-justify-content-center align-items-center shadow-sm`}
      onClick={(e) => {
        e.stopPropagation();
        store.dispatch(startEditing({ controlId: id }));
      }}
    >
      {state.controls[id]}
    </div>
  );
}

// Connect components to Redux

const mapStateToProps = (state) => {
  return {
    state: state.launchControl,
  };
};

const Knob = connect(mapStateToProps)(UnconnectedKnob);
const Button = connect(mapStateToProps)(UnconnectedButton);
const Slider = connect(mapStateToProps)(UnconnectedSlider);

export default LaunchControlXL;
