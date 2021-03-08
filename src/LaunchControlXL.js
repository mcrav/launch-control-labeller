import store from './store';
import './App.scss';
import { useEffect, useRef, useState } from 'react';
import { connect, Provider } from 'react-redux';
import launchControlSlice from './launchControlSlice';

// Unpack Redux actions
const { initializeControl, startEditing } = launchControlSlice.actions;

const sliderIds = [77, 78, 79, 80, 81, 82, 83, 84];

const initialPositionsState = {};

const ranges = [
  [13, 21],
  [29, 37],
  [49, 57],
  [77, 85],
];

ranges.forEach((range) => {
  for (let i = range[0]; i < range[1]; i++) {
    initialPositionsState[i] = 0.5;
  }
});

// Knob diameter, slider width, and button width
const CONTROL_SIZE = 80;

// Height of slider control
const SLIDER_HEIGHT = CONTROL_SIZE * 3 + 10;

// Height of button control
const BUTTON_HEIGHT = CONTROL_SIZE * 0.5;

const LINE_COLOR = '#777';

/**
 * Component looking like mappable section of Launch Control XL device, allowing
 * labels to be added to controls.
 */
function LaunchControlXL() {
  const [positionsState, setPositionsState] = useState(initialPositionsState);
  const positionsStateRef = useRef({});
  positionsStateRef.current = positionsState;
  useEffect(() => {
    navigator.requestMIDIAccess().then((access) => {
      const values = access.inputs.values();
      let value = values.next();
      while (value.value !== undefined) {
        if (value.value.name === 'Launch Control XL MIDI 1') {
          value.value.onmidimessage = onMIDIMessage;

          console.log('Found Launch Control XL.');
        }
        value = values.next();
      }
      access.onstatechange = function (e) {
        // Print information about the (dis)connected MIDI controller
        console.log(e.port.name, e.port.manufacturer, e.port.state);
      };
    });
  }, []);

  const onMIDIMessage = (message) => {
    const { data } = message;
    switch (data[0]) {
      case 176:
        const newPositionsState = { ...positionsStateRef.current };
        newPositionsState[data[1]] = data[2] / 127;
        setPositionsState(newPositionsState);
    }
  };

  return (
    // Smaller margin on right as EditPanel also has margin on left.
    <div className="launch-control-container shadow-lg ml-2 mr-1">
      <Knobs positionsState={positionsState} />
      <Sliders state={positionsState} />
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
function Knobs({ positionsState }) {
  return (
    <div className="d-flex flex-column mb-4">
      <KnobsRow positionsState={positionsState} rowId={13} />
      <KnobsRow positionsState={positionsState} rowId={29} />
      <KnobsRow positionsState={positionsState} rowId={49} />
    </div>
  );
}

/**
 * One row of eight knobs
 */
function KnobsRow({ rowId, positionsState }) {
  const knobs = [];
  for (let i = 0; i < 8; i++) {
    const id = i + rowId;
    knobs.push(<Knob id={id} key={id} position={positionsState[id]} />);
  }
  return <div className="d-flex">{knobs}</div>;
}

/**
 * Single knob which, when clicked, selects itself and allows label editing
 */
function UnconnectedKnob({ state, id, position }) {
  // Initialize control in state with blank label
  useEffect(() => {
    store.dispatch(initializeControl({ controlId: id }));
  }, [id]);
  const cx = CONTROL_SIZE / 2;
  const cy = CONTROL_SIZE / 2;
  return (
    <div
      className={`${state.editing === id ? 'highlight' : null} knob`}
      onClick={(e) => {
        // Stop click triggering deselect
        e.stopPropagation();
        store.dispatch(startEditing({ controlId: id }));
      }}
    >
      <svg width={CONTROL_SIZE} height={CONTROL_SIZE}>
        <circle
          cx={cx}
          cy={cy}
          r={CONTROL_SIZE / 2}
          className={`${
            state.editing === id ? 'highlight' : null
          } knob control-line`}
        />
        <line
          x1={cx}
          x2={cx}
          y1={0}
          y2={cy}
          transform={`rotate(${300 * position - 150}, ${cx}, ${cy})`}
          className="control-bold-line"
        />
      </svg>
    </div>
  );
}

/**
 * Sliders
 */

/**
 * One row of eight sliders
 */
function Sliders({ state }) {
  return (
    <div className="d-flex mb-4">
      {sliderIds.map((id) => (
        <Slider id={id} key={id} position={state[id]} />
      ))}
    </div>
  );
}

/**
 * Single slider which, when clicked, selects itself and allows label editing
 */
function UnconnectedSlider({ id, state, position }) {
  useEffect(() => {
    store.dispatch(initializeControl({ controlId: id }));
  }, [id]);
  return (
    <div
      className="slider shadow-sm"
      onClick={(e) => {
        e.stopPropagation();
        store.dispatch(startEditing({ controlId: id }));
      }}
    >
      <svg
        width={CONTROL_SIZE}
        height={SLIDER_HEIGHT}
        className={`control ${state.editing === id ? 'highlight' : null} `}
      >
        <rect
          className="control-line"
          x={0}
          y={0}
          width={CONTROL_SIZE}
          height={SLIDER_HEIGHT}
        />
        <line
          // className="control-line"
          x1={0}
          x2={CONTROL_SIZE}
          y1={(1 - position) * SLIDER_HEIGHT}
          y2={(1 - position) * SLIDER_HEIGHT}
          className="control-bold-line"
        />
      </svg>
    </div>
    // <div
    //   onClick={(e) => {
    //     e.stopPropagation();
    //     store.dispatch(startEditing({ controlId: id }));
    //   }}
    // >
    //   {state.controls[id]}
    //   {position}
    // </div>
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
