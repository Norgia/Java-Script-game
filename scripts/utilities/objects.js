let physicalObjects = [];
let utilityObjects = [];

class object {
    constructor(x, y, zIndex, width, height, hitbox_color) {
        this.x = x;
        this.y = y;
        this.dest = {
            x: this.x - game.camera.x,
            y: this.y - game.camera.y
        };
        this.width = width;
        this.height = height;
        this.gravity = 9.82;
        this.chosen = false;
        this.zIndex = zIndex;
        this.hitbox = new rectAngle(this.x, this.y, this.width, this.height, hitbox_color, false);
        this.distanceX = undefined;
        this.distanceY = undefined;
        this.infomrationBox = {
            width: 200,
            height: 200,
            rect: new rectAngle(this.x - 100, this.y - 100, 100, 100, "rgb(100, 153, 232, 0.3)", true),
            show: false,
            draw: function(hitbox, self) {
                if(this.show) {
                    this.rect.draw();
                    c.strokeStyle = "rgb(100, 153, 232, 0.3)";
                    c.lineWidth = 2;
                    c.beginPath();
                    c.moveTo(hitbox.x + hitbox.width/2, hitbox.y);
                    c.lineTo(this.rect.x, this.rect.y + this.rect.height);
                    c.stroke();
                    c.lineWidth = 1;

                    c.beginPath();
                    c.font = "small-caps 10px Arial";
                    c.fillStyle = "rgb(189, 153, 232, 0.8)";
                    let padding = 15;
                    c.fillText("Object: " + physicalObjects.indexOf(self), this.rect.x + padding / 2, this.rect.y + padding);
                    c.fillText("Hitbox x: " + Math.round(hitbox.x), this.rect.x + padding/2, this.rect.y + 2*padding);
                    c.fillText("Hitbox y: " + Math.round(hitbox.y), this.rect.x + padding/2, this.rect.y + 3 * padding);
                    c.fillText("Hitbox width: " + Math.round(hitbox.width), this.rect.x + padding/2, this.rect.y + 4 * padding);
                    c.fillText("Hitbox height: " + Math.round(hitbox.height), this.rect.x + padding/2, this.rect.y + 5 * padding);
                    c.fillText("Z-index: " + self.zIndex, this.rect.x + padding/2, this.rect.y + 6 * padding);
                }
            },
            update: function(dt, self) {
                this.rect.x = self.dest.x + self.width + 10;
                this.rect.y = self.dest.y - 100;
            }
        };
    }
    draw(){
        //this.infomrationBox.draw(this.hitbox, this);
    }
    update(dt) {
        if (this.chosen && game.utils.enabled) {
            this.infomrationBox.update(dt, this);
            this.hitbox.draw();
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
        this.dest.x = Math.round(this.x - game.camera.x);
        this.dest.y = Math.round(this.y - game.camera.y);
    }
    updateImgHitbox(imageFilename, scale) {
        let fullname = imageFilename + ".png";
        this.hitbox.x = this.dest.x + hitboxArray[0][fullname].x * scale;
        this.hitbox.y = this.dest.y + hitboxArray[0][fullname].y * scale;
        this.hitbox.width = hitboxArray[0][fullname].width * scale;
        this.hitbox.height = hitboxArray[0][fullname].height * scale;
    }
    updateSheetHitbox(imageFilename, scale) {
        let fullname = this.itarater +"."+ imageFilename + ".png";
        //if (this.loopImages == this.idle) fullname = this.itarater + "." + fullname;
        //else fullname = this.itarater + 3 + "." + fullname;
        this.hitbox.x = this.dest.x + hitboxArray[0][fullname].x*scale;
        this.hitbox.y = this.dest.y + hitboxArray[0][fullname].y*scale;
        this.hitbox.width = hitboxArray[0][fullname].width*scale;
        this.hitbox.height = hitboxArray[0][fullname].height*scale;
    }
}

