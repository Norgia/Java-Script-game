class character extends object {
    constructor(x, y, images, flippedImages, imagesDmg, flippedImagesDmg, cols, rows, scale, idle, run, moveAmount, hp) {
        super(x, y);
        this.images = this.createImages(images, cols, rows, scale, false);
        this.flippedImages = this.createImages(flippedImages, cols, rows, scale, true);
        this.imagesDmg = this.createImages(imagesDmg, cols, rows, scale, false);
        this.flippedImagesDmg = this.createImages(flippedImagesDmg, cols, rows, scale, true);
        this.width = this.images[0].dWidth;
        this.height = this.images[0].dHeight;
        this.center = {
            x: this.x + this.width/2,
            y: this.y + this.height/2
        };
        this.currentImages = this.images;
        this.idle = idle;
        this.run = run;
        this.loopImages = this.idle;
        this.currentFrame = this.currentImages[this.loopImages[0]];
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
        this.direction = "RIGHT";
        this.movmentVector2D = new vector2D(0, 0);

        this.move = {
            amount: moveAmount,
            now: false,
            none: function(self) {
                self.loopImages = self.idle;
            },
            right: function (dt, self) {
                this.now = true;
                this.direction = "RIGHT";
                self.currentImages = self.images;
                self.loopImages = self.run;
                self.movmentVector2D.dx += this.amount;
                let vector = self.movmentVector2D.limitResultant();
                self.x += vector.dx * dt;
            },
            left: function (dt, self) {
                this.now = true;
                this.direction = "LEFT";
                self.currentImages = self.flippedImages;
                self.loopImages = self.run;
                self.movmentVector2D.dx -= this.amount;
                let vector = self.movmentVector2D.limitResultant();
                self.x += vector.dx * dt;
            },
            up: function (dt, self) {
                this.now = true;
                self.loopImages = self.run;
                self.movmentVector2D.dy -= this.amount;
                let vector = self.movmentVector2D.limitResultant();
                self.y += vector.dy * dt;
            },
            down: function (dt, self) {
                this.now = true;
                self.loopImages = self.run;
                self.movmentVector2D.dy += this.amount;
                let vector = self.movmentVector2D.limitResultant();
                self.y += vector.dy * dt;
            }
        };
    }

    createImages(spriteSheet, amountX, amountY, scale, reverse) {
        let Images = [];
        
        for (let y = 0; y < spriteSheet.height; y += spriteSheet.height / amountY) {
            if(!reverse) {
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

    draw() {
        if(this.currentFrame != undefined) this.currentFrame.draw();
    }

    updateImages() {
        this.width = this.images[0].dWidth;
        this.height = this.images[0].dHeight;
       
        for(let i = 0; i < this.images.length; i++) {
            this.images[i].update(this.x, this.y);
            this.flippedImages[i].update(this.x, this.y);
            this.imagesDmg[i].update(this.x, this.y);
            this.flippedImagesDmg[i].update(this.x, this.y);
        }
    }

    animate() {
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
    }

    attack() {

    }
    
    die() {

    }
}
    

let hero = new character(window.innerWidth / 2, window.innerHeight / 2, knight_red, knight_red_flipped, knight_red_hit, knight_red_flipped_hit, 9, 1, 0.5, [1, 2, 3, 4], [5, 6, 7, 8], 500, 100);

physicalObjects.push(hero);

hero.update = function(dt) {
    if (controller.right && !controller.left) hero.move.right(dt, this);  
    if (controller.left && !controller.right) hero.move.left(dt, this);
    if (controller.up && !controller.down)  hero.move.up(dt, this);
    if (controller.down && !controller.up) hero.move.down(dt, this);

    this.updateImages();
    this.animate();
}


class enemy extends character {
    constructor(x, y, images, flippedImages, imagesDmg, flippedImagesDmg, cols, rows, scale, idle, run, moveAmount, hp) {
        super(x, y, images, flippedImages, imagesDmg, flippedImagesDmg, cols, rows, scale, idle, run, moveAmount, hp);
    }
    draw() {
        super.draw();
    }
    update(dt) {
        super.updateImages();
        super.animate();
    }
}

class orc extends enemy {
    constructor(x, y) {
        super(x, y, big_orc, big_orc_flipped, big_orc_hit, big_orc_flipped_hit, 8, 1, 0.5, [0, 1, 2, 3], [4, 5, 6, 7], 100, 300);
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

for(let i = 0; i < 30; i++) {
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