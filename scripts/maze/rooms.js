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

function createPathFromSegments(width, height, type) {
    let path = [];
    let startX = 0;
    let startY = 0;
    let intervalX = width - 1;
    let intervalY = height - 1;
    let pieces = [];
    
    //Copy the pieces
    let WallLeft_Path_copy = arrayClone(WallLeft_Path);
    let WallTop_Path_copy = arrayClone(WallTop_Path);
    let WallRight_Path_copy = arrayClone(WallRight_Path);
    let WallBottom_Path_copy = arrayClone(WallBottom_Path);
    let Center_Path_copy = arrayClone(Center_Path);
    let TopLeftCorner_Path_copy = arrayClone(TopLeftCorner_Path);
    let TopRightCorner_Path_copy = arrayClone(TopRightCorner_Path);
    let BottomLeftCorner_Path_copy = arrayClone(BottomLeftCorner_Path);
    let BottomRightCorner_Path_copy = arrayClone(BottomRightCorner_Path);

    //Tailor the path layouts
    switch(type) {
        case "Dead end bottom":
            pieces.push(WallLeft_Path_copy, Center_Path_copy, WallRight_Path_copy,
                        WallLeft_Path_copy, Center_Path_copy, WallRight_Path_copy,
                        BottomLeftCorner_Path_copy, WallBottom_Path_copy, BottomRightCorner_Path_copy);
        break;
        case "Dead end left":
            pieces.push(TopLeftCorner_Path_copy, WallTop_Path_copy, WallTop_Path_copy,
                        WallLeft_Path_copy, Center_Path_copy, Center_Path_copy,
                        BottomLeftCorner_Path_copy, WallBottom_Path_copy, WallBottom_Path_copy);
        break;
        case "Dead end top":
            pieces.push(TopLeftCorner_Path_copy, WallTop_Path_copy, TopRightCorner_Path_copy,
                        WallLeft_Path_copy, Center_Path_copy, WallRight_Path_copy,
                        WallLeft_Path_copy, Center_Path_copy, WallRight_Path_copy);
        break;
        case "Dead end right":
            pieces.push(WallTop_Path_copy, WallTop_Path_copy, TopRightCorner_Path_copy,
                        Center_Path_copy, Center_Path_copy, WallRight_Path_copy,
                        WallBottom_Path_copy, WallBottom_Path_copy, BottomRightCorner_Path_copy);
        break;
        ////////////////////////////////////////////////////////////////////////////////////////////
        case "Vertical path":
            pieces.push(WallLeft_Path_copy, Center_Path_copy, WallRight_Path_copy,
                        WallLeft_Path_copy, Center_Path_copy, WallRight_Path_copy,
                        WallLeft_Path_copy, Center_Path_copy, WallRight_Path_copy);
        break;
        case "Horizontal path":
            pieces.push(WallTop_Path_copy, WallTop_Path_copy, WallTop_Path_copy,
                        Center_Path_copy, Center_Path_copy, Center_Path_copy,
                        WallBottom_Path_copy, WallBottom_Path_copy, WallBottom_Path_copy);
        break;
        case "Down and right":
            pieces.push(TopLeftCorner_Path_copy, WallTop_Path_copy, WallTop_Path_copy,
                        WallLeft_Path_copy, Center_Path_copy, Center_Path_copy,
                        WallLeft_Path_copy, Center_Path_copy, Center_Path_copy);
        break;
        case "Down and left":
            pieces.push(WallTop_Path_copy, WallTop_Path_copy, TopRightCorner_Path_copy,
                        Center_Path_copy, Center_Path_copy, WallRight_Path_copy,
                        Center_Path_copy, Center_Path_copy, WallRight_Path_copy);
        break;
        case "Up and right":
            pieces.push(WallLeft_Path_copy, Center_Path_copy, Center_Path_copy,
                        WallLeft_Path_copy, Center_Path_copy, Center_Path_copy,
                        BottomLeftCorner_Path_copy, WallBottom_Path_copy, WallBottom_Path_copy);
        break;
        case "Up and left":
            pieces.push(Center_Path_copy, Center_Path_copy, WallRight_Path_copy,
                        Center_Path_copy, Center_Path_copy, WallRight_Path_copy,
                        WallBottom_Path_copy, WallBottom_Path_copy, BottomRightCorner_Path_copy);
        break;
        ////////////////////////////////////////////////////////////////////////////////////////////////
        case "Down and left and right":
                    pieces.push(WallTop_Path_copy, WallTop_Path_copy, WallTop_Path_copy,
                        Center_Path_copy, Center_Path_copy, Center_Path_copy,
                        Center_Path_copy, Center_Path_copy, Center_Path_copy);
        break;
        case "Down and up and left":
                    pieces.push(Center_Path_copy, Center_Path_copy, WallRight_Path_copy,
                        Center_Path_copy, Center_Path_copy, WallRight_Path_copy,
                        Center_Path_copy, Center_Path_copy, WallRight_Path_copy);
        break;
        case "Up and left and right":
                        pieces.push(Center_Path_copy, Center_Path_copy, Center_Path_copy,
                            Center_Path_copy, Center_Path_copy, Center_Path_copy,
                            WallBottom_Path_copy, WallBottom_Path_copy, WallBottom_Path_copy);
        break;
        case "Down and up and right":
                        pieces.push(WallLeft_Path_copy, Center_Path_copy, Center_Path_copy,
                            WallLeft_Path_copy, Center_Path_copy, Center_Path_copy,
                            WallLeft_Path_copy, Center_Path_copy, Center_Path_copy);
        break;
        /////////////////////////////////////////////////////////////////////////////////////////////////
        case "Four way cross":
                        pieces.push(Center_Path_copy, Center_Path_copy, Center_Path_copy,
                            Center_Path_copy, Center_Path_copy, Center_Path_copy,
                            Center_Path_copy, Center_Path_copy, Center_Path_copy);
        break;
    }
    for (let y = startY; y <= intervalY; y++) {
        for (let x = startX; x <= intervalX; x++) {
            //Top Left
            if (y == startY && x == startX) {
                let clone = arrayClone(pieces[0]);
                path.push(clone[randomIntFromRange(0, pieces[0].length - 1)])
            }
            //Top Mid
            else if (y == startY && x > startX && x < intervalX) {
                let clone = arrayClone(pieces[1]);
                room.push(clone[randomIntFromRange(0, pieces[1].length - 1)]);
            }
            //Top Right Corner
            else if (y == startY && x == intervalX) {
                let clone = arrayClone(pieces[2]);
                room.push(clone[randomIntFromRange(0, pieces[2].length - 1)]);
            }
            //Mid Left
            else if (y > startY && y < intervalY && x == startX) {
                let clone = arrayClone(pieces[3]);
                room.push(clone[randomIntFromRange(0, pieces[3].length - 1)]);
            }
            //Mid Mid
            else if (y > startY && y < intervalY && x > startX && x < intervalX) {
                let clone = arrayClone(pieces[4]);
                room.push(clone[randomIntFromRange(0, pieces[4].length - 1)]);
            }
            //Mid Right
            else if (y > startY && y < intervalY && x == intervalX) {
                let clone = arrayClone(pieces[5]);
                room.push(clone[randomIntFromRange(0, pieces[5].length - 1)]);
            }
            //Bottom Left Corner
            else if (y == intervalY && x == startX) {
                let clone = arrayClone(pieces[6]);
                room.push(clone[randomIntFromRange(0, pieces[6].length - 1)]);
            }
            //Bottom Mid
            else if (y == intervalY && x > startX && x < intervalX) {
                let clone = arrayClone(pieces[7]);
                room.push(clone[randomIntFromRange(0, pieces[7].length - 1)]);
            }
            //Bottom Right Corner
            else {
                let clone = arrayClone(pieces[8]);
                room.push(clone[randomIntFromRange(0, pieces[8].length - 1)]);
            }
        }
    }
  return path;
}

function buildWithSegments(width, height, startX, startY, segmentWidth, segmentHeight, room, type) {
    let piceArray3D;
    if (room) piceArray3D = createRoomFromSegments(width, height);
    else piceArray3D = createPathFromSegments(width, height, type);

    let minX = Infinity;
    let minY = Infinity;

    let distArray = [];

    //Find the right-most cordinate for the segments
    for (let i = 0; i < piceArray3D.length; i++) {
        for(let j = 0; j < piceArray3D[i].length; j++) {
            for(let k = 0; k < piceArray3D[i][j].length; k++) {
                let type = piceArray3D[i][j][0];
                if (type == "premade_floor" || type == "floor") {
                    let tileX = piceArray3D[i][j][1];
                    let tileY = piceArray3D[i][j][2];
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
    for (let x = 0; x < piceArray3D.length; x++) {
        let yDist = incerY - distArray[x][1];
        for (let y = 0; y < piceArray3D[x].length; y++) {;
                let xDist = incerX - distArray[x][0];
                piceArray3D[x][y][1] += xDist;
                piceArray3D[x][y][2] += yDist;      
            }
        incerX += segmentWidth;
        if (x == factor*width-1) incerY += segmentHeight, incerX = startX, factor++;
    }
    
    //Build a big room out of the smaller room-segments
    let piceArray2D = [];
    for (let i = 0; i < piceArray3D.length; i++) {
        piceArray2D = piceArray2D.concat(piceArray3D[i]);
    }
    return piceArray2D;
}


let testSegmentBuild = buildWithSegments(3, 3, 0, 0, 640, 640, true);
buildRoomFromData(testSegmentBuild);

function switchRoom(from, too) { 
    from = updateRoomData();
    //buildRoomFromData(too);
}




