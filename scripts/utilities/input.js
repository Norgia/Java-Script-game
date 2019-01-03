let KEY = {
    LEFT: 65,
    RIGHT: 68,
    UP: 87,
    DOWN: 83,
    ARROWLEFT: 37,
    ARROWRIGHT: 39,
    ARROWUP: 38,
    ARROWDOWN: 40,
    JUMP: undefined,
    TAB: 9,
    ESCAPE: 27,
    DELETE: 46,
    CTRL: 17,
    Z: 90
};

document.onkeydown = function (evt) { 
    togglekey(evt.keyCode, true);
}

document.onkeyup = function (evt) {
    togglekey(evt.keyCode, false);
}

document.onmousedown = function() {
    mouse.pressed = true;
}

document.onmouseup = function () {
    mouse.pressed = false;
    mouse.clicked = false;
}

let controller = {
    left: false,
    right: false,
    up: false,
    arrowLeft: false,
    arrowRight: false,
    arrowUp: false,
    arrowDown: false,
    del: false,
    down: false,
    jump: false,
    paused: false,
    tab: false,
    ctrl: false,
    z: false
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
    if(keyCode == KEY.ARROWLEFT) {
        controller.arrowLeft = isPressed;
    }
    if (keyCode == KEY.ARROWRIGHT) {
        controller.arrowRight = isPressed;
    }
    if (keyCode == KEY.ARROWUP) {
        controller.arrowUp = isPressed;
    }
    if (keyCode == KEY.ARROWDOWN) {
        controller.arrowDown = isPressed;
    }
    if (keyCode == KEY.CTRL) {
        controller.ctrl = isPressed;
    }
    if (keyCode == KEY.Z) {
        controller.z = isPressed;
    }
    if (keyCode == KEY.DELETE) {
        controller.del = isPressed;
    }
    if (keyCode == KEY.TAB) {
        controller.tab = isPressed;
    }
    if (keyCode == KEY.ESCAPE && isPressed) {
        setPaused(!controller.paused);
    }
}

