const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class object {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.hitbox = {
            x: undefined,
            y: undefined,
            width: undefined,
            height: undefined
        };
    }
    draw() {

    }
    update() {

    }
}

class rectAngle extends object {
    constructor(x, y, width, height, color, fill) {
        super(x, y, width, height, color)
        this.fill = fill;
        this.color = color;
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

    log(test) {
        return test;
    }
    update() {

    }
}

let rect1 = new rectAngle(100, 100, 100, 100, "red", true);
rect1.draw();

