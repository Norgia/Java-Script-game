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
        //this.chosen = false;
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
        //if (this.chosen) this.x = mouse.x, this.y = mouse.y, mouse.holding = true;
    }
}

class circle {
    constructor(x, y, radius, startA, endA, color, fill) {
        this.x = x;
        this.y = y;
        this.startA = startA;
        this.endA = endA;
        this.radius = radius;
        this.color = color;
        this.fill = fill;
    }
    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, this.startA, this.endA, true);
        if (this.fill) {
            c.fillStyle = this.color;
            c.fill();
        } else {
            c.strokeStyle = this.color;
            c.stroke();
        }
    }
    update(dt) {
        //if (this.chosen) this.x = mouse.x, this.y = mouse.y, mouse.holding = true;
    }
}

class object {
    constructor(x, y, zIndex, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.gravity = 9.82;
        this.chosen = false;
        this.zIndex = zIndex;
        this.hitbox = new rectAngle(undefined, undefined, undefined, undefined, "black", false);
    }
    draw(){
        this.hitbox.draw();
    }
    update(dt) {
        if (this.chosen) {
            this.x = mouse.x - this.width/2;
            this.y = mouse.y - this.height/2;
            mouse.holding = true;
        }
    }
    createImages(spriteSheet, amountX, amountY, scale, reverse) {
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
}

class tile extends object {
    constructor(img, x, y, zIndex, width, height, cols, rows, scale, type) {
        super(x, y, zIndex, width, height);
        this.images = this.createImages(img, cols, rows, scale, false);
        this.type = type;
    }
    draw() {
        this.images[this.type].draw();
    }
    update(dt) {
        this.images[this.type].update(this.x, this.y);
    }
}

class floor extends tile {
    constructor(x, y, type) {
        super(floors, x, y, 0, 100, 100, 13, 1, 0.5, type);
    }
    draw() {
        super.draw();
    }
    update(dt) {
        super.update();
    }
}