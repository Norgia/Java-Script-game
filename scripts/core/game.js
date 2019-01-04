let game = new Object();
game.start = undefined;
game.background = {
    color: "black"
};

game.init = function () {
    game.start = Date.now();
    //editor.UI.init();
    buildRoomFromData(test_map_2);
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
    update: function (dt) {
        utilityObjects.forEach(object => {
            object.update(dt);
        });
    }
}

game.physicsEngine = function () {

}

game.camera = new rectAngle(0, 0, 800, 800, "orange", false);
game.camera.lastPos = {
    x: game.camera.x,
    y: game.camera.y
};
game.camera.padding = {
    x: 100,
    y:-200
};
game.camera.boundBox = new rectAngle(game.camera.padding.x, game.camera.padding.y, window.innerWidth - 2*game.camera.padding.x, window.innerHeight - 2*game.camera.padding.y, "orange", false);

game.camera.update = function (dt) {
    //Move camera after plaeyer pos
    if (editor.UI != undefined && editor.UI.changeBackgroundSlider.value == "true") {
        game.camera.x = 0;
        game.camera.y = 0;
    }   
    else {
        //Motion effect
        //Hardcoded camera center values;
        this.lastPos.x += ((hero.x - 1.18*game.camera.width) - this.lastPos.x) * 0.01;
        if(window.innerHeight == 969) this.lastPos.y += ((hero.y - game.camera.height/1.8) - this.lastPos.y) * 0.01;
        else if (window.innerHeight == 1080) this.lastPos.y += ((hero.y - game.camera.height / 1.585) - this.lastPos.y) * 0.01;
       
        game.camera.x = this.lastPos.x;
        game.camera.y = this.lastPos.y;
    }
    //Check bounds of caemra
    if (game.camera.x < game.camera.boundBox.x) game.camera.x = game.camera.boundBox.x; 
    if (game.camera.y < game.camera.boundBox.y) game.camera.y = game.camera.boundBox.y;
    if (game.camera.x + game.camera.width > game.camera.boundBox.x + game.camera.boundBox.width) game.camera.x = game.camera.boundBox.x + game.camera.boundBox.width - game.camera.width;
    if (game.camera.y + game.camera.height > game.camera.boundBox.y + game.camera.boundBox.height) game.camera.y = game.camera.boundBox.y + game.camera.boundBox.height - game.camera.height;
}



game.draw = function () {
    physicalObjects.sort(function (a, b) {
        return a.zIndex - b.zIndex;
    });
    physicalObjects.forEach(object => {
        object.draw();
        object.infomrationBox.draw(object.hitbox, object);
    });
    if (editor.UI.inited) {
        if (game.utils.enabled) {
            drawGrid();
            drawCamera(editor.UI.cameraState);
            game.utils.draw();
        }
    }
    //mouse.draw();
}

game.update = function (dt) {
    c.clearRect(0, 0, innerWidth, innerHeight);
    c.fillStyle = game.background.color;
    c.fillRect(0, 0, window.innerWidth, window.innerHeight);
    physicalObjects.forEach(object => {
        object.update(dt);
    });
    if (game.utils.enabled) {
        if (editor.UI.inited) editor.UI.update(dt);
        game.utils.update(dt);   
    }
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
