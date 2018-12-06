class character extends object {
    constructor(x, y, zIndex, images, flippedImages, imagesDmg, flippedImagesDmg, cols, rows, scale, idle, run, moveAmount, hp) {
        super(x, y, zIndex);
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
        this.currentFrame = this.currentImages[this.loopImages[0]];
        this.width = this.currentFrame.dWidth;
        this.height = this.currentFrame.dHeight;
        this.loopIndex = undefined;
        this.itarater = 0;
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
        this.indicator = new circle();
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

    draw() {
        if(this.currentFrame != undefined) this.currentFrame.draw();
        super.draw();
    }

    updateImages() {
        this.img.width = this.currentFrame.dWidth;
        this.img.height = this.currentFrame.dHeight;
        this.center.x = this.currentFrame.dx + this.img.width/2;
        this.center.y = this.currentFrame.dy + this.img.height/2;
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
        this.direction.moving.reset(); //FIXA FÖR FIENDE
        this.movmentVector2D.update();
        super.update(dt);
        if (this.currentFrame != undefined) this.currentFrame.update(this.x, this.y);
    }
    vision() {
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
        else if (this.direction.horizontal === "LEFT") this.direction.angle = 4*halfQarter;
        
        let a0 = this.direction.angle - Math.PI / 8;
        let aEnd = this.direction.angle + Math.PI / 8;
        //this.indicator = new circle(this.center.x, this.center.y, 500, -a0, -aEnd, "rgb(220, 220, 220)", false);
        
        for (let angle = this.direction.angle - Math.PI / 8; angle < this.direction.angle + Math.PI / 8; angle += (Math.PI / 8) / 20) {
            c.beginPath();
            c.moveTo(this.center.x + 10*Math.cos(-angle), this.center.y + 10*Math.sin(-angle));
            c.lineTo(this.center.x + 700*Math.cos(-angle), this.center.y + 700*Math.sin(-angle));
            c.strokeStyle = "rgb(250, 220, 220, 0.3)";
            c.stroke();
        }
    }

    attack() {

    }
    
    die() {

    }
}
    
let hero = new character(window.innerWidth / 2, window.innerHeight / 2, 10, knight_red, knight_red_flipped, knight_red_hit, knight_red_flipped_hit, 9, 1, 0.5, [1, 2, 3, 4], [5, 6, 7, 8], 250, 100);

physicalObjects.push(hero);

hero.update = function(dt) {
    if (controller.right && !controller.left) hero.move.right(dt, this);  
    if (controller.left && !controller.right) hero.move.left(dt, this);
    if (controller.up && !controller.down)  hero.move.up(dt, this);
    if (controller.down && !controller.up) hero.move.down(dt, this);
    //this.indicator.draw();
    //this.vision();
    this.updateImages();
    this.animate(dt);
}


class enemy extends character {
    constructor(x, y, images, flippedImages, imagesDmg, flippedImagesDmg, cols, rows, scale, idle, run, moveAmount, hp) {
        super(x, y, images, flippedImages, imagesDmg, flippedImagesDmg, cols, rows, scale, idle, run, moveAmount, hp);
    }
    draw() {
        super.vision();
        super.draw();
    }
    update(dt) {
        super.updateImages();
        super.animate();
    }
}

class orc extends enemy {
    constructor(x, y) {
        super(x, y, 9, big_orc, big_orc_flipped, big_orc_hit, big_orc_flipped_hit, 8, 1, 0.5, [0, 1, 2, 3], [4, 5, 6, 7], 100, 300);
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

for(let i = 0; i < 5; i++) {
    x = Math.random() * window.innerWidth;
    y = Math.random() * window.innerHeight;
    physicalObjects.push(new orc(x, y));
}



class weapon extends object {
    constructor(x, y, width, height, img, dmg) {
        super(x, y, width, height);
        this.img = img;
        this.damage = {
            amount: dmg,
            deal: function (object) {
                object.HP -= this.amount;
            }
        };
    }
    draw() {

    }

    use() {

    }

    update(dt) {

    }
}