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
