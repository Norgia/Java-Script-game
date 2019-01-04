function extractRoomDataConsole() {
    for (let i = 0; i < physicalObjects.length; i++) {
        let object = physicalObjects[i];
        if (object === hero) continue;
        let type = object.constructor.name;
        let string = "[" + "'" + type + "'" + ", " + object.x + ", " + object.y + ", " + object.type + ", " + object.zIndex + "], ";

        if (i === 0) string = "[" + string;;
        console.log(string);
    }
    let string = "['game.camera.boundBox', " + game.camera.boundBox.x + ", " + game.camera.boundBox.y + ", " + game.camera.boundBox.width + ", " + game.camera.boundBox.height + "]";
    string = string + "]";
    string += ";",
    console.log(string);
}

function updateRoomData() {
    roomData = []
    for (let i = 0; i < physicalObjects.length; i++) {
        let objectArray = [];
        let object = physicalObjects[i];
        if (object === hero) continue;
        let type = object.constructor.name;
        objectArray.push(type, object.x, object.y, object.type, object.zIndex);
        roomData.push(objectArray);
    }
    roomData.push(["game.camera.boundBox", game.camera.boundBox.x, game.camera.boundBox.y, game.camera.boundBox.width, game.camera.boundBox.height]);
    return roomData
}

function buildRoomFromData(data) {
    physicalObjects = []; // clear all old objects
    physicalObjects.push(hero);
    //Handle camera
    for (let i = 0; i < data.length; i++) {
        if (data[i][0] == 'game.camera.boundBox') game.camera.boundBox = new rectAngle(data[i][1], data[i][2], data[i][3], data[i][4], "orange", false);
        else {
            let str = "physicalObjects.push(" + "new " + data[i][0] + "(" + data[i][1] + ", " + data[i][2] + ", " + data[i][3] + ", " + data[i][4] + "));";
            eval(str);
        }
    }
}

function createRoomFromSegments(width, height) {
    let room = [];
    let startX = 0;
    let startY = 0;
    let intervalX = width-1;
    let intervalY = height-1;

    for (let y = startY; y <= intervalY; y++) {
        for (let x = startX; x <= intervalX; x++) {
            
            //Top Left Corner 
            if (y == startY && x == startX) {
                let clone = arrayClone(TopLeft);
                room.push(clone[randomIntFromRange(0, TopLeft.length - 1)]);
            }
            //Top Mid
            else if (y == startY && x > startX && x < intervalX) {
                let clone = arrayClone(TopMid);
                room.push(clone[randomIntFromRange(0, TopMid.length - 1)]);
            }
            //Top Right Corner
            else if (y == startY && x == intervalX) {
                let clone = arrayClone(TopRight);
                room.push(clone[randomIntFromRange(0, TopRight.length - 1)]);
            }
            //Mid Left
            else if (y > startY && y < intervalY && x == startX) {
                let clone = arrayClone(MidLeft);
                room.push(clone[randomIntFromRange(0, MidLeft.length - 1)]);
            }
            //Mid Mid
            else if (y > startY && y < intervalY && x > startX && x < intervalX) {
                let clone = arrayClone(MidMid);
                room.push(clone[randomIntFromRange(0, MidMid.length - 1)]);
            } 
            //Mid Right
            else if (y > startY && y < intervalY && x == intervalX) {
                let clone = arrayClone(MidRight);
                room.push(clone[randomIntFromRange(0, MidRight.length - 1)]);
            }
            //Bottom Left Corner
            else if (y == intervalY && x == startX) {
                let clone = arrayClone(BottomLeft);
                room.push(clone[randomIntFromRange(0, BottomLeft.length - 1)]);
            }
            //Bottom Mid
            else if (y == intervalY && x > startX && x < intervalX) {
                let clone = arrayClone(BottomMid);
                room.push(clone[randomIntFromRange(0, BottomMid.length - 1)]);
            }
            //Bottom Right Corner
            else {
                let clone = arrayClone(BottomRight);
                room.push(clone[randomIntFromRange(0, BottomRight.length - 1)]);
            }
        }
    }
    return room;  
}

function buildSegmentRoom(width, height, startX, startY, roomWidth, roomHeight) {
    let roomArray3D = createRoomFromSegments(width, height);

    let minX = Infinity;
    let minY = Infinity;

    let distArray = [];

    //Find the right-most cardinates for the top corner room
    for (let k = 0; k < roomArray3D.length; k++) {
        for(let i = 0; i < roomArray3D[k].length; i++) {
            for(let j = 0; j < roomArray3D[k][i].length; j++) {
                let type = roomArray3D[k][i][0];
                if (type == "premade_floor" || type == "floor") {
                    let tileX = roomArray3D[k][i][1];
                    let tileY = roomArray3D[k][i][2];
                    if (tileX < minX) minX = tileX;
                    if (tileY < minY) minY = tileY;
                }
            }
        }   
        distArray.push([minX, minY]);
        minX = Infinity;
        minY = Infinity;
    }
    //Translate the cordinates so the pieces can fit
    let incerX = startX;
    let incerY = startY;
    let factor = 1;
    for (let x = 0; x < roomArray3D.length; x++) {
        let yDist = incerY - distArray[x][1];
        for (let y = 0; y < roomArray3D[x].length; y++) {;
                let xDist = incerX - distArray[x][0];
                roomArray3D[x][y][1] += xDist;
                roomArray3D[x][y][2] += yDist;      
            }
        incerX += roomWidth;
        if (x == factor*width-1) incerY += roomHeight, incerX = startX, factor++;
    }
    
    //Build a big room out of the smaller room-segments
    let roomArray2D = [];
    for (let i = 0; i < roomArray3D.length; i++) {
        roomArray2D = roomArray2D.concat(roomArray3D[i]);
    }
    //console.log(roomArray2D);
    return roomArray2D;
}

let testSegmentBuild = buildSegmentRoom(3, 3, 0, 0, 320, 320);
buildRoomFromData(testSegmentBuild);

function switchRoom(from, too) { 
    from = updateRoomData();
    //buildRoomFromData(too);
}




