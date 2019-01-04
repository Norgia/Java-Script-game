class enemy extends character {
    constructor(x, y, hitbox_imageFilename, images, flippedImages, imagesDmg, flippedImagesDmg, cols, rows, scale, idle, run, moveAmount, hp) {
        super(x, y, 4, hitbox_imageFilename, "red", images, flippedImages, imagesDmg, flippedImagesDmg, cols, rows, scale, idle, run, moveAmount, hp);
    }
    draw() {
        //super.vision();
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
        super(x, y, "big_orc(8x1)", big_orc, big_orc_flipped, big_orc_hit, big_orc_flipped_hit, 8, 1, 0.5, [0, 1, 2, 3], [4, 5, 6, 7], 100, 300);
        this.trolling = 0;
        this.trollingDirs = ["RIGHT", "LEFT", "UP", "DOWN", "NONE", "LU", "LD", "RU", "RD"];
        this.dir = this.trollingDirs[randomIntFromRange(0, this.trollingDirs.length - 1)];
    }
    draw() {
        super.draw();
    }
    update(dt) {
        this.trolling++;
        if (this.trolling > Math.random() * 100000) {
            this.trolling = 0;
            this.dir = this.trollingDirs[randomIntFromRange(0, this.trollingDirs.length - 1)];

        }
        switch (this.dir) {
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

class big_demon extends enemy{
    constructor(x, y) {
        super(x, y, "demon(9x1)", demon, demon_flipped, big_orc_hit, big_orc_flipped_hit, 9, 1, 0.5, [0, 1, 2, 3], [4, 5, 6, 7], 100, 300);
        this.trolling = 0;
        this.trollingDirs = ["RIGHT", "LEFT", "UP", "DOWN", "NONE", "LU", "LD", "RU", "RD"];
        this.dir = this.trollingDirs[randomIntFromRange(0, this.trollingDirs.length - 1)];
    }
    draw() {
        super.draw();
    }
    update(dt) {
        this.trolling++;
        if (this.trolling > Math.random() * 100000) {
            this.trolling = 0;
            this.dir = this.trollingDirs[randomIntFromRange(0, this.trollingDirs.length - 1)];

        }
        switch (this.dir) {
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

class little_goblin extends enemy {
    constructor(x, y) {
        super(x, y, "goblin(8x1)", goblin, goblin_flipped, big_orc_hit, big_orc_flipped_hit, 8, 1, 0.5, [0, 1, 2, 3], [4, 5, 6, 7], 200, 300);
        this.trolling = 0;
        this.trollingDirs = ["RIGHT", "LEFT", "UP", "DOWN", "NONE", "LU", "LD", "RU", "RD"];
        this.dir = this.trollingDirs[randomIntFromRange(0, this.trollingDirs.length - 1)];
    }
    draw() {
        super.draw();
    }
    update(dt) {
        this.trolling++;
        if (this.trolling > Math.random() * 100000) {
            this.trolling = 0;
            this.dir = this.trollingDirs[randomIntFromRange(0, this.trollingDirs.length - 1)];

        }
        switch (this.dir) {
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

/*for (let i = 0; i < 10; i++) {
    x = Math.random() * window.innerWidth;
    y = Math.random() * window.innerHeight;
    physicalObjects.push(new orc(x, y));
    physicalObjects.push(new big_demon(x, y));
    physicalObjects.push(new little_goblin(x, y));
    physicalObjects.push(new little_goblin(x, y));
    physicalObjects.push(new little_goblin(x, y));
    physicalObjects.push(new little_goblin(x, y));
}*/
