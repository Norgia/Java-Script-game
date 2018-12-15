class character extends object {
    constructor(x, y, zIndex, hitbox_imageFilename, hitbox_color, images, flippedImages, imagesDmg, flippedImagesDmg, cols, rows, scale, idle, run, moveAmount, hp) {
        super(x, y, zIndex, undefined, undefined, hitbox_color);
        this.hitbox_imageFilename = hitbox_imageFilename;
        this.scale = scale;
        this.images = this.createImages(images, cols, rows, scale, false);
        this.flippedImages = this.createImages(flippedImages, cols, rows, scale, true);
        this.imagesDmg = this.createImages(imagesDmg, cols, rows, scale, false);
        this.flippedImagesDmg = this.createImages(flippedImagesDmg, cols, rows, scale, true);
        
        this.center = {
            x: this.x + this.width/2,
            y: this.y + this.height/2
        };
        this.currentImages = this.images;
        this.idle = idle;
        this.run = run;
        this.loopImages = this.idle;
        this.itarater = 0;
        this.currentFrame = this.currentImages[this.loopImages[0]];
        this.width = this.currentFrame.dWidth;
        this.height = this.currentFrame.dHeight;
        this.loopIndex = undefined;
        this.frameCount = 0;
        this.delayCount = 20;
        this.HP = hp;
        this.attacking = false;
        this.img = {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
        this.damage = {
            take: function (self, enemy) {
                self.HP -= enemy.damage.amount;
            }
        };
        this.periphery = new circle();
        this.perceptonRadius = 300;
        this.direction = {
            moving: {
                RIGHT: false,
                UP: false,
                LEFT: false,
                DOWN: false,
                reset: function() {
                    this.RIGHT = false;
                    this.UP = false;
                    this.LEFT = false;
                    this.DOWN = false;
                },
            },
            horizontal: "RIGHT",
            angle: 0
        };
        this.movmentVector2D = new vector2D(0, 0);

        this.move = {
            amount: moveAmount,
            now: false,
            none: function(self) {
                self.loopImages = self.idle;
            },
            right: function (dt, self) {
                self.direction.moving.RIGHT = true;
                self.direction.horizontal = "RIGHT";
                this.now = true;
                self.currentImages = self.images;
                self.loopImages = self.run;
                self.movmentVector2D.dx += this.amount;
                let vector = self.movmentVector2D.limitResultant();
                self.x += vector.dx * dt;
            },
            left: function (dt, self) {
                self.direction.moving.LEFT = true;
                self.direction.horizontal = "LEFT";
                this.now = true;
                self.currentImages = self.flippedImages;
                self.loopImages = self.run;
                self.movmentVector2D.dx -= this.amount;
                let vector = self.movmentVector2D.limitResultant();
                self.x += vector.dx * dt;
            },
            up: function (dt, self) {
                self.direction.moving.UP = true;
                this.now = true;
                self.loopImages = self.run;
                self.movmentVector2D.dy -= this.amount;
                let vector = self.movmentVector2D.limitResultant();
                self.y += vector.dy * dt;
            },
            down: function (dt, self) {
                self.direction.moving.DOWN = true;
                this.now = true;
                self.loopImages = self.run;
                self.movmentVector2D.dy += this.amount;
                let vector = self.movmentVector2D.limitResultant();
                self.y += vector.dy * dt;
            }
        };
    }

    updateImages() {
        if (this.currentFrame != undefined) {
            this.img.width = this.currentFrame.dWidth;
            this.img.height = this.currentFrame.dHeight;
            this.center.x = this.currentFrame.dx + this.img.width/2;
            this.center.y = this.currentFrame.dy + this.img.height/2;
        }
    }

    animate(dt) {
        this.frameCount++;

        if(this.frameCount > this.delayCount) {
            this.frameCount = 0;
            if(this.loopIndex >= this.loopImages[this.loopImages.length - 1] || this.loopImages[this.itarater] == undefined) {
                this.itarater = 0;
            }
            if (!this.move.now) hero.move.none(this);
            this.loopIndex = this.loopImages[this.itarater];
            this.currentFrame = this.currentImages[this.loopIndex];
            this.itarater++;
        }
        this.move.now = false;
        this.movmentVector2D.update();
        this.updateSheetHitbox();
        super.update(dt);
        if (this.currentFrame != undefined) this.currentFrame.update(this.x, this.y);
    }
    updateAngle() {
         let halfQarter = Math.PI / 4;
         //RIGHT AND UP
         if (this.direction.moving.RIGHT && this.direction.moving.UP) this.direction.angle = halfQarter;
         else if (this.direction.moving.RIGHT && this.direction.moving.DOWN) this.direction.angle = -halfQarter;
         else if (this.direction.moving.UP && !this.direction.moving.LEFT) this.direction.angle = 2 * halfQarter;
         else if (this.direction.horizontal === "RIGHT" && !this.direction.moving.DOWN) this.direction.angle = 0;

         //LEFT AND DOWN
         else if (this.direction.moving.LEFT && this.direction.moving.UP) this.direction.angle = 3 * halfQarter;
         else if (this.direction.moving.LEFT && this.direction.moving.DOWN) this.direction.angle = 5 * halfQarter;
         else if (this.direction.moving.DOWN) this.direction.angle = 6 * halfQarter;
         else if (this.direction.horizontal === "LEFT") this.direction.angle = 4 * halfQarter;
    }

    updateSheetHitbox() {
        super.draw();
        super.updateSheetHitbox(this.hitbox_imageFilename, this.scale);
    }

    vision() {
        this.updateAngle();
        let a0 = this.direction.angle - Math.PI / 8;
        let aEnd = this.direction.angle + Math.PI / 8;
        //c.filter = 'blur(4px)';
        c.strokeStyle = "rgb(255, 100, 100, 0.02)";
        //this.periphery = new circle(this.center.x, this.center.y, this.perceptonRadius, -a0, -aEnd, "rgb(250, 220, 220, 0.3)", false, false);
        //this.periphery.draw();
        c.lineWidth = 30;
        c.lineCap = "round";
        for (let angle = a0; angle <= aEnd; angle += (Math.PI / 8) / 10) {
            c.beginPath();
            c.moveTo(this.center.x + 10*Math.cos(-angle), this.center.y + 10*Math.sin(-angle));
            c.lineTo(this.center.x + this.perceptonRadius*Math.cos(-angle), this.center.y + this.perceptonRadius*Math.sin(-angle));
            c.stroke();
        }
        c.lineWidth = 1;
        //c.filter = "none";
    }

    attack() {

    }
    
    die() {

    }
}
    
let hero = new character(window.innerWidth / 2, window.innerHeight / 2, 10, "knight_red(9x1)", "green", knight_red, knight_red_flipped, knight_red_hit, knight_red_flipped_hit, 9, 1, 0.5, [1, 2, 3, 4], [5, 6, 7, 8], 250, 100);

physicalObjects.push(hero);

hero.draw = function() {
    c.beginPath()
    c.rect(this.x, this.y, this.img.width, this.img.height);
    c.stroke();
    this.direction.moving.reset();
    if (this.currentFrame != undefined) this.currentFrame.draw();
}

hero.update = function(dt) {
    if (controller.right && !controller.left) hero.move.right(dt, this);  
    if (controller.left && !controller.right) hero.move.left(dt, this);
    if (controller.up && !controller.down)  hero.move.up(dt, this);
    if (controller.down && !controller.up) hero.move.down(dt, this);
    this.updateImages();
    this.animate(dt);
}

hero.light = function() {
    this.updateAngle();
    this.perceptonRadius = 40;
    let a0 = 0;
    let aEnd =2*Math.PI;
    //c.filter = 'blur(4px)';
    c.strokeStyle = "rgb(150, 150, 0, 0.1)";
    //this.periphery = new circle(this.center.x, this.center.y, this.perceptonRadius, -a0, -aEnd, "rgb(250, 220, 220, 0.3)", false, false);
    //this.periphery.draw();
    c.lineWidth = 30;
    c.lineCap = "round";
    for (let angle = a0; angle <= aEnd; angle += (Math.PI / 8) / 2) {
        c.beginPath();
        c.moveTo(this.center.x + 10 * Math.cos(-angle), this.center.y + 10 * Math.sin(-angle));
        c.lineTo(this.center.x + this.perceptonRadius * Math.cos(-angle), this.center.y + this.perceptonRadius * Math.sin(-angle));
        c.stroke();
    }
}


class enemy extends character {
    constructor(x, y, zIndex, hitbox_imageFilename, images, flippedImages, imagesDmg, flippedImagesDmg, cols, rows, scale, idle, run, moveAmount, hp) {
        super(x, y, zIndex, hitbox_imageFilename, "red", images, flippedImages, imagesDmg, flippedImagesDmg, cols, rows, scale, idle, run, moveAmount, hp);
    }
    draw() {
        super.vision();
        this.direction.moving.reset();
        if (this.currentFrame != undefined) this.currentFrame.draw();
    }
    update(dt) {
        super.updateImages();
        super.animate(dt);
    }
}

class orc extends enemy {
    constructor(x, y) {
        super(x, y, 9, "big_orc(8x1)", big_orc, big_orc_flipped, big_orc_hit, big_orc_flipped_hit, 8, 1, 0.5, [0, 1, 2, 3], [4, 5, 6, 7], 100, 300);
        this.trolling = 0;
        this.trollingDirs = ["RIGHT", "LEFT", "UP", "DOWN", "NONE", "LU", "LD", "RU", "RD"];
        this.dir = this.trollingDirs[randomIntFromRange(0, this.trollingDirs.length -1)];
    }
    draw() {
        super.draw();
    }
    update(dt) {
        this.trolling++;
        if(this.trolling > Math.random()*100000) {
            this.trolling = 0;
            this.dir = this.trollingDirs[randomIntFromRange(0, this.trollingDirs.length - 1)];
            
        }
        switch(this.dir) {
            case "NONE":
                this.move.none(this);
            break;
            case "RIGHT":
                this.move.right(dt, this);
            break;
            case "LEFT":
                this.move.left(dt, this);
            break;
            case "UP":
                this.move.up(dt, this);
            break;
            case "DOWN":
                this.move.down(dt, this);
            break;
            case "LU":
                this.move.left(dt, this);
                this.move.up(dt, this);
            break;
            case "LD":
                this.move.left(dt, this);
                this.move.down(dt, this);
            break;
            case "RU":
                this.move.right(dt, this);
                this.move.up(dt, this);
            break;
            case "RD":
                this.move.right(dt, this);
                this.move.down(dt, this);
            break;
        }
        super.update(dt);
    }
    
}

for(let i = 0; i < 10; i++) {
    x = Math.random() * window.innerWidth;
    y = Math.random() * window.innerHeight;
    physicalObjects.push(new orc(x, y));
}

class weapon extends object {
    constructor(x, y, hitbox_imageFilename, hitbox_scale, owner, img, flippedImg, dmg, scale) {
        super(x, y, hero.zIndex, undefined, undefined, "yellow");
        this.hitbox_imageFilename = hitbox_imageFilename;
        this.hitbox_scale = hitbox_scale;
        this.scale = scale;
        this.owner = owner;
        this.image = img;
        this.width = this.image.width*this.scale;
        this.height = this.image.height*this.scale;
        this.flippedImg = flippedImg;
        this.currentImage = this.image;
        this.angle = Math.random()*10;
        this.dAlpha = 0.03
        this.throwing = false;
        this.swinging = false;
        this.center = {
            x: this.x + this.width / 2,
            y: this.y + this.height / 2
        };
        this.damage = {
            amount: dmg,
            deal: function (object) {
                object.HP -= this.amount;
            }
        };
    }
    draw() {
        super.draw();
        if(this.throwing) {
            c.save();
            c.translate(this.center.x, this.center.y);
            c.rotate(this.angle);
            c.drawImage(this.currentImage, -(this.currentImage.width/2), -(this.currentImage.height), this.currentImage.width, this.currentImage.height);
            c.restore();
        }
        else {
            c.drawImage(this.currentImage, this.x, this.y, this.currentImage.width, this.currentImage.height);
        }
    }

    swing() {
        this.swinnging = true;
    }
    throw (x, y) {
        this.throwing = true;
        this.angle+=this.dAlpha*2;
    }

    update(dt) {
        this.center.x = this.x + this.currentImage.width/2;
        this.center.y = this.y + this.currentImage.height/2;
        if (this.owner == undefined) {
            this.angle += this.dAlpha, this.y += Math.sin(this.angle)/3;

        }
        else {
            if (this.owner.direction.horizontal === "RIGHT" && !this.throwing) this.zIndex = this.owner.zIndex + 1, this.angle += this.dAlpha;
            if (this.owner.direction.horizontal === "LEFT" && !this.throwing) this.zIndex = this.owner.zIndex - 1, this.angle -= this.dAlpha;
        }
        super.update(dt);
        this.updateImgHitbox(this.hitbox_imageFilename, this.hitbox_scale)
    }
}

class anime_sword extends weapon {
    constructor(x, y, owner) {
        super(x, y, "weapon_anime_sword", 2, owner, weapon_anime_sword, weapon_anime_sword, 10, 1);
    }

    draw() {
        super.draw();
    }

    update(dt) {
        super.update(dt);
        
    }
}


for (let i = 0; i < 10; i++) {
    let swordX = Math.random() * window.innerWidth;
    let swordY = Math.random() * window.innerHeight;
    physicalObjects.push(new anime_sword(swordX, swordY, undefined));
}

