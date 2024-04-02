let controlPressed = false;
let shiftPressed = false;

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


// Polling function to check for gamepad inputs
function pollGamepad() {
    const gamepad = navigator.getGamepads()[0]; // Assuming the first gamepad is the one we're interested in
    if (!gamepad) return;

    // Check each button
    gamepad.buttons.forEach((button, index) => {
        if (button.pressed) {
            if (buttonMap[index]) {
                const actionKey = buttonMap[index];
                document.dispatchEvent(new KeyboardEvent('keydown', {'key': actionKey}));
            }
            if (index === 4) shiftPressed = true; // L1
            if (index === 5) controlPressed = true; // R1
        } else {
            if (index === 4) shiftPressed = false; // L1
            if (index === 5) controlPressed = false; // R1
        }
    });

    // Check D-pad
    Object.keys(dpadMap).forEach(dpadIndex => {
        if (gamepad.buttons[dpadIndex].pressed) {
            const actionKey = dpadMap[dpadIndex];
            document.dispatchEvent(new KeyboardEvent('keydown', {'key': actionKey}));
        }
    });

    // Analog sticks can be mapped here similarly if needed

    requestAnimationFrame(pollGamepad); // Continue polling
}

// Start polling for gamepad input
window.addEventListener('load', () => {
    pollGamepad();
});
