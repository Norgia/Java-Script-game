let physicalObjects = [];
let utilityObjects = [];

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
    update() {

    }
}

class object {
    constructor(x, y, zIndex, hX, hY, hWidth, hHeight, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.gravity = 9.82;
        this.zIndex = zIndex; 
        this.hitbox = {
            x: hX,
            y: hY,
            width: hWidth,
            height: hHeight,
            rect: new rectAngle(this.x, this.y, this.width, this.height),
        };
    }
    draw(){
        this.hitbox.rect.draw();
    }
    updateHitbox(x, y, w, h) {
        this.hitbox.rect.x = x;
        this.hitbox.rect.y = y;
        this.hitbox.rect.width = w;
        this.hitbox.rect.height = h;
    }
}
