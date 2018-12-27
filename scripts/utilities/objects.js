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
        //if (this.chosen) this.x = mouse.x, this.y = mouse.y, mouse.holding = true;
    }
}

class object {
    constructor(x, y, zIndex, width, height, hitbox_color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.gravity = 9.82;
        this.chosen = false;
        this.zIndex = zIndex;
        this.hitbox = new rectAngle(this.x, this.y, this.width, this.height, hitbox_color, false);
        this.distanceX = undefined;
        this.distanceY = undefined;
    }
    draw(){
        //this.hitbox.draw();
    }
    update(dt) {
        if (this.chosen) {
            this.hitbox.draw()
            //this.x = mouse.x - ((this.hitbox.x - this.x) + this.hitbox.width/2);
            //this.y = mouse.y - ((this.hitbox.y - this.y) + this.hitbox.height/2);
            if (editor.UI.followMouse) {
                if(this.distanceX == undefined && this.distanceY == undefined) {
                    this.distanceX = this.x - editor.UI.mousePoint.x;
                    this.distanceY = this.y - editor.UI.mousePoint.y;
                }
                this.x = mouse.x + this.distanceX;
                this.y = mouse.y + this.distanceY;
            }
        }
        if(!editor.UI.followMouse){
             this.distanceX = undefined;
             this.distanceY = undefined;
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
    updateImgHitbox(imageFilename, scale) {
        let fullname = imageFilename + ".png";
        this.hitbox.x = this.x + hitboxArray[0][fullname].x * scale;
        this.hitbox.y = this.y + hitboxArray[0][fullname].y * scale;
        this.hitbox.width = hitboxArray[0][fullname].width * scale;
        this.hitbox.height = hitboxArray[0][fullname].height * scale;
    }
    updateSheetHitbox(imageFilename, scale) {
        let fullname = this.itarater +"."+ imageFilename + ".png";
        //if (this.loopImages == this.idle) fullname = this.itarater + "." + fullname;
        //else fullname = this.itarater + 3 + "." + fullname;
        this.hitbox.x = this.x + hitboxArray[0][fullname].x*scale;
        this.hitbox.y = this.y + hitboxArray[0][fullname].y*scale;
        this.hitbox.width = hitboxArray[0][fullname].width*scale;
        this.hitbox.height = hitboxArray[0][fullname].height*scale;
    }
}

class static_tile extends object {
    constructor(img, hitbox_imageFilename, hitbox_scale, x, y, zIndex, width, height, cols, rows, scale, type) {
        super(x, y, zIndex, width, height, "blue");
        this.images = this.createImages(img, cols, rows, scale, false);
        this.type = type;
        this.hitbox_scale = hitbox_scale;
        this.hitbox_imageFilename = hitbox_imageFilename;
        this.itarater = 0;
    }

    draw() {
        this.images[this.type].draw();
        super.draw();
    }
    update(dt) {
        this.images[this.type].update(this.x, this.y);
        super.update(dt);
        this.updateSheetHitbox(this.hitbox_imageFilename, this.hitbox_scale);
    }
}

class floor extends static_tile {
    constructor(x, y, type) {
        super(floors, "floor(13x1)", 0.5, x, y, 0, 100, 100, 13, 1, 0.5, type);
    }
    draw() {
        super.draw();
    }
    update(dt) {
        super.update();
    }
}
