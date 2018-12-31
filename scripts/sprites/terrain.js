class static_tile extends object {
    constructor(img, hitbox_imageFilename, hitbox_scale, x, y, zIndex, width, height, cols, rows, scale, type) {
        super(x, y, zIndex, width, height, "blue");
        this.images = createImages(img, cols, rows, scale, false);
        this.type = type;
        this.itarater = this.type;
        this.hitbox_scale = hitbox_scale;
        this.hitbox_imageFilename = hitbox_imageFilename;
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

class dynamic_tile extends object {
    
}

class floor extends static_tile {
    constructor(x, y, type) {
        super(floors, "floor(13x1)", 0.5, x, y, 1, 100, 100, 13, 1, 0.5, type);
    }
    draw() {
        super.draw();
    }
    update(dt) {
        super.update();
    }
}

class premade_floor extends static_tile {
    constructor(x, y, type) {
        super(floors, "floor(13x1)", 0.5, x, y, 0, 100, 100, 13, 1, 1, type);
        this.images = [new img(big_floor_image, x, y, big_floor_image.width, big_floor_image.height, 1),
                       new img(medium_floor_image, x, y, medium_floor_image.width, medium_floor_image.height, 1),
                       new img(small_floor_image, x, y, small_floor_image.width, small_floor_image.height, 1),
                       new img(five_five_floor_image, x, y, five_five_floor_image.width, five_five_floor_image.height, 1),
                       new img(four_four_floor_image, x, y, four_four_floor_image.width, four_four_floor_image.height, 1),
                       new img(three_three_floor_image, x, y, three_three_floor_image.width, three_three_floor_image.height, 1),
                       new img(two_two_floor_image, x, y, two_two_floor_image.width, two_two_floor_image.height, 1)];
    }
    draw() {
        super.draw();
    }
    update(dt) {
        super.update(dt);
        this.hitbox.x = this.x;
        this.hitbox.y = this.y;
        this.hitbox.width = this.images[this.type].dWidth;
        this.hitbox.height = this.images[this.type].dHeight;
    }
}

class wall extends static_tile {
    constructor(x, y, zIndex, type) {
        super(walls, "walls(50x1)", 0.5, x, y, zIndex, 100, 100, 50, 1, 0.5, type);
    }
    draw() {
        super.draw();
    }
    update(dt) {
        super.update();
    }
}

function makeWall(startX, startY, endX, endY, type) {
    let padding = 32;
    let startBottomBlock;
    let startTopBlock;
    let endBottomBlock;
    let endTopBlock;
    let bottomBlocks;
    let topBlocks;
    let zIndex;

    switch (type) {
        case "FRONT":
            bottomBlocks = [42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 33, 34];
            //topBlocks = [15, 16, 39, 40, 48, 49];
            startBottomBlock = [11];
            startTopBlock = [9];
            endBottomBlock = [12];
            endTopBlock = [10];
            zIndex = 7;
            break;
        case "BACK":
            bottomBlocks = [42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 33, 34];
            //topBlocks = [15, 16, 39, 40, 48, 49];
            startBottomBlock = [13];
            startTopBlock = [];
            endBottomBlock = [14];
            endTopBlock = [];
            zIndex = 2;
            break;
        case "LEFT":
            topBlocks = [47];
            startTopBlock = topBlocks;
            endTopBlock = topBlocks;
            zIndex = 8;
            break;
        case "RIGHT":
            topBlocks = [46];
            startTopBlock = topBlocks;
            endTopBlock = topBlocks;
            zIndex = 8;
            break;
        case "MID":
            bottomBlocks = [42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 33, 34];
            //topBlocks = [15, 16, 39, 40, 48, 49];
            startBottomBlock = [37];
            startTopBlock = [35];
            endBottomBlock = [38];
            endTopBlock = [36];
            zIndex = 9;
    }

    if (type == "FRONT" || type == "BACK" || type == "MID") {
        for (let x = startX; x <= endX; x += padding) {
            if (x == startX) {
                let bottomWall = new wall(x, startY, zIndex, startBottomBlock[randomIntFromRange(0, startBottomBlock.length - 1)]);
                let topWall = new wall(x, bottomWall.y - padding, zIndex, startTopBlock[randomIntFromRange(0, startTopBlock.length - 1)]);
                physicalObjects.push(bottomWall);
                if(type != "BACK") physicalObjects.push(topWall);

            } else if (x < endX) {
                let bottomWall = new wall(x, startY, zIndex, bottomBlocks[randomIntFromRange(0, bottomBlocks.length - 1)]);
                //let topWall = new wall(x, bottomWall.y - padding, zIndex, topBlocks[randomIntFromRange(0, topBlocks.length - 1)]);
                physicalObjects.push(bottomWall);
                //physicalObjects.push(topWall);

            } else {
                let bottomWall = new wall(x, startY, zIndex, endBottomBlock[randomIntFromRange(0, endBottomBlock.length - 1)]);
                let topWall = new wall(x, bottomWall.y - padding, zIndex, endTopBlock[randomIntFromRange(0, endTopBlock.length - 1)]);
                physicalObjects.push(bottomWall);
                if (type != "BACK") physicalObjects.push(topWall);
            }
        }
    } else {
        for (let y = startY; y <= endY; y += padding) {
            let topWall = new wall(startX, y, zIndex, topBlocks[randomIntFromRange(0, topBlocks.length - 1)]);
            physicalObjects.push(topWall);
        }
    }
}

class wall_indicators extends static_tile {
    constructor(x, y, type) {
        super(wallbuilder_image, "wallbuilder_image(2x1)", 0.5, x, y, 10, 100, 100, 2, 1, 0.5, type);
    }
    draw() {
        super.draw();
    }
    update(dt) {
        super.update();
    }
}