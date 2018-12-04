class character extends object {
    constructor(x, y, images, flippedImages, imagesDmg, flippedImagesDmg, cols, rows, scale, loopImages, hp) {
        super(x, y);
        this.images = this.createImages(images, cols, rows, scale, false);
        this.flippedImages = this.createImages(flippedImages, cols, rows, scale, true);
        this.imagesDmg = this.createImages(imagesDmg, cols, rows, scale, false);
        this.flippedImagesDmg = this.createImages(flippedImagesDmg, cols, rows, scale, true);
        this.currentImages = this.images;
        this.loopImages = loopImages;
        this.currentFrame = this.currentImages[this.loopImages[0]];
        this.loopIndex = undefined;
        this.itarater = 0;
        this.frameCount = 0;
        this.delayCount = 5;
        
        this.width = this.images[0].dWidth;
        this.height = this.images[0].dHeight;
        this.center = {
            x: (this.x + this.width)/2, 
            y: (this.y + this.height)/2
        };
        this.spawn = {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
        this.HP = hp;
        this.damage = {
            take: function (self, enemy) {
                self.HP -= enemy.damage.amount;
            }
        };
        this.move = {
            right: function (amount, dt) {
                this.x += amount * dt;
            },
            left: function (amount, dt) {
                this.x -= amount * dt;
            },
            up: function (amount, dt) {
                this.y -= amount * dt;
            },
            down: function (amount, dt) {
                this.y += amount * dt;
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
        this.imagesCreated = true;
        return Images;
    }

    draw() {
        this.currentFrame.draw();
    }

    updateImages() {
        this.x = this.images[0].dx;
        this.y = this.images[0].dy;

        this.width = this.images[0].dWidth;
        this.height = this.images[0].dHeight;

        this.center.x = (this.x + this.width)/2;
        this.center.y = (this.y + this.height)/2;
        
        for(let i = 0; i < this.images.length; i++) {
            this.images[i].update(this.spawn.x - this.width/2, this.spawn.y - this.height/2);
            this.flippedImages[i].update(this.x, this.y);
            this.imagesDmg[i].update(this.x, this.y);
            this.flippedImagesDmg[i].update(this.x, this.y);
        }
    }

    animate() {
        this.frameCount++;

        if(this.frameCount > this.delayCount) {
            this.frameCount = 0;
            if(this.loopIndex === this.loopImages[this.loopImages.length - 1]) {
                this.itarater = 0;
            }
            this.loopIndex = this.loopImages[this.itarater];
            this.currentFrame = this.currentImages[this.loopIndex];
            this.itarater++;
        }
    }

    die() {

    }
}
    

let hero = new character(window.innerWidth/2, window.innerHeight/2, knight_red, knight_red_flipped, knight_red_hit, knight_red_flipped_hit, 9, 1, 1, [1, 2, 3, 4], 100);
hero.idle = [];
hero.walking = [5, 6, 3];
hero.jmping = []; 
physicalObjects.push(hero);

hero.update = function(dt) {
    
    this.updateImages();
    this.animate();
}

class orc extends character {
    constructor(x, y, scale, hp, dmg) {
        super(x, y, width, height, images, flippedImages, imagesDmg, flippedImagesDmg, scale, hp);
        this.dmg = dmg;
        this.idle = [];
        this.walking = [];
    }

    draw() {
        super.draw();
    }

    update(dt) {

        super.updateImages();
        super.animate();
    }
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