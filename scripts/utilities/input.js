let KEY = {
    LEFT: 65,
    RIGHT: 68,
    UP: 87,
    DOWN: 83,
    JUMP: undefined,
    ESCAPE: 27
};

document.onkeydown = function (evt) { 
    togglekey(evt.keyCode, true);
}

document.onkeyup = function (evt) {
    togglekey(evt.keyCode, false);
}

let controller = {
    left: false,
    right: false,
    up: false,
    down: false,
    jump: false,
    paused: false
};

function setPaused(v) {
    controller.paused = v;
    if (v) {
        //Pause
    } else {
        //Play
    }
}

function togglekey(keyCode, isPressed) {
    if (keyCode == KEY.LEFT) {
        controller.left = isPressed;
    }
    if (keyCode == KEY.RIGHT) {
        controller.right = isPressed;
    }
    if (keyCode == KEY.UP) {
        controller.up = isPressed;
    }
    if (keyCode == KEY.DOWN) {
        controller.down = isPressed;
    }
    if (keyCode == KEY.ESCAPE && isPressed) {
        setPaused(!controller.paused);
    }
}

