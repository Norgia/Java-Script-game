function Maze(w, h, bias)
{
	this.w = (isNaN(w) || w < 5 || w > 999 ? 20 : w);
	this.h = (isNaN(h) || h < 5 || h > 999 ? 20 : h);
	this.map = new Array();
	for(var mh = 0; mh < h; ++mh) { this.map[mh] = new Array(); for(var mw = 0; mw < w; ++mw) { this.map[mh][mw] = {'n':0,'s':0,'e':0,'w':0}; } }

	var bias = (typeof bias=='undefined' || (bias!='ne' && bias!='nw' && bias!='sw' && bias!='se') ? 'nw' : bias);

	this.build(bias);
	this.mapWidth;
	this.mapheight;
}
Maze.prototype.toGrid = function()
{
	var grid = new Array();
	for(var mh = 0; mh < (this.h * 2 + 1); ++mh) { grid[mh] = new Array(); for(var mw = 0; mw < (this.w * 2 + 1); ++mw) { grid[mh][mw] = 0; } }

	for(var y = 0; y < this.h; ++ y)
	{
		var py = (y * 2) + 1;

		for(var x = 0; x < this.w; ++x)
		{
			var px = (x * 2) + 1;

			grid[py][px] = 1;

			if(this.map[y][x]['n']==1) { grid[(py-1)][px] = 1; }
			if(this.map[y][x]['s']==1) { grid[(py+1)][px] = 1; }
			if(this.map[y][x]['e']==1) { grid[py][(px+1)] = 1; }
			if(this.map[y][x]['w']==1) { grid[py][(px-1)] = 1; }
		}
	}

	this.gridMap = grid;
	this.gridW	= grid.length;
	this.gridH	= grid[0].length;
};

Maze.prototype.build = function(dir)
{
	if(typeof dir=='undefined' || (dir!='nw' && dir!='ne' && dir!='sw' && dir!='se')) { dir = 'se'; }

	var dirs = new Array();
	dirs.push(dir=='ne' || dir=='nw' ? 'n' : 's');
	dirs.push(dir=='ne' || dir=='se' ? 'e' : 'w');

	for(var y = 0; y < this.h; ++y)
	{
		var trueY = (dir=='nw' || dir=='ne' ? this.h-(y+1) : y);

		for(var x = 0; x < this.w; ++x)
		{
			var trueX = (dir=='nw' || dir=='sw' ? this.w-(x+1) : x);
			var m = 0;

			// If we're at the opposite corners for our movement, break!
			if(trueY==0 && dirs[0]=='n' && ((trueX==0 && dirs[1]=='w') || (trueX==(this.w-1) && dirs[1]=='e'))) { break; }
			if(trueY==(this.h-1) && dirs[0]=='s' && ((trueX==0 && dirs[1]=='w') || (trueX==(this.w-1) && dirs[1]=='e'))) { break; }

			// If we're at an opposite border, move the only way we can...
			if(trueY==0 && dirs[0]=='n') { this.map[trueY][trueX][dirs[1]] = 1; this.map[trueY][(trueX+(dirs[1]=='w'?-1:1))][(dirs[1]=='w'?'e':'w')] = 1; m = 1; }
			else if(trueY==(this.h-1) && dirs[0]=='s') { this.map[trueY][trueX][dirs[1]] = 1; this.map[trueY][(trueX+(dirs[1]=='w'?-1:1))][(dirs[1]=='w'?'e':'w')] = 1; m = 1; }
			else if(trueX==0 && dirs[1]=='w') { this.map[trueY][trueX][dirs[0]] = 1; this.map[(trueY+(dirs[0]=='n'?-1:1))][trueX][(dirs[0]=='n'?'s':'n')] = 1; m = 1; }
			else if(trueX==(this.w-1) && dirs[1]=='e') { this.map[trueY][trueX][dirs[0]] = 1; this.map[(trueY+(dirs[0]=='n'?-1:1))][trueX][(dirs[0]=='n'?'s':'n')] = 1; m = 1; }

			if(m==0)
			{
				var mov = dirs[Math.floor((Math.random()*1000)%2)];

				if(mov=='n') { this.map[trueY][trueX][mov] = 1; this.map[(trueY-1)][trueX]['s'] = 1; }
				else if(mov=='s') { this.map[trueY][trueX][mov] = 1; this.map[(trueY+1)][trueX]['n'] = 1; }
				else if(mov=='w') { this.map[trueY][trueX][mov] = 1; this.map[trueY][(trueX-1)]['e'] = 1; }
				else if(mov=='e') { this.map[trueY][trueX][mov] = 1; this.map[trueY][(trueX+1)]['w'] = 1; }
			}
		}
	}
	this.toGrid();
};

