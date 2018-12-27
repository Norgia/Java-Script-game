class item {
    constructor(x, y, image, name) {
        this.x = x;
        this.y = y;
        this.currentImage = new img(image, this.x, this.y, image.width, image.height, 0.5);
        this.width = this.currentImage.dWidth;
        this.height = this.currentImage.dHeight;
        this.name = name;
        this.hitbox = new rectAngle(this.x, this.y, this.width, this.height, "black", false);
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
        super(x, y, ogre_idle_anim_f0, "big orc");
    }

    update(dt) {
        if (colision(mouse, this.hitbox) && !mouse.clicked && mouse.pressed) {
            physicalObjects.push(new orc(this.x, this.y));
            mouse.clicked = true;
        }
    }
}

class goblin_idle_anim extends item {
    constructor(x, y) {
        super(x, y, goblin_idle_anim_f0, "little goblin");
    }

    update(dt) {
        if (colision(mouse, this.hitbox) && !mouse.clicked && mouse.pressed) {
            physicalObjects.push(new little_goblin(this.x, this.y));
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

thrash.draw = function() {
    thrash.currentImage.draw();
    thrash.destroy = false;
}

thrash.update = function(dt) {
    thrash.currentImage.update(this.x, this.y);
    physicalObjects.forEach(object => {
        if (object.chosen && editor.UI.followMouse) {
            if (colision(thrash, object.hitbox)) physicalObjects.splice(physicalObjects.indexOf(object), 1), thrash.destroy = true;
        }
    });
    if (thrash.destroy) thrash.currentImage.scale = 0.22;
    else thrash.currentImage.scale = 0.2;

}

let editor = new Object();
editor.UI = {
    mouseRect: new rectAngle(undefined, undefined, undefined, undefined, "rgb(189, 153, 232, 0.1)", true),
    mouseRectSX: undefined,
    mouseRectSY: undefined,
    setStartPoint: true,
    followMouse: false,
    mousePoint: {
        x: undefined,
        y: undefined,
        set: false
    },
    parentFolders: [new folder(window.innerWidth - 200, 50, "Floor", [new folder(window.innerWidth - 200 - 40, 50 + 50, "Subfolder", [], true)], false),
                    new folder(window.innerWidth - 200, 50 + 50, "Characters", [new folder(window.innerWidth - 200 - 40, 50 + 100, "Enemies", [new ogre_idle_anim(window.innerWidth - 200 - 80, 200), new goblin_idle_anim(window.innerWidth - 200 - 80, 250)], true)], false),
                    new folder(window.innerWidth - 200, 50 + 100, "Doors", [new folder(window.innerWidth - 200 - 40, 50 + 150, "Subfolder", [], true)], false),
                    new folder(window.innerWidth - 200, 50 + 150, "Weapons", [new folder(window.innerWidth - 200 - 40, 50 + 200, "Subfolder", [], true)], false)],

    init: function() {
        for(let i = 0; i < this.parentFolders.length; i++) {
            utilityObjects.push(this.parentFolders[i]);
        }
        utilityObjects.push(this.mouseRect);
        utilityObjects.push(thrash);
    },
    update: function(dt) {
        physicalObjects.forEach(object => {
            if (object.chosen && colision(mouse, object.hitbox) && editor.UI.setStartPoint && mouse.pressed) {
                this.followMouse = true;
                if(this.mousePoint.x == undefined && this.mousePoint.y == undefined) this.mousePoint.set = true;
            }
        });
        physicalObjects.forEach(object => {
            if (!this.followMouse) {
                if (!colision(this.mouseRect, object.hitbox) && mouse.pressed) object.chosen = false;
                if (colision(this.mouseRect, object.hitbox)) object.chosen = true;
            }
        });
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

makeFloor();
