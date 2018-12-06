let editor = new Object();
editor.rescourses = [];
editor.UI = {
    mouseRect: new rectAngle(undefined, undefined, undefined, undefined, "rgba(0, 0, 255, 0.3)", true),
    mouseRectSX: undefined,
    mouseRectSY: undefined,
    setStartPoint: true,
    init: function() {
        let x = window.innerWidth/1.2;
        let incer = 0;
        let padding = 35;
        let y = 0;
        while (incer <= editor.rescourses.length) {
            if (y + padding > window.innerHeight) x += padding, y = 0;
            //physicalObjects.push(new floor(x, y, 0)); //25*25
            y += padding
            incer++;
        }
        //utilityObjects.push(this.mouseRect);
    },
    update: function() {
        if (!mouse.holding && mouse.pressed) {
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
        physicalObjects.forEach(object => {
            if (!mouse.holding && colision(mouse, object)) object.chosen = true;
            if (!mouse.pressed) {
                object.chosen = false;
                mouse.holding = false; 
                editor.UI.setStartPoint = true;
                editor.UI.mouseRect.x = undefined;
                editor.UI.mouseRect.y = undefined;
                editor.UI.mouseRect.width = undefined;
                editor.UI.mouseRect.height = undefined;
            } 
        });
        
    }
};
makeFloor();