const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var colors = ['#4dff4d', '#0099ff', '#ff3300', '#a6a6a6'];

function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function circle(x, y, radius, color) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.color = color;
  this.velocity = {
    x: Math.random() * 2,
    y: Math.random() * 2
  };

  this.draw = function() {
    c.beginPath();
    c.arc(this.x, this.x, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.stroke();
    c.closePath();
  }

  this.update = function() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;

    if(this.x - this.radius < 0 || this.x + this.radius > window.innerWidth) this.dx*=-1;
    if(this.y - this.radius < 0 || this.y + this.radius > window.innerHeight) this.dx*=-1;
  }
}

let circles = [];

for (var i = 0; i < 100; i++) {
  let x = Math.random() * window.innerWidth;
  let y = Math.random() * window.innerHeight;
  let radius = Math.random() * 10;
  let color = colors[randomIntFromRange(0, colors.length - 1)];
  circles.push(new circle(x, y, radius, color));
}


function animate() {
  c.clearRect(0, 0, innerWidth, innerHeight);
  circles.forEach(circle => {
    circle.draw();
    circle.update();
  });
  window.requestAnimationFrame(animate);
}

animate();

/*
function nugget(name, age) {
  this.name = name;
  this.age = age;

  this.say = function() {
    console.log("MY NAME IS " + this.name + " AND I AM " + this.age + " YEARS OLD");
  }
}

let nuggets = [];
let garden = new nugget("AXEL", 19);
let busken = new nugget("VIKTOR", 19);
let holdsen = new nugget("FREDRIK", 21);

nuggets.push(garden, busken, holdsen);

nuggets.forEach(nugget => {
    nugget.say();
});
*/
