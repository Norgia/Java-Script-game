let game = new Object();
game.start = undefined;

game.init = function() {
  game.start = Date.now();
}

game.frames = {
  delta: undefined,
  lastCalledTime: undefined,
  fps: undefined,
  update: function () {
    if (!game.frames.lastCalledTime) {
      game.frames.lastCalledTime = Date.now();
      game.frames.fps = 0;
      return;
    }

    game.frames.delta = (Date.now() - game.frames.lastCalledTime);
    game.frames.lastCalledTime = Date.now();
    game.frames.fps = 1 / (game.frames.delta / 1000);
    Math.ceil(game.frames.fps);
  },
};

game.loop = {
  lastTime: undefined,
  accumulator: 0,
  step: 1/60,
};

game.physicsEngine = function() {
  
}

game.draw = function() {
  physicalObjects.forEach(object => {
    object.draw();
  });
}

game.update = function (dt) {
  c.clearRect(0, 0, innerWidth, innerHeight);
  physicalObjects.forEach(object => {
    object.update(dt);
  });
  game.frames.update();
}

game.animate = function(millis) {
  if(game.loop.lastTime) {
    game.loop.accumulator += (millis - game.loop.lastTime)/1000;
    while (game.loop.accumulator > game.loop.step) {
      game.update(game.loop.step);
      game.loop.accumulator -= game.loop.step;
    }
    game.draw();
  }
  game.loop.lastTime = millis;
  window.requestAnimationFrame(game.animate);
}

game.init();
game.animate();
