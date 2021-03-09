import store from './store';
import './App.scss';
import { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import launchControlSlice from './launchControlSlice';

// Unpack Redux actions
const { initializeControl, startEditing } = launchControlSlice.actions;

const sliderIds = [77, 78, 79, 80, 81, 82, 83, 84];

const initialPositionsState = {};

const ranges = [
  // Knobs row 1
  [13, 21],
  // Knobs row 2
  [29, 37],
  // Knobs row 3
  [49, 57],
  // Sliders
  [77, 85],
];

// Initialize ranges for MIDI event callback. Only look for knobs and sliders as
// they are simple to handle. Haven't decided yet exactly how to handle button
// events as the way they work with Ableton is a bit more complicated.
ranges.forEach((range) => {
  for (let i = range[0]; i < range[1]; i++) {
    initialPositionsState[i] = 0.5;
  }
});

// Knob diameter, slider width, and button width
// Must be aligned with the value in App.scss
const CONTROL_SIZE = 80;

// Height of slider control
// Must be aligned with value in App.scss
const SLIDER_HEIGHT = CONTROL_SIZE * 3 + 10;

/**
 * Component looking like mappable section of Launch Control XL device, allowing
 * labels to be added to controls.
 */
function LaunchControlXL({ labelInputRef }) {
  const [positionsState, setPositionsState] = useState(initialPositionsState);
  const positionsStateRef = useRef({});
  positionsStateRef.current = positionsState;

  // Connect to physical Launch Control device if connected
  useEffect(() => {
    // Don't connect to Launch Control if Web MIDI API not available (Firefox)
    if (navigator.requestMIDIAccess !== undefined) {
      navigator.requestMIDIAccess().then((access) => {
        const values = access.inputs.values();
        let value = values.next();
        let found = false;
        while (value.value !== undefined && !found) {
          if (value.value.name.indexOf('Launch Control XL') !== -1) {
            value.value.onmidimessage = onMIDIMessage;
            console.log('Found Launch Control XL.');
            found = true;
          }
          value = values.next();
        }
        access.onstatechange = function (e) {
          // Print information about the (dis)connected MIDI controller
          console.log(e.port.name, e.port.manufacturer, e.port.state);
        };
      });
    }
  }, []);

  // Handle Launch Control MIDI messages and update state accordingly
  const onMIDIMessage = (message) => {
    const { data } = message;
    switch (data[0]) {
      // User mode
      case 176:
      // Factory mode
      // eslint-disable-next-line
      case 184:
        const newPositionsState = { ...positionsStateRef.current };
        // 127 is max value so this normalizes control position to 0-1 range
        newPositionsState[data[1]] = data[2] / 127;
        setPositionsState(newPositionsState);
        break;
      default:
        return;
    }
  };

  return (
    // Smaller margin on right as EditPanel also has margin on left.
    <div className="launch-control-container shadow-lg ml-2 mr-1">
      <Knobs positionsState={positionsState} labelInputRef={labelInputRef} />
      <Sliders state={positionsState} labelInputRef={labelInputRef} />
      <Buttons labelInputRef={labelInputRef} />
    </div>
  );
}

/**
 * Knobs
 */

/**
 * Three rows of eight knobs
 */
function Knobs({ positionsState, labelInputRef }) {
  return (
    <div className="d-flex flex-column mb-4">
      <KnobsRow
        positionsState={positionsState}
        rowId={13}
        labelInputRef={labelInputRef}
      />
      <KnobsRow
        positionsState={positionsState}
        rowId={29}
        labelInputRef={labelInputRef}
      />
      <KnobsRow
        positionsState={positionsState}
        rowId={49}
        labelInputRef={labelInputRef}
      />
    </div>
  );
}

/**
 * One row of eight knobs
 */
function KnobsRow({ rowId, positionsState, labelInputRef }) {
  const knobs = [];
  for (let i = 0; i < 8; i++) {
    const id = i + rowId;
    knobs.push(
      <Knob
        id={id}
        key={id}
        position={positionsState[id]}
        labelInputRef={labelInputRef}
      />
    );
  }
  return <div className="d-flex">{knobs}</div>;
}

/**
 * Single knob which, when clicked, selects itself and allows label editing
 */
function UnconnectedKnob({ state, id, position, labelInputRef }) {
  // Initialize control in state with blank label
  useEffect(() => {
    store.dispatch(initializeControl({ controlId: id }));
  }, [id]);
  const cx = CONTROL_SIZE / 2;
  const cy = CONTROL_SIZE / 2;
  return (
    <div
      className={`${
        state.editing === id ? 'highlight' : ''
      } knob position-relative`}
      onClick={(e) => {
        // Stop click triggering deselect
        e.stopPropagation();
        store.dispatch(startEditing({ controlId: id }));
        // Start editing label
        labelInputRef.current.focus();
      }}
    >
      <svg width={CONTROL_SIZE} height={CONTROL_SIZE}>
        {/* Main circle */}
        <circle
          cx={cx}
          cy={cy}
          r={CONTROL_SIZE / 2}
          className={`${
            state.editing === id ? 'highlight' : null
          } knob control-line`}
        />
        {/* Rotating line */}
        <line
          x1={cx}
          x2={cx}
          y1={0}
          y2={cy}
          transform={`rotate(${300 * position - 150}, ${cx}, ${cy})`}
          className="control-bold-line"
        />
      </svg>
      {/* Div just to allow hover highlighting */}
      <div className="knob-circle"></div>
      {/* Control label */}
      <p className="knob-label label-wrap p-1 w-100">{state.controls[id]}</p>
    </div>
  );
}

/**
 * Sliders
 */

/**
 * One row of eight sliders
 */
function Sliders({ state, labelInputRef }) {
  return (
    <div className="d-flex mb-4">
      {sliderIds.map((id) => (
        <Slider
          id={id}
          key={id}
          position={state[id]}
          labelInputRef={labelInputRef}
        />
      ))}
    </div>
  );
}

/**
 * Single slider which, when clicked, selects itself and allows label editing
 */
function UnconnectedSlider({ id, state, position, labelInputRef }) {
  useEffect(() => {
    store.dispatch(initializeControl({ controlId: id }));
  }, [id]);
  return (
    <div
      className="slider shadow-sm position-relative"
      onClick={(e) => {
        // Stop propagation so click doesn't deselect control
        e.stopPropagation();
        store.dispatch(startEditing({ controlId: id }));
        // Start editing label
        labelInputRef.current.focus();
      }}
    >
      {/* Absolutely positioned div overlays SVG with control label */}
      <div className="slider-label d-flex align-items-center justify-content-center text-center">
        <p className="label-wrap">{state.controls[id]}</p>
      </div>
      {/* Slider with movable level line */}
      <svg width={CONTROL_SIZE} height={SLIDER_HEIGHT} className="control">
        {/* Slider rect */}
        <rect
          className={`slider control-line ${
            state.editing === id ? 'highlight' : ''
          } `}
          x={0}
          y={0}
          width={CONTROL_SIZE}
          height={SLIDER_HEIGHT}
        />
        {/* Movable slider level line */}
        <line
          className="slider-level control-bold-line"
          x1={0}
          x2={CONTROL_SIZE}
          y1={(1 - position) * SLIDER_HEIGHT}
          y2={(1 - position) * SLIDER_HEIGHT}
        />
      </svg>
    </div>
  );
}

/**
 * Buttons
 */

/**
 * Two rows of eight buttons
 */
function Buttons({ labelInputRef }) {
  return (
    <div className="d-flex flex-column">
      <div className="d-flex">
        <ButtonsGroup groupId={41} labelInputRef={labelInputRef} />
        <ButtonsGroup groupId={57} labelInputRef={labelInputRef} />
      </div>
      <div className="d-flex">
        <ButtonsGroup groupId={73} labelInputRef={labelInputRef} />
        <ButtonsGroup groupId={89} labelInputRef={labelInputRef} />
      </div>
    </div>
  );
}

/**
 * One row of eight buttons
 */
function ButtonsGroup({ groupId, labelInputRef }) {
  const buttons = [];
  for (let i = 0; i < 4; i++) {
    const id = groupId + i;
    buttons.push(<Button id={id} key={id} labelInputRef={labelInputRef} />);
  }
  return <div className="d-flex">{buttons}</div>;
}

/**
 * Single button which, when clicked, selects itself and allows label editing
 */
function UnconnectedButton({ id, state, labelInputRef }) {
  useEffect(() => {
    store.dispatch(initializeControl({ controlId: id }));
  }, [id]);
  return (
    <div
      className={`${
        state.editing === id ? 'highlight' : ''
      } p-1 button control d-flex justify-content-center align-items-center shadow-sm`}
      onClick={(e) => {
        // Stop propagation so click doesn't deselect control
        e.stopPropagation();
        store.dispatch(startEditing({ controlId: id }));
        // Start editing label
        labelInputRef.current.focus();
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
