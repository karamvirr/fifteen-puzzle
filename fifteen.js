/**
* This is the fifteen.js file that is associated with the fifteen.html
* (Fifteen Puzzle) webpage. Handles user interaction and game animation
* (puzzles pieaces moving around) as the game of Fifteen Puzzle is being played.
*/
"use strict";
(function() {
  // represents the number of random movements required in order for the
  // puzzleboard to be adequately shuffled.
  const RANDOM_MOVEMENTS = 1000;

  // keeps track of the horizontal position of the empty tile, relative
  // to the puzzle area. initially set to the far right.
  let emptyX = "300px";

  // keeps track of the vertical position of the empty tile, relative
  // to the puzzle area. initially set to the far bottom.
  let emptyY = "300px";

  // the pageLoad function executes when the browsers's window has loaded.
  window.onload = pageLoad;

  /**
  * This function is called when the page first loads to initialize the state
  * of the game. Tiles are then created and displayed in a 4x4 grid, labeled
  * from 1 to 15. The board is set up to include an empty square in row 4
  * column 4 of the grid. At this point, the user is able to interact with and
  * play the game.
  * 
  * @param  there is no parameter type for this function.
  * @return there is no return type for this function.
  */
  function pageLoad() {
    let squareArea = $("puzzle-area");
    let max = 4;                      // 4x4 grid
    let numTiles = 1;
    for(let i = 0; i < max; i++) {    // rows
      for(let j = 0; j < max; j++) {  // columns
        if(i === 3) {
          max = 3;
        }
        let square = document.createElement("div");
        square.className = "square";
        square.style.backgroundPosition = (-100 * j) + "px " + (-100 * i) + "px";
        square.style.left = (j * 100)+ "px";
        square.style.top = (i * 100) + "px";
        square.innerHTML = numTiles;
        numTiles++;
        square.setAttribute("id", "square_" + (i + 1) + "_" + (j + 1));
        squareArea.appendChild(square);
        square.addEventListener("mouseover", function() { mouseHovering(square); });
        square.addEventListener("mouseout", function() { mouseHovering(square); });
        square.addEventListener("click", function() { moveTile(square); });
      }
    }
    $("shuffle-button").onclick = shuffle;
  }

  /**
  * This function is called whenenver the user hovers his/her mouse over a tile
  * of the puzzle game. If the tile thats the mouse is hovering over is a moveable
  * pieace (refer to moveableTile()), style is applied to the tile text/border color
  * as well as the cursor's appearance for as long as the user hovers over that
  * tile.
  * 
  * @param  the tile of the puzzleboard denoted as 'tile'.
  * @return there is no return type for this function.
  */
  function mouseHovering(tile) {
    if(moveableTile(tile)) {
      tile.classList.toggle("moveablesquare");
    }
  }

  /**
  * This function is called when the user wants the shuffle the puzzleboard.
  * The puzzleboard is radomly rearranged into a solveable state, avoiding
  * the puzzleboard configurations that are impossible to solve.
  * @param  there is no parameter type for this function.
  * @return there is no return type for this function.
  */
  function shuffle() {
    for(let i = 0; i < RANDOM_MOVEMENTS; i++) {
      let selectedTileToMove = randomNeighborSelector(emptyY, emptyX);
      moveTile(selectedTileToMove);
    }
  }

  /**
  * Finds all the neighbors for the given row and column. These neighbors are the
  * ones that are directly to the left, right, down, and up of the specified
  * row/column. After that, it will randomly select one of these neighbors and
  * return it.
  * 
  * @param  given a row and a column.
  * @return returns a DOM object that represents the randomly selected tile.
  */
  function randomNeighborSelector(row, column) {
    row = parseInt(row) / 100 + 1;
    column = parseInt(column) / 100 + 1;

    let neighbors = [];
    neighbors.push($("square_" + row + "_" + (column - 1))); // left
    neighbors.push($("square_" + row + "_" + (column + 1))); // right
    neighbors.push($("square_" + (row + 1) + "_" + column)); // top
    neighbors.push($("square_" + (row - 1) + "_" + column)); // bottom

    // filtering out all the nulls from the collection of neighbors.
    while(neighbors.includes(null)) {
      neighbors.splice(neighbors.indexOf(null), 1);
    }

    // incorporating randomness
    let randomIndex = parseInt(Math.random() * neighbors.length);
    let chosenOne = neighbors[randomIndex];
    return chosenOne;
  }

  /**
  * This function is used to determine weather not a given tile is neighbors
  * of an empty square and therefore moveable.
  * 
  * @param  the tile of the puzzleboard denoted as 'tile'.
  * @return returns true if the given tile is a neighbor of the
  *         empty square (they share one side/border on the puzzleboard), otherwise,
  *         returns false.
  */
  function moveableTile(tile) {
    let tileRow = parseInt(tile.style.top) / 100 + 1;
    let tileColumn = parseInt(tile.style.left) / 100 + 1;

    let compareRow = parseInt(emptyY) / 100 + 1;
    let compareColumn = parseInt(emptyX) / 100 + 1;

    return((tileRow === compareRow && ((tileColumn + 1) === compareColumn ||
    (tileColumn - 1) === compareColumn)) ||
    (tileColumn === compareColumn && ((tileRow + 1) === compareRow ||
    (tileRow - 1) === compareRow)));
  }

  /**
  * Given a pieace of puzzleboard 'tile', moves the tile from its current
  * position to the empty square's location only if the given tile is
  * movable (meaning that it is a neighbor of the empty square). The
  * tile's old positions becomes the empty square's new position.
  * Nothing happens if the tile clicked on cannot be moved.
  * 
  * @param  the tile of the puzzleboard denoted as 'tile'.
  * @return no return type for this function.
  */
  function moveTile(tile) {
    if(moveableTile(tile)) {
      let placeholdLeftPosition = tile.style.left;
      let placeholdTopPosition = tile.style.top;

      tile.style.top = emptyY;
      tile.style.left = emptyX;

      // adjusts the position id of the tile that has just been moved accordingly
      tile.setAttribute("id", "square_" + (parseInt(emptyY) / 100 + 1) +
      "_" + (parseInt(emptyX) / 100 + 1));

      emptyX = placeholdLeftPosition;
      emptyY = placeholdTopPosition;
    }
  }

  /**
  * Helper function to get the element by
  * 
  * @param  the string ID of the DOM element to retrieve
  * @return the DOM element denoted by the ID given
  */
  function $(id) {
    return document.getElementById(id);
  }

})();
