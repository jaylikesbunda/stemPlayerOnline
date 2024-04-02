let controlPressed = false;
let shiftPressed = false;
const buttonPressedState = {};

const handleLoopModeKey = (key) => {
        let curSpeedIndex = Number(audio.playbackRate / 0.5);
        if (key == "ArrowUp") {
                if (loop.loopDuration != 8) loop.setLoop(loop.loopDuration);
        } else if (key == "ArrowDown") {
                if (loop.loopDuration != 1) loop.setLoop(loop.loopDuration-2);
        } else if (key == "ArrowLeft") {
                if (curSpeedIndex != 1) loop.setSpeed('right', curSpeedIndex-1);
        } else if (key == "ArrowRight") {
                if (curSpeedIndex != 4) loop.setSpeed('right', curSpeedIndex+1);
        }
};

const handleStandardKey = (key) => {
        if (key.substring(0,5) != "Arrow") return;

        let dir;
        if (key == "ArrowRight") dir = "right";
        else if (key == "ArrowUp") dir = "top";     
        else if (key == "ArrowLeft") dir = "left";
        else if (key == "ArrowDown") dir = "bottom";
        dirLevel = levels[sliderNames.indexOf(dir)];
        if (shiftPressed) {
                console.log("isolating")
                isolateStem(dir);
        } else if (controlPressed && dirLevel != 1)
                handleLightTap(dir, (dirLevel-1).toString());
        else if (!controlPressed && dirLevel != 4)
                handleLightTap(dir, (dirLevel+1).toString());
}

// Mapping of PS4 controller buttons to actions
const buttonMap = {
    0: 'x', // Cross - Presses the left dot button
    1: ' ', // Circle - Presses the center button
    2: 'a', // Square - Presses the minus button
    3: 's', // Triangle - Presses the plus button
    8: 'q', // Share - Presses the menu button
    9: ' ', // Options - Also presses the center button for redundancy
    // L1 (4) and R1 (5) will be used as modifiers (Shift and Control respectively) in the polling function.
};

// Mapping of D-pad and analog sticks to Arrow Keys - You might need to adjust based on your testing.
const dpadMap = {
    12: 'ArrowUp',
    13: 'ArrowDown',
    14: 'ArrowLeft',
    15: 'ArrowRight',
};

let dpadHold = {
    'ArrowUp': false,
    'ArrowDown': false,
    'ArrowLeft': false,
    'ArrowRight': false,
};

document.addEventListener("keydown", (e) => {
        const key = e.key;
        if (key == " ") {
                centerButtonPressed();
        } else if (key == "Control") {
                controlPressed = true;
        } else if (key == "Shift") {
                shiftPressed = true;
        } else if (key == "z") {
                leftDotPress();
        } else if (key == "x") {
                rightDotPress();
        } else if (key == "a") {
                minusPressed();
        } else if (key == "s") {
                plusPressed();
        } else if (key == "q") {
                menuPressed();
        } else {
                loop.inLoopMode ? handleLoopModeKey(key) : handleStandardKey(key);
        }
})
 
document.addEventListener("keyup", (e) => {
        if (e.key == "Control") controlPressed = false;
        else if (e.key == "Shift") shiftPressed = false;
});


function updateButtonState(gamepad) {
    gamepad.buttons.forEach((button, index) => {
        const currentState = button.pressed;
        if (buttonPressedState[index] !== currentState) {
            buttonPressedState[index] = currentState;
            if (currentState) {
                handleButtonPress(index, true); // Button pressed
            } else {
                handleButtonPress(index, false); // Button released
            }
        }
    });
}

function handleButtonPress(index, isPressed) {
    const directionMap = {
        12: "top",
        13: "bottom",
        14: "left",
        15: "right"
    };

    const direction = directionMap[index];

    // Use a toggle state to remember if an action is active
    if (!window.toggleState) {
        window.toggleState = {
            "top": false,
            "bottom": false,
            "left": false,
            "right": false
        };
    }

    if (direction) {
        if (isPressed) {
            // Toggle the action state for the direction
            window.toggleState[direction] = !window.toggleState[direction];

            if (window.toggleState[direction]) {
                // If toggled on, perform the action
                console.log("Activating action for direction:", direction);
                isolateStem(direction); // Activate the action for this direction
            } else {
                // If toggled off, undo the action
                console.log("Deactivating action for direction:", direction);
                cancelIsolation(direction); // Deactivate or undo the action
            }
        }
        // No need to handle button release separately for toggle functionality
    } else {
        // For other buttons, handle press and release actions
        const actionKey = buttonMap[index];
        if (actionKey) {
            if (isPressed) {
                document.dispatchEvent(new KeyboardEvent('keydown', { 'key': actionKey }));
            } else {
                document.dispatchEvent(new KeyboardEvent('keyup', { 'key': actionKey }));
            }
        }
    }
}



// Improved polling function to check for gamepad inputs
function pollGamepads() {
  const gamepads = navigator.getGamepads();
  for (const gamepad of gamepads) {
    if (gamepad) {
      updateButtonState(gamepad);
      // Additional logic for D-pad and analog sticks can be added here
    }
  }
  requestAnimationFrame(pollGamepads);
}

// Handling gamepad connection
window.addEventListener('gamepadconnected', (e) => {
  console.log(`Gamepad connected at index ${e.gamepad.index}: ${e.gamepad.id}.`);
  pollGamepads(); // Start polling when a gamepad is connected
});

// Optional: Handling gamepad disconnection
window.addEventListener('gamepaddisconnected', (e) => {
  console.log(`Gamepad disconnected from index ${e.gamepad.index}: ${e.gamepad.id}.`);
  // Here you might want to update your application state or UI to reflect the disconnection
});
