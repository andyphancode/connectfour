/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

// -x- notes self comments

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // Set "board" to empty HEIGHT x WIDTH matrix array
  for (let i = 0; i < HEIGHT; i++) {
    for (let j = 0; j < WIDTH; j++) {
      if (board[i] === undefined){
        board[i] = [null]; // Create an array for width if not already present -x-
      } else {
            board[i][j] = null; // If array for width already present, set coordinate to null -x-
      }
    }
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {

  // Get "htmlBoard" variable from the item in HTML w/ID of "board" -x-
  const htmlBoard = document.querySelector("#board");

  // Create top row to slot in pieces, give it a id of column-top and code it so function called handleClick is called each time it is clicked
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  // Append cells to the top row
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }

  // Append top element to the htmlBoard
  htmlBoard.append(top);

  // Create the rest of the board and append the rows to htmlBoard, each cell has id of y-x -x-
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {

  for(let i = HEIGHT-1; i > -1; i--){
    // Returns null if coordinate is out of legal bounds -x-
    if (board[0][x] !== null){
      return null;
    }
    // Returns y coordinate if within legal bounds and empty, prioritizing lowest free cell -x-
    if (board[i][x] === null) {
      return i;
    }
  }
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // make a div, add a class and insert into correct table cell
  const div = document.createElement("div");
  div.classList.add("piece");
  currPlayer === 1 ? div.classList.add("player1") : div.classList.add("player2")
  const td = document.getElementById(`${y}-${x}`);
  td.append(div);
}

/** endGame: announce game end */

function endGame(msg) {
  alert(msg);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // indicate currrent player
  currPlayer === 1 ? document.querySelector("#game").style.borderColor = "rgb(82, 82, 236)" : document.querySelector("#game").style.borderColor = "rgb(245, 48, 48)";

  // get x from ID of clicked cell
  const x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  // add line to update in-memory board
  placeInTable(y, x);
  board[y][x] = currPlayer;

  // Holding code, not sure why transition for top property did not function -x-
  // document.getElementById(`${y}-${x}`).firstElementChild.style.top = "0px";
 
  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  // check if all cells in board are filled; if so call, call endGame for a Tie -x-
  
  const tieGameCheck = board.every(currentValue => currentValue.every(value => value !== null))

  if (tieGameCheck) {
    endGame("Tie!");
  }

  // switch players
  currPlayer === 1 ? currPlayer = 2 : currPlayer = 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }


  // Loops through every y,x combination -x-
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      // Creates an array that spans in several directions -x-
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
      // Passes each array into the _win function, which checks if the coordinates are within the board (legal) and if they match currPlayer by destructuring -x-
      // Returns true if the _win function returns true, which causes the checkForWin function to return true and call endGame -x-
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

// Reset button functionality

const reset = document.querySelector("button");

reset.addEventListener('click', function(){
  document.querySelector("#board").innerHTML = '';
  currPlayer = 1;
  board = [];
  makeBoard();
  makeHtmlBoard();
});

makeBoard();
makeHtmlBoard();


