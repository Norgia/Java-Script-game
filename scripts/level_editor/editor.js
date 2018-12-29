class item {
    constructor(x, y, image, name) {
        this.x = x;
        this.y = y;
        this.name = name;
        if(image != undefined) {
            this.currentImage = new img(image, this.x, this.y, image.width, image.height, 0.5);
            this.width = this.currentImage.dWidth;
            this.height = this.currentImage.dHeight;
            this.hitbox = new rectAngle(this.x, this.y, this.width, this.height, "black", false);
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
    draw() {
        this.currentImage.draw()
        c.font = "small-caps 10px Arial";
        c.fillStyle = "black";
        if (colision(mouse, this.hitbox)) c.font = "small-caps 11px Arial", c.fillStyle = "rgb(189, 153, 232)";
        let textWidth = c.measureText(this.name).width;
        let padding = 10;
        c.fillText(this.name, this.x - textWidth - padding, this.y + this.height / 1.5);
    }
    update(dt) {
        this.currentImage.update(this.x, this.y);
        this.hitbox.x = this.x;
        this.hitbox.y = this.y;
    }
}

class ogre_idle_anim extends item {
    constructor(x, y) {
        super(x, y, ogre_idle_anim_f0, "Big orc");
    }

    update(dt) {
        if (colision(mouse, this.hitbox) && !mouse.clicked && mouse.pressed) {
            for (let i = 0; i < editor.UI.spawnAmountSlider.value; i++) {
                physicalObjects.push(new orc(this.x, this.y));
            }
            mouse.clicked = true;
        }
    }
}

class goblin_idle_anim extends item {
    constructor(x, y) {
        super(x, y, goblin_idle_anim_f0, "Little goblin");
    }

    update(dt) {
        if (colision(mouse, this.hitbox) && !mouse.clicked && mouse.pressed) {
            for (let i = 0; i < editor.UI.spawnAmountSlider.value; i++) {
                physicalObjects.push(new little_goblin(this.x, this.y));
            }
            mouse.clicked = true;
        }
    }
}

class wall_types extends item {
    constructor(x, y, type) {
        super(x, y, undefined, "Wall " + type)
        this.type = type;
        this.images = this.createImages(walls, 50, 1, 0.15, false);
        this.currentImage = this.images[this.type];
        this.width = this.currentImage.dWidth;
        this.height = this.currentImage.dHeight;
        this.hitbox = new rectAngle(this.x, this.y, this.width, this.height, "black", false);
    }
    update(dt) {
        if (colision(mouse, this.hitbox) && !mouse.clicked && mouse.pressed) {
            for (let i = 0; i < editor.UI.spawnAmountSlider.value; i++) {
                physicalObjects.push(new wall(this.x + i - 2*this.hitbox.width, this.y + i - 2*this.hitbox.height, 2, this.type));
            }
            mouse.clicked = true;
        }
    }
}

class floor_types extends item {
    constructor(x, y, type) {
        super(x, y, undefined, "Floor " + type)
        this.type = type;
        this.images = this.createImages(floors, 13, 1, 0.15, false);
        this.currentImage = this.images[this.type];
        this.width = this.currentImage.dWidth;
        this.height = this.currentImage.dHeight;
        this.hitbox = new rectAngle(this.x, this.y, this.width, this.height, "black", false);
    }
    update(dt) {
        if (colision(mouse, this.hitbox) && !mouse.clicked && mouse.pressed) {
            for (let i = 0; i < editor.UI.spawnAmountSlider.value; i++) {
                physicalObjects.push(new floor(Math.random()*window.innerWidth, Math.random()*window.innerHeight, this.type));
            }
            mouse.clicked = true;
        }
    }
}

class floor_types_premade extends item {
    constructor(x, y, type) {
        super(x, y, undefined, "Premade floor " + type)
        this.type = type;
        this.images = this.createImages(floors, 13, 1, 0.15, false);
        this.currentImage = this.images[0];
        this.width = this.currentImage.dWidth;
        this.height = this.currentImage.dHeight;
        this.hitbox = new rectAngle(this.x, this.y, this.width, this.height, "black", false);
    }
    update(dt) {
        if (colision(mouse, this.hitbox) && !mouse.clicked && mouse.pressed) {
            for (let i = 0; i < editor.UI.spawnAmountSlider.value; i++) {
                physicalObjects.push(new premade_floor(this.x + i - 2 * this.hitbox.width, this.y + i - 2 * this.hitbox.height, this.type));
            }
            mouse.clicked = true;
        }
    }
}

let thrash = new Object();
thrash.x = window.innerWidth - 100;
thrash.y = window.innerHeight - 100;
thrash.currentImage = new img(thrash_image, thrash.x, thrash.y, thrash_image.width, thrash_image.height, 0.2);
thrash.width = thrash.currentImage.dWidth;
thrash.height = thrash.currentImage.dHeight;
thrash.destroy = false;
thrash.bin = [];

thrash.draw = function() {
    thrash.currentImage.draw();
    thrash.destroy = false;
}

thrash.update = function(dt) {
    thrash.currentImage.update(this.x, this.y);
    physicalObjects.forEach(object => {
        if (object.chosen && editor.UI.followMouse) {
            if (colision(thrash, object.hitbox)) thrash.destroy = true;
        }
    
    });
     if (thrash.destroy) {
        physicalObjects.forEach(object => {
            if (object.chosen) physicalObjects.splice(physicalObjects.indexOf(object), 1), thrash.bin.push(object);
        });
     }
    if (thrash.destroy) thrash.currentImage.scale = 0.22;
    else thrash.currentImage.scale = 0.2;
    if(controller.z && controller.ctrl) {
        thrash.bin.forEach(object => {
            if (colision(thrash, object.hitbox)) object.x -= 200, object.y -= 200;
            physicalObjects.push(object);
            thrash.bin.splice(thrash.bin.indexOf(object), 1);
        });
    }
}

class slider {
    constructor(x, y, width, height, interval, name) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.name = name;
        this.backgorundRect = new rectAngle(this.x, this.y, this.width, this.height, "rgba(211, 211, 211, 0.25)", true);
        this.nobSquare = new rectAngle(this.x, this.y, this.height, this.height, "rgb(189, 153, 232, 0.25)", true);
        this.interval = interval+1;
        this.MaxValue = this.interval;
        this.value;
    }
    draw() {
        this.backgorundRect.draw();
        this.nobSquare.draw();

        if (colision(mouse, this.backgorundRect)) c.font = "small-caps 11px Arial", c.fillStyle = "rgb(189, 153, 232)";
        let textWidth = c.measureText(this.value).width;
        let padding = 10;
        c.fillText(this.value, this.x - textWidth - padding, this.y + this.height / 1.5);
        c.fillText(this.name, this.x + this.backgorundRect.width + textWidth + padding, this.y + this.height / 1.5);
    }
    update(dt) {

        if (colision(mouse, this.backgorundRect)) this.backgorundRect.color = "rgba(211, 211, 211, 0.75)", this.nobSquare.color = "rgb(189, 153, 232, 0.75)";
        else this.backgorundRect.color = "rgba(211, 211, 211, 0.5)", this.nobSquare.color = "rgb(189, 153, 232, 0.5)";

        if (colision(mouse, this.backgorundRect) && mouse.pressed) this.nobSquare.x = mouse.x;
        this.value = Math.round(((this.nobSquare.x - this.backgorundRect.x) / this.backgorundRect.width) * this.interval)
    }
}

class small_slider extends slider {
    constructor(x, y, width, height, interval, name) {
        super(x, y, width, height, interval, name);
    }
    update(dt) {
        super.update(dt);
        if (this.value > this.MaxValue - 1) this.value = "ALL";
    }
}

class onOff_slider extends slider {
    constructor(x, y, height, name) {
        super(x, y, height*2, height, 9, name);
    }
    update(dt) {
        super.update(dt);
        if (this.value < this.MaxValue/2) this.value = "true";
        else this.value = "false";

        if (this.nobSquare.x >= this.backgorundRect.x + this.backgorundRect.width - this.nobSquare.width) this.nobSquare.x = this.backgorundRect.x + this.backgorundRect.width - this.nobSquare.width;
    }
}

let editor = new Object();
editor.UI = {
    mouseRect: new rectAngle(undefined, undefined, undefined, undefined, "rgb(189, 153, 232, 0.1)", true),
    mouseRectSX: undefined,
    mouseRectSY: undefined,
    setStartPoint: true,
    followMouse: false,
    hideSlider: new onOff_slider(window.innerWidth - 250, window.innerHeight - 340, 20, "Hide"),
    zIndexSlider: new small_slider(window.innerWidth - 250, window.innerHeight-180, 100, 20, 10, "Z-index"),
    spawnAmountSlider: new slider(window.innerWidth - 250, window.innerHeight-220, 100, 20, 100, "Spawn amount"),
    showInformationSlider: new onOff_slider(window.innerWidth - 250, window.innerHeight-260, 20, "Information"),
    changeBackgroundSlider: new onOff_slider(window.innerWidth - 250, window.innerHeight-300, 20, "Background"),
    mousePoint: {
        x: undefined,
        y: undefined,
        set: false
    },
    showInformation: false,
    startFloor: new premade_floor(window.innerWidth/5, window.innerHeight/5, 0),
    parentFolders: [new folder(window.innerWidth - 200, 50, "Floor", [new folder(window.innerWidth - 200 - 40, 50 + 50, "Premade", [new floor_types_premade(window.innerWidth - 200 - 80, 135, 0),
                                                                                                                                    new floor_types_premade(window.innerWidth - 200 - 80, 160, 1),
                                                                                                                                    new floor_types_premade(window.innerWidth - 200 - 80, 185, 2),
                                                                                                                                    new floor_types_premade(window.innerWidth - 200 - 80, 210, 3),
                                                                                                                                    new floor_types_premade(window.innerWidth - 200 - 80, 235, 4),
                                                                                                                                    new floor_types_premade(window.innerWidth - 200 - 80, 260, 5),
                                                                                                                                    new floor_types_premade(window.innerWidth - 200 - 80, 285, 6)], true), new folder(window.innerWidth - 200 - 40, 150, "Variants", [
                                                                                                                                    new floor_types(window.innerWidth - 200 - 80, 185, 0),
                                                                                                                                    new floor_types(window.innerWidth - 200 - 80, 210, 1),
                                                                                                                                    new floor_types(window.innerWidth - 200 - 80, 235, 2),
                                                                                                                                    new floor_types(window.innerWidth - 200 - 80, 260, 3),
                                                                                                                                    new floor_types(window.innerWidth - 200 - 80, 285, 4),
                                                                                                                                    new floor_types(window.innerWidth - 200 - 80, 310, 5),
                                                                                                                                    new floor_types(window.innerWidth - 200 - 80, 335, 6),
                                                                                                                                    new floor_types(window.innerWidth - 200 - 80, 360, 7),
                                                                                                                                    new floor_types(window.innerWidth - 200 - 80, 385, 8),
                                                                                                                                    new floor_types(window.innerWidth - 200 - 80, 410, 9),
                                                                                                                                    new floor_types(window.innerWidth - 200 - 80, 435, 10),
                                                                                                                                    new floor_types(window.innerWidth - 200 - 80, 460, 11),
                                                                                                                                    new floor_types(window.innerWidth - 200 - 80, 485, 12)], true)], false),
                    new folder(window.innerWidth - 200, 50 + 50, "Characters", [new folder(window.innerWidth - 200 - 40, 50 + 100, "Enemies", [new ogre_idle_anim(window.innerWidth - 200 - 80, 185), new goblin_idle_anim(window.innerWidth - 200 - 80, 215)], true)], false),
                    new folder(window.innerWidth - 200, 50 + 100, "Doors", [new folder(window.innerWidth - 200 - 40, 50 + 150, "Subfolder", [], true)], false),
                    new folder(window.innerWidth - 200, 50 + 150, "Weapons", [new folder(window.innerWidth - 200 - 40, 50 + 200, "Subfolder", [], true)], false),
                    new folder(window.innerWidth - 200, 50 + 200, "Walls", [new folder(window.innerWidth - 200 - 40, 50 + 250, "Design", [new wall_types(window.innerWidth - 200 - 80, 335, 3), 
                                                                                                                                          new wall_types(window.innerWidth - 200 - 80, 360, 4), 
                                                                                                                                          new wall_types(window.innerWidth - 200 - 80, 385, 5), 
                                                                                                                                          new wall_types(window.innerWidth - 200 - 80, 410, 6), 
                                                                                                                                          new wall_types(window.innerWidth - 200 - 80, 435, 7),
                                                                                                                                          new wall_types(window.innerWidth - 200 - 80, 460, 8),
                                                                                                                                          new wall_types(window.innerWidth - 200 - 80, 485, 17),
                                                                                                                                          new wall_types(window.innerWidth - 200 - 80, 510, 18),
                                                                                                                                          new wall_types(window.innerWidth - 200 - 80, 535, 19),
                                                                                                                                          new wall_types(window.innerWidth - 200 - 80, 560, 20),
                                                                                                                                          new wall_types(window.innerWidth - 200 - 80, 585, 21),
                                                                                                                                          new wall_types(window.innerWidth - 200 - 80, 610, 22),
                                                                                                                                          new wall_types(window.innerWidth - 200 - 80, 635, 23),
                                                                                                                                          new wall_types(window.innerWidth - 200 - 80, 660, 24), 
                                                                                                                                          new wall_types(window.innerWidth - 200 - 80, 685, 25), 
                                                                                                                                          new wall_types(window.innerWidth - 200 - 80, 710, 26), 
                                                                                                                                          new wall_types(window.innerWidth - 200 - 80, 735, 27),
                                                                                                                                          new wall_types(window.innerWidth - 200 - 80, 760, 28),
                                                                                                                                          new wall_types(window.innerWidth - 200 - 80, 785, 29),
                                                                                                                                          new wall_types(window.innerWidth - 200 - 80, 810, 30),
                                                                                                                                          new wall_types(window.innerWidth - 200 - 80, 835, 31),
                                                                                                                                          new wall_types(window.innerWidth - 200 - 80, 860, 32)], true), new folder(window.innerWidth - 200 - 40, 350, "Small blocks", [
                                                                                                                                          new wall_types(window.innerWidth - 200 - 80, 385, 0),
                                                                                                                                          new wall_types(window.innerWidth - 200 - 80, 410, 1),
                                                                                                                                          new wall_types(window.innerWidth - 200 - 80, 435, 9),
                                                                                                                                          new wall_types(window.innerWidth - 200 - 80, 460, 10),
                                                                                                                                          new wall_types(window.innerWidth - 200 - 80, 485, 15),
                                                                                                                                          new wall_types(window.innerWidth - 200 - 80, 510, 16),
                                                                                                                                          new wall_types(window.innerWidth - 200 - 80, 535, 35),
                                                                                                                                          new wall_types(window.innerWidth - 200 - 80, 560, 36),
                                                                                                                                          new wall_types(window.innerWidth - 200 - 80, 585, 39),
                                                                                                                                          new wall_types(window.innerWidth - 200 - 80, 610, 44),
                                                                                                                                          new wall_types(window.innerWidth - 200 - 80, 635, 45),
                                                                                                                                          new wall_types(window.innerWidth - 200 - 80, 660, 46),
                                                                                                                                          new wall_types(window.innerWidth - 200 - 80, 685, 47),
                                                                                                                                          new wall_types(window.innerWidth - 200 - 80, 710, 48),
                                                                                                                                          new wall_types(window.innerWidth - 200 - 80, 735, 49),
                                                                                                                                          new wall_types(window.innerWidth - 200 - 80, 760, 40)], true), new folder(window.innerWidth - 200 - 40, 400, "Big blocks", [
                                                                                                                                          new wall_types(window.innerWidth - 200 - 80, 435, 11),
                                                                                                                                          new wall_types(window.innerWidth - 200 - 80, 460, 12),
                                                                                                                                          new wall_types(window.innerWidth - 200 - 80, 485, 13),
                                                                                                                                          new wall_types(window.innerWidth - 200 - 80, 510, 13),
                                                                                                                                          new wall_types(window.innerWidth - 200 - 80, 535, 33),
                                                                                                                                          new wall_types(window.innerWidth - 200 - 80, 560, 34),
                                                                                                                                          new wall_types(window.innerWidth - 200 - 80, 585, 37),
                                                                                                                                          new wall_types(window.innerWidth - 200 - 80, 610, 38),
                                                                                                                                          new wall_types(window.innerWidth - 200 - 80, 635, 41),
                                                                                                                                          new wall_types(window.innerWidth - 200 - 80, 660, 42),
                                                                                                                                          new wall_types(window.innerWidth - 200 - 80, 685, 43)
                                                                                                                                          ], true)], false)],
                                                                                                                                          
    init: function() {
        for(let i = 0; i < this.parentFolders.length; i++) {
            utilityObjects.push(this.parentFolders[i]);
        }
        utilityObjects.push(this.mouseRect);
        utilityObjects.push(thrash);
        utilityObjects.push(this.zIndexSlider, this.spawnAmountSlider, this.showInformationSlider, this.changeBackgroundSlider, this.hideSlider);
        physicalObjects.push(this.startFloor);
    },
    update: function(dt) {
        ensureGrid(this.startFloor);
        physicalObjects.forEach(object => {
            if (object.chosen && colision(mouse, object.hitbox) && editor.UI.setStartPoint && mouse.pressed) {
                this.followMouse = true;
                if(this.mousePoint.x == undefined && this.mousePoint.y == undefined) this.mousePoint.set = true;
            }
            if (object.chosen && this.showInformationSlider.value == "true") object.infomrationBox.show = true;
            else object.infomrationBox.show = false;
            
        });
        physicalObjects.forEach(object => {
            if (!this.followMouse) {
                if (!colision(this.mouseRect, object.hitbox) && mouse.pressed) object.chosen = false;
                if (colision(this.mouseRect, object.hitbox) && this.zIndexSlider.value == "ALL") object.chosen = true;
                if (colision(this.mouseRect, object.hitbox) && object.zIndex == this.zIndexSlider.value) object.chosen = true;
            }
        });
        if (this.changeBackgroundSlider.value == "false") game.background.color = "black";
        else game.background.color = "white";
        if (this.hideSlider.value == "true" && utilityObjects.indexOf(this.changeBackgroundSlider) != -1) {
            utilityObjects.splice(utilityObjects.indexOf(this.changeBackgroundSlider), 1);
            utilityObjects.splice(utilityObjects.indexOf(this.showInformationSlider), 1);
            utilityObjects.splice(utilityObjects.indexOf(this.zIndexSlider), 1);
            utilityObjects.splice(utilityObjects.indexOf(this.spawnAmountSlider), 1);
        }
        if (this.hideSlider.value == "false" && utilityObjects.indexOf(this.changeBackgroundSlider) == -1) {
            utilityObjects.push(this.changeBackgroundSlider, this.showInformationSlider, this.zIndexSlider, this.spawnAmountSlider);
        }
        if (!mouse.pressed) {
            this.followMouse = false;
            mouse.follow = false
            this.mousePoint.x = undefined;
            this.mousePoint.y = undefined;
            editor.UI.setStartPoint = true;
            editor.UI.mouseRect.x = undefined;
            editor.UI.mouseRect.y = undefined;
            editor.UI.mouseRect.width = undefined;
            editor.UI.mouseRect.height = undefined;
        }
        if(this.followMouse && this.mousePoint.set) {
            this.mousePoint.x = mouse.x;
            this.mousePoint.y = mouse.y;
            this.mousePoint.set = false;
        }

        if (mouse.pressed && !this.followMouse) {
            if(editor.UI.setStartPoint) {
                this.mouseRectSX = mouse.x;
                this.mouseRectSY = mouse.y;
                this.setStartPoint = false;
            }
            this.mouseRect.x = this.mouseRectSX;
            this.mouseRect.y = this.mouseRectSY;
            this.mouseRect.width = mouse.x - this.mouseRectSX;
            this.mouseRect.height = mouse.y - this.mouseRectSY;
            this.mouseRect.draw();
        }
    }
}

function ensureGrid(referenceObject) {
    let padding = 32;
    referenceObject.x = Math.round(referenceObject.x);
    referenceObject.y = Math.round(referenceObject.y);
    for(let i = 0; i < physicalObjects.length; i++) {
        let object = physicalObjects[i];
        if(object === referenceObject) continue;
        if ((object instanceof static_tile || object instanceof dynamic_tile) && object.hitbox.width % 32 === 0 && object.hitbox.height % 32 === 0) {
            object.x = Math.round(object.x);
            object.y = Math.round(object.y);
            let zeroLevelX = Math.abs(object.hitbox.x - referenceObject.hitbox.x);
            let zeroLevelY = Math.abs(object.hitbox.y - referenceObject.hitbox.y);
            if (zeroLevelX % padding >= 15 && zeroLevelX % padding < 32) object.x += 1;
            if (zeroLevelX % padding < 15 && zeroLevelX % padding > 0) object.x -=1;
            if (zeroLevelY % padding > 15 && zeroLevelY % padding < 32) object.y += 1;
            if (zeroLevelY % padding <= 15 && zeroLevelY % padding > 0) object.y -= 1;
        }
   }
}

function makeWall(startX, y, amount, type) {
    let padding;
    if(amount < 0) padding = -32;
    else padding = 32;
    let startBottomBlock;
    let startTopBlock;
    let endBottomBlock; 
    let endTopBlock;
    let bottomBlocks;
    let topBlocks;
    let zIndex;
    
    switch(type) {
        case "FRONT":
            bottomBlocks = [11, 12, 33, 34, 41, 42, 43];
            topBlocks = [15, 16, 39, 40, 48, 49]
            startBottomBlock = bottomBlocks;
            startTopBlock = [9, 35];
            endBottomBlock = bottomBlocks;
            endTopBlock = [10, 36];
            zIndex = 10;
        break;
        case "BACK":
            bottomBlocks = [11, 12, 33, 34, 41, 42, 43];
            topBlocks = [15, 16, 39, 40, 48, 49]
            startBottomBlock = [13, 37];
            startTopBlock = topBlocks;
            endBottomBlock = [38];
            endTopBlock = topBlocks;
            zIndex = 2;
        break;
        case "LEFT":
            topBlocks = [47];
            startTopBlock = topBlocks;
            endTopBlock = topBlocks;
            zIndex = 10;
        break;
        case "RIGHT":
            topBlocks = [46];
            startTopBlock = topBlocks;
            endTopBlock = topBlocks;
            zIndex = 10;
        break;
    }

    if(type == "FRONT" || type == "BACK") {
        let endX = startX + amount*padding;
        for (let x = startX; x <= endX; x += padding) {
            if (x == startX) {
                let bottomWall = new wall(x, y, zIndex, startBottomBlock[randomIntFromRange(0, startBottomBlock.length - 1)]);
                let topWall = new wall(x, bottomWall.y - padding, zIndex, startTopBlock[randomIntFromRange(0, startTopBlock.length - 1)]);
                physicalObjects.push(bottomWall);
                physicalObjects.push(topWall);

            } else if(x < endX) {
                let bottomWall = new wall(x, y, zIndex, bottomBlocks[randomIntFromRange(0, bottomBlocks.length - 1)]);
                let topWall = new wall(x, bottomWall.y - padding, zIndex, topBlocks[randomIntFromRange(0, topBlocks.length - 1)]);
                physicalObjects.push(bottomWall);
                physicalObjects.push(topWall);

            } else {
                let bottomWall = new wall(x, y, zIndex, endBottomBlock[randomIntFromRange(0, endBottomBlock.length - 1)]);
                let topWall = new wall(x, bottomWall.y - padding, zIndex, endTopBlock[randomIntFromRange(0, endTopBlock.length - 1)]);
                physicalObjects.push(bottomWall);
                physicalObjects.push(topWall);
            }
        }
    }
    else {
        let endY = y + amount * padding;
        for(let loopY = y; loopY <= endY; loopY+=padding) {
           let topWall = new wall(startX, loopY, zIndex, topBlocks[randomIntFromRange(0, topBlocks.length - 1)]);
           physicalObjects.push(topWall);
        }
    }
}

let wallStartX = editor.UI.startFloor.x + 12;
let wallStartY = editor.UI.startFloor.y + 12;
makeWall(wallStartX,  wallStartY, 20, "BACK");
makeWall(wallStartX, wallStartY + 32, 10, "LEFT");
makeWall(wallStartX, wallStartY + 32 + 10*32, 20, "FRONT");
makeWall(wallStartX + 20 * 32, wallStartY, 10, "RIGHT");


function folder(x, y, name, content, Subfolder) {
    this.x = x;
    this.y = y;
    this.imageClosed = new img(folder_image_closed, this.x, this.y, 179, 114, 0.25);
    this.imageOpen = new img(folder_image_open, this.x, this.y, 179, 114, 0.25);
    this.open = false;
    this.currentImage = this.imageClosed;
    this.width = this.currentImage.dWidth;
    this.height = this.currentImage.dHeight;
    this.name = name;
    this.content = content;
    this.hitbox = new rectAngle(this.x, this.y, this.width, this.height, "black", false);
    this.Subfolder = Subfolder;

    this.draw = function() {
        this.currentImage.draw();
        c.font = "small-caps 10px Arial";
        c.fillStyle = "black";
        if (colision(mouse, this.hitbox)) c.font = "small-caps 11px Arial", c.fillStyle = "rgb(189, 153, 232)";
        if(this.Subfolder) {
            let textWidth = c.measureText(this.name).width;
            let padding = 10;
            c.fillText(this.name, this.x - textWidth - padding, this.y + this.height / 1.5);
        }
        else c.fillText(this.name, this.x + this.width, this.y + this.height / 1.5);
    }

    this.update = function() {
        this.currentImage.update(this.x, this.y);
        this.hitbox.x = this.x;
        this.hitbox.y = this.y;

        if(colision(mouse, this.hitbox) && !mouse.clicked && mouse.pressed) {
            this.open = !this.open;
            if(this.open) this.x -= 60, this.expand();
            else this.x += 60, this.collapse();
            mouse.clicked = true;
        }
        if(this.open) this.currentImage = this.imageOpen;
        else this.currentImage = this.imageClosed;
    }

    this.expand = function() {
        for(let i = 0; i < this.content.length; i++) {
            utilityObjects.push(this.content[i]);
        }
    }
    this.collapse = function() {
        for (let i = 0; i < this.content.length; i++) {
            utilityObjects.splice(utilityObjects.indexOf(this.content[i]), 1);
        }
    }
}

//makeFloor();
