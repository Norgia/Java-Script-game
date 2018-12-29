//canvas:
var canvas = document.querySelector("canvas");
var c = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//Functions:
function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)];
}

function distance(x1, y1, x2, y2) {
    const xDist = x2 - x1;
    const yDist = y2 - y1;

    return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}

//loaded Utils:
const colors = ["#42ebf4", "#00cdf2", "#b8ecf9", "#e1f2f7", "#00a1ff"];

//Objects:
const mouse = {
    x: innerWidth / 2,
    y: innerHeight / 2,
    width: 0,
    height: 0,
    pressed: false,
    clicked: false,
    haveClicked: false,
    holding: false,
    follow: false,
    image: cursor_image,
    draw: function() {
        c.drawImage(this.image, this.x - this.image.width/7, this.y - this.image.height/7);
    }
};

function subImg(spriteSheet, sx, sy, sWidth, sHeight, dx, dy, scale, dWidth, dHeight) {
    this.spriteSheet = spriteSheet;
    this.sx = sx;
    this.sy = sy;
    this.sWidth = sWidth;
    this.sHeight = sHeight;
    this.scale = scale;
    this.dx = dx;
    this.dy = dy;
    this.firstDWidth = dWidth;
    this.firstDheight = dHeight;
    this.dWidth = this.firstDWidth * this.scale;
    this.dHeight = this.firstDheight * this.scale;
    
    this.draw = function () {
        c.drawImage(this.spriteSheet, this.sx, this.sy, this.sWidth, this.sHeight, this.dx, this.dy, this.dWidth, this.dHeight);
    }
    this.rotationDraw = function (x, y) {
        c.drawImage(this.spriteSheet, this.sx, this.sy, this.sWidth, this.sHeight, x, y, this.dWidth, this.dHeight);
    }

    this.update = function (x, y) {
        this.dx = x;
        this.dy = y;
        this.dWidth = this.firstDWidth * this.scale;
        this.dHeight = this.firstDheight * this.scale;
    }
}

function img(img, dx, dy, dWidth, dHeight, scale) {
    this.img = img;
    this.dx = dx;
    this.dy = dy;
    this.firstDWidth = dWidth;
    this.firstDheight = dHeight;
    this.scale = scale;
    this.dWidth = this.firstDWidth*this.scale;
    this.dHeight = this.firstDheight*this.scale;

    this.draw = function() {
        c.drawImage(this.img, this.dx, this.dy, this.dWidth, this.dHeight);
    }
     
    this.update = function (x, y) {
         this.dx = x;
         this.dy = y;
         this.dWidth = this.firstDWidth * this.scale;
         this.dHeight = this.firstDheight * this.scale;
    }
}

function vector2D(dx, dy) {
    this.dx = dx;
    this.dy = dy;
    this.resultant = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

    this.limitResultant = function () {
        if (this.resultant == Math.abs(this.dx) || this.resultant == Math.abs(this.dy)) return this;
        else {
            let componentX = this.dx / Math.sqrt(2);
            let componentY = this.dy / Math.sqrt(2);
            return new vector2D(componentX, componentY);
        }
    }

    this.update = function () {
        this.resultant = Math.sqrt(Math.pow(this.dx, 2) + Math.pow(this.dy, 2));
        this.dx = 0;
        this.dy = 0;
    }
}

function colision(object1, object2) {
    if (object1.x < object2.x + object2.width && object1.x + object1.width > object2.x &&
        object1.y < object2.y + object2.height && object1.y + object1.height > object2.y) {
        return true;
    }
    else return false;
}

// Event Listeners:
addEventListener("mousemove", event => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

addEventListener("resize", () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
});

function makeFloor() {
    let padding = 32;
    let width = window.innerWidth;
    let height = window.innerHeight;
    for (let x = -20; x < width; x += padding) {
        for(let y = -20; y < height; y+=padding) {
            physicalObjects.push(new floor(x, y, randomIntFromRange(0, 0)));
        }
    }
}

function createImages(spriteSheet, amountX, amountY, scale, reverse) {
    let Images = [];

    for (let y = 0; y < spriteSheet.height; y += spriteSheet.height / amountY) {
        if (!reverse) {
            for (let x = 0; x < spriteSheet.width; x += spriteSheet.width / amountX) {
                Images.push(new subImg(spriteSheet, x, y, spriteSheet.width / amountX, spriteSheet.height / amountY, this.x, this.y, scale, spriteSheet.width / amountX, spriteSheet.height / amountY));
            }
        } else {
            for (let x = spriteSheet.width; x > 0; x -= spriteSheet.width / amountX) {
                Images.push(new subImg(spriteSheet, x, y, -spriteSheet.width / amountX, spriteSheet.height / amountY, this.x, this.y, scale, spriteSheet.width / amountX, spriteSheet.height / amountY));
            }
        }
    }
    return Images;
}

class rectAngle {
    constructor(x, y, width, height, color, fill) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.fill = fill;
    }
    draw() {
        c.beginPath();
        c.rect(this.x, this.y, this.width, this.height);
        if (this.fill) {
            c.fillStyle = this.color;
            c.fill();
        } else {
            c.strokeStyle = this.color;
            c.stroke();
        }
    }
    update(dt) {

    }
}

class circle {
    constructor(x, y, radius, startA, endA, color, fill, blur) {
        this.x = x;
        this.y = y;
        this.startA = startA;
        this.endA = endA;
        this.radius = radius;
        this.color = color;
        this.fill = fill;
        this.blur = blur;
    }
    draw() {
        c.beginPath();
        if (this.blur) c.filter = "blur(10px)";
        c.arc(this.x, this.y, this.radius, this.startA, this.endA, true);
        if (this.fill) {
            c.fillStyle = this.color;
            c.fill();
        } else {
            c.strokeStyle = this.color;
            c.stroke();
        }
        c.filter = "none";
    }
    update(dt) {
        
    }
}
