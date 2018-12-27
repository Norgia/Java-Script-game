var canvas;
      var ctx;
      var tiles = [];
      var visitedStk = [];

      init();

      function createPoint(nRow, nCol) {
        /*Cell class*/
        var obj = {
          row: nRow,
          col: nCol,
          visited: false,
          left: true,
          right: true,
          top: true,
          bottom: true
        };
        return obj;
      }

      function init() {
        /*Initialize needed variables. */
        $("#newMazeBtn").click(reDrawMaze);
        canvas = $("#mazeCanvas")[0];
        ctx = canvas.getContext("2d");
        drawBase();

      }

      function drawLine(sX, sY, eX, eY) {
        /*Draw a line from the starting X and Y positions to  the ending X and Y positions*/
        ctx.moveTo(sX, sY);
        ctx.lineTo(eX, eY);
      }

      function drawCell(x, y, side, tile) {
        /* Draw cell based on wall properties */
        var left = tile.left;
        var right = tile.right;
        var top = tile.top;
        var bottom = tile.bottom;
        var size = 25;
        ctx.beginPath();
        if (left) {
          drawLine(x, y, x, y + size);
        }

        if (right) {
          drawLine(x + size, y, x + size, y + size);
        }

        if (bottom) {
          drawLine(x, y + size, x + size, y + size)
        }

        if (top) {
          drawLine(x, y, x + size, y);
        }
        ctx.stroke();
      }

      function drawBase() {
        /* Draw the tiles on the canvas*/
        var side = 25;
        for (var i = 0; i < 10; i++) {
          tiles[i] = [];
          for (var j = 0; j < 10; j++) {
            tiles[i].push(createPoint(i, j));
            drawCell(i * side, j * side, side, tiles[i][j]);
          }
        }
        generateMaze(0, 0);
      }

      function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      function redrawTiles() {
        var currentTile;
        clearCanvas();
        var side = 25;
        for (var i = 0; i < 10; i++) {
          for (var j = 0; j < 10; j++) {
            currentTile = tiles[i][j];
            drawCell(i * side, j * side, side, currentTile);
          }
        }
      }

      function reDrawMaze() {
        /*Button Handle for 'New Maze' */
        var startCol = Math.floor(Math.random() * 10) - 1;
        var startRow = Math.floor(Math.random() * 10) - 1;
        clearCanvas();
        drawBase();
      }

      function generateMaze(row, col) {
        /* Depth First Search*/
        var currentTile = tiles[row][col];
        var neighbor = findNeighbor(row, col);
        /*Check if cell has been visited */
        if (!currentTile.visited) {
          currentTile.visited = true;
          visitedStk.push(currentTile);
        }
        /* Break Case */
        if (visitedStk.length == 0) {
          redrawTiles();
          return;
        }
        /*If a neighbor is found*/
        else if (neighbor !== undefined) {
          /*Break the wall in between*/
          if (neighbor.row > currentTile.row) { /*Bottom*/
            currentTile.bottom = false;
            neighbor.top = false;
          }
          if (neighbor.row < currentTile.row) { /*Top*/
            currentTile.top = false;
            neighbor.bottom = false;
          }
          if (neighbor.col < currentTile.col) { /*Left*/
            currentTile.left = false;
            neighbor.right = false;
          }
          if (neighbor.col > currentTile.col) { /*Right*/
            currentTile.right = false;
            neighbor.left = false;
          }
          /*Update Current Tile*/
          currentTile = neighbor;
        }
        /*If no neighbor was found, backtrack to a previous cell on the stacke*/
        else {
          var backtrack = visitedStk.pop();
          generateMaze(backtrack.row, backtrack.col);
          currentTile = backtrack;
        }
        generateMaze(currentTile.row, currentTile.col);
      }

      function findNeighbor(row, col) {
        /*Find the neighbor of the given tile using the tiles array.*/
        var top, bottom, left, right;
        var stk = []
        var neighbor = undefined;
        var n;
        /* Check for left neighbor */
        if (row >= 0 && col > 0) {
          left = tiles[row][col - 1];
          (!left.visited) ? stk.push(left): undefined
        }

        /* Check for right neighbor */
        if (row >= 0 && col < 9) {
          right = tiles[row][col + 1];
          (!right.visited) ? stk.push(right): undefined;
        }

        /* Check for top neighbor */
        if (col >= 0 && row > 0) {
          top = tiles[row - 1][col];
          (!top.visited) ? stk.push(top): undefined
        }
        /* Check for bottom neighbor */
        if (col >= 0 && row < 9) {
          bottom = tiles[row + 1][col];
          (!bottom.visited) ? stk.push(bottom): undefined
        }


        var len;
        while (stk.length > 0) {
          /* Choose a random neighbor */
          len = stk.length;
          n = Math.floor(Math.random() * stk.length);
          neighbor = stk[n];
          if (!neighbor.visited) {
            break;
          } else {
            stk.splice(n, 1);
          }
        }
        /*Return, will return undefined if no neighbor is found*/
        return neighbor;
      }
