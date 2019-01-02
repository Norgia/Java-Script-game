let game = new Object();
game.start = undefined;
game.background = {
    color: "white"
};

game.init = function () {
    game.start = Date.now();
    editor.UI.init();
}

game.loop = {
    lastTime: undefined,
    accumulator: 0,
    step: 1 / 240,
    fps: 0,
};

game.utils = {
    enabled: true,
    draw: function () {
        utilityObjects.forEach(object => {
            object.draw();
        });
    },
    update: function () {
        utilityObjects.forEach(object => {
            object.update();
        });
        editor.UI.update();
    }
}

game.physicsEngine = function () {

}

game.camera = new rectAngle(0, 0, 1920-400, 1080-400, "orange", false);
game.camera.lastPos = {
    x: game.camera.x,
    y: game.camera.y
};
game.camera.update = function (dt) {
    //Move camera after plaeyer pos
    if (editor.UI != undefined && editor.UI.changeBackgroundSlider.value == "true") {
        game.camera.x = 0;
        game.camera.y = 0;
    }   
    else {
        //Motion effect
        this.lastPos.x += ((hero.x - game.camera.width / 2) - this.lastPos.x) * 0.01;
        this.lastPos.y += ((hero.y - game.camera.height / 2) - this.lastPos.y) * 0.01;
        game.camera.x = this.lastPos.x;
        game.camera.y = this.lastPos.y;
    }
    //Check bounds of caemra
    if (game.camera.x < 0) game.camera.x = 0;
    if (game.camera.y < 0) game.camera.y = 0;
    if (game.camera.x + game.camera.width > window.innerWidth) game.camera.x = window.innerWidth - game.camera.width;
    if (game.camera.y + game.camera.height > window.innerHeight) game.camera.y = window.innerHeight - game.camera.height;
}

game.draw = function () {
    physicalObjects.sort(function (a, b) {
        return a.zIndex - b.zIndex;
    });
    physicalObjects.forEach(object => {
        object.draw();
    });
    drawGrid();
    if (game.utils.enabled) game.utils.draw();
    //mouse.draw();
}

game.update = function (dt) {
    c.clearRect(0, 0, innerWidth, innerHeight);
    c.fillStyle = game.background.color;
    c.fillRect(0, 0, window.innerWidth, window.innerHeight);
    physicalObjects.forEach(object => {
        object.update(dt);
    });
    if (game.utils.enabled) game.utils.update();
    game.camera.update(dt);
}

game.animate = function (millis) {
    if (game.loop.lastTime) {
        game.loop.accumulator += (millis - game.loop.lastTime) / 1000;
        while (game.loop.accumulator > game.loop.step) {
            game.update(game.loop.step);
            game.loop.accumulator -= game.loop.step;
        }
        game.draw();
    }
    game.loop.lastTime = millis;
    window.requestAnimationFrame(game.animate);
}