Maze.prototype.createRooms = function(amount) {
	for(let i = 0; i < amount; i++) {
		let randomCell = 0;
		let xCord = undefined;
		let yCord = undefined;
		while (randomCell != 1) {
			xCord = randomIntFromRange(0, this.gridW - 1);
			yCord = randomIntFromRange(0, this.gridH - 1);
			randomCell = this.gridMap[xCord][yCord];
		}
		this.gridMap[xCord][yCord] = 2;
	}
}

Maze.prototype.draw = function() {

	if(c==null) { return; }

	for(var y = 0; y < this.gridH; ++y)
	{
		if(this.gridMap[y] == undefined) continue;
		for(var x = 0; x < this.gridW; ++x)
		{
			c.fillStyle = "rgba(255, 165, 0, 0.7)";
			if(this.gridMap[x][y]==0) { c.fillRect(10* x, 10 * y, 10, 10); }
			
			c.fillStyle = "rgba(0, 255, 255, 0.7)";
			if (this.gridMap[x][y]==2) { c.fillRect(10 * x, 10 * y, 10, 10);}
		}
	}
};

Maze.prototype.update = function(dt) {

};

Maze.prototype.checkTypes = function() {
	let allTypes = [];
	
	for (var y = 0; y < this.gridH; ++y) {
		if (this.gridMap[y] == undefined) continue;
		for (var x = 0; x < this.gridW; ++x) {
			let self = this.gridMap[x][y];
			if (self == 0) continue;

			let TMCell = this.gridMap[x][y-1];
			
			let MLCell = this.gridMap[x-1][y];
			let MRCell = this.gridMap[x+1][y];

			let BMCell = this.gridMap[x][y+1];

			// type 
			let type = [];
			type.push(x, y);

			// one path/3 blocks/4c3 = 4
			if(MLCell == 0 && BMCell == 0 && MRCell == 0) type.push("Dead end bottom");
			else if(TMCell == 0 && MLCell == 0 && BMCell == 0) type.push("Dead end left");
			else if(MLCell == 0 && TMCell == 0 && MRCell == 0) type.push("Dead end top");
			else if(MRCell == 0 && TMCell == 0 && BMCell == 0) type.push("Dead end right");
			// two paths/2 blocks/4c2 = 6
			else if(MLCell == 0 && MRCell == 0) type.push("Vertical path");
			else if(TMCell == 0 && BMCell == 0) type.push("Horizontal path");
			else if(MLCell == 0 && TMCell == 0) type.push("Down and right");
			else if(TMCell == 0 && MRCell == 0) type.push("Down and left");
			else if(MLCell == 0 && BMCell == 0) type.push("Up and right");
			else if(BMCell == 0 && MRCell == 0) type.push("Up and left");
			// three paths/1 block/4c1 = 4
			else if(TMCell == 0) type.push("Down and left and right");
			else if(MRCell == 0) type.push("Down and up and left");
			else if(BMCell == 0) type.push("Up and left and right");
			else if(MLCell == 0) type.push("Down and up and right")
			// four paths/ 0 blocks/4c0 = 1
			else {
				type.push("Four way cross");
			}
			if (self == 2) type.push("Room");
			allTypes.push(type);
		}
	}
	//console.log(allTypes);
	return allTypes;
}

Maze.prototype.buildLevel = function (width, height, startX, startY, roomSegmentWidth, roomSegmentHeight, pathSegmentWidth, pathSegmentHeight) {
	let map = [];
	let isRoom = Boolean;
	let types = this.checkTypes();

	let currentX = startX;
	let currentY = startY;

	let segmentWidth, segmentHeight;

	for(let i = 0; i < types.length; i++) {
		let mapType = types[i];
		//Check if the mapsegment is a room
		if (mapType[3] == undefined) isRoom = false, segmentWidth = pathSegmentWidth, segmentHeight = pathSegmentHeight;
		else isRoom = true, segmentWidth = roomSegmentWidth, segmentHeight = roomSegmentHeight;

		let factorX = mapType[0]-1;
		let factorY = mapType[1]-1;

		currentX = startX + factorX * width * segmentWidth;
		currentY = startY + factorY * height * segmentHeight;

		console.log(segmentWidth);

		let mapSegment = buildWithSegments(width, height, currentX, currentY, segmentWidth, segmentHeight, isRoom, mapType[2]);
		buildRoomFromData(mapSegment, false);
	}
}

let mazeMap = new Maze(5, 5, "nw");
utilityObjects.push(mazeMap);
mazeMap.createRooms(0);
mazeMap.checkTypes();
mazeMap.buildLevel(3, 3, 0, 0, 576, 576, 192, 192);