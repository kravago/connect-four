/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

class Player {
  constructor(color) {
    this.color = color;
  }
}

class Game {
  constructor(p1, p2, height, width) {
    this.board = [];
    this.players = [p1, p2];
    this.currPlayer = p1;
    this.gameStarted = true;

    // default height and width handling
    if (height === null) {
      this.height = 6;
    } else {
      this.height = height;
    }

    if (width === null) {
      this.width = 7;
    } else {
      this.width = width;
    }

    // construct board
    this.makeBoard();
    this.makeHtmlBoard();
  }
  
  makeBoard() {
    this.board = []
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width }));
    }
  }

  handleGameStart(evt) {
    this.gameStarted = true;
    alert("Game has started!");
  }  

  handleReset(evt) {
    this.makeBoard();
    this.makeHtmlBoard();
  }

  makeHtmlBoard() {
    // make buttons
    const start = document.querySelector('#start')
    const reset = document.querySelector('#reset')
    // start.addEventListener("click", this.handleGameStart.bind(this));
    reset.addEventListener("click", this.handleReset.bind(this));

    const board = document.getElementById('board');
    board.innerHTML = '';
  
    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.addEventListener('click', this.handleClick.bind(this));
  
    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }
  
    board.append(top);
  
    // make main part of board
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');
  
      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }
  
      board.append(row);
    }
  }

  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!(this.board[y][x])) {
        return y;
      }
    }
    return null;
  }
  
  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.style.backgroundColor = this.currPlayer.color;
    piece.style.top = -50 * (y + 2);
  
    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  endGame(msg) {
    alert(msg);
    this.gameStarted = false;
  }

  handleClick(evt) {
    // if game hasnt started, ignore clicks
    if (this.gameStarted === false) return;
    
    // get x from ID of clicked cell
    const x = +evt.target.id;
    
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }
  
    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);
    
    // check for win
    if (this.checkForWin()) {
      return this.endGame(`${this.currPlayer.color} Player won!`);
    }
    
    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }
      
    // switch players
    this.currPlayer = this.currPlayer === this.players[0] ? this.players[1] : this.players[0];
  }
  
  checkForWin() {
    function _win(cells) {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer
  
      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
      );
    }
    
    let boundWin = _win.bind(this);

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
  
        // find winner (only checking each win-possibility as needed)
        if (boundWin(horiz) || boundWin(vert) || boundWin(diagDR) || boundWin(diagDL)) {
          return true;
        }
      }
    }
  }


}

let start = document.querySelector('#start');
start.addEventListener('click', () => {
  let colorP1 = document.querySelector('#player1');
  let colorP2 = document.querySelector('#player2');
  let p1 = new Player(colorP1.value);
  let p2 = new Player(colorP2.value);
  new Game(p1, p2, 6, 7);
})