let game = new Object();
game.start = undefined;
game.background = {
  color: "white"
};

game.init = function() {
  game.start = Date.now();
  editor.UI.init();
}

game.loop = {
  lastTime: undefined,
  accumulator: 0,
  step: 1/240,
  fps: 0,
};

game.utils = {
  enabled: true,
  draw: function() {
    utilityObjects.forEach(object => {
      object.draw();
    });
  },
  update: function() {
     utilityObjects.forEach(object => {
       object.update();
     });
     editor.UI.update();
  }
}

game.physicsEngine = function() {
  
}

game.draw = function() {
  physicalObjects.sort(function (a, b) {
    return a.zIndex - b.zIndex;
  });
  physicalObjects.forEach(object => {
    object.draw();
  });
  c.globalAlpha = 0.25;
  if (editor.UI.showGridSlider.value == "true") c.drawImage(grid_image, 0, 0);
  c.globalAlpha = 1;
  if(game.utils.enabled) game.utils.draw();
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
