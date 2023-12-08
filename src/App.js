import React, { useEffect, useState } from "react";

// Sass
import "./App.scss";

// Redux
import store from "./store";
import launchControlSlice from "./launchControlSlice";

// Components
import LaunchControlXL from "./LaunchControlXL";
import EditPanel from "./EditPanel";

// Unpack Redux actions
const { deselect, shiftEditingControl } = launchControlSlice.actions;

/**
 * App to help remember MIDI mappings on the Launch Control XL MIDI controller.
 * Also syncs with the controller on Chrome so the user can see the level of
 * all knobs and sliders.
 */
const App = () => {
  // Store ref to label input field so that it can be focused in the
  // LaunchControlXL component when a control is selected
  const [labelInputRef, setLabelInputRef] = useState(null);

  const [showMovedPopup, setShowMovedPopup] = useState(false);

  useEffect(() => {
    if (window.location.host !== "launch-control-labeller.web.app") {
      setShowMovedPopup(true);
    }
  }, []);

  return (
    <div
      className="w-100 h-100 d-flex justify-content-center align-items-center"
      // Deselect controls when clicking anywhere in app
      onClick={() => store.dispatch(deselect())}
      onKeyDown={(e) => {
        switch (e.key) {
          // Deselect all controls on enter press
          case "Enter":
            store.dispatch(deselect());
            break;
          // Arrow key navigation around controls once
          case "ArrowRight":
            store.dispatch(shiftEditingControl("right"));
            break;
          case "ArrowLeft":
            store.dispatch(shiftEditingControl("left"));
            break;
          case "ArrowUp":
            store.dispatch(shiftEditingControl("up"));
            break;
          case "ArrowDown":
            store.dispatch(shiftEditingControl("down"));
            break;
          default:
            return;
        }
      }}
    >
      {showMovedPopup && (
        <div
          className="modal fade show"
          id="myModal"
          style={{ display: "block" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-4">
              <div className="modal-header">
                <h4 className="modal-title">
                  Launch Control Labeller has moved home
                </h4>
              </div>

              <div className="modal-body">
                <p>
                  Continue using at{" "}
                  <a href="https://launch-control-labeller.web.app">
                    https://launch-control-labeller.web.app
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Controller diagram */}
      <LaunchControlXL labelInputRef={labelInputRef} />
      {/* Panel with load, save and label edit functionality. */}
      <EditPanel
        onLabelInputRef={(labelInputRef) => setLabelInputRef(labelInputRef)}
      />
    </div>
  );
};

export default App;
