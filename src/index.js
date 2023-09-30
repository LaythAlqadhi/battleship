export class Ship {
  constructor(length, isHorizontal = true) {
    this.length = length;
    this.hits = 0;
    this.sunk = false;
    this.isHorizontal = isHorizontal;
  }

  hit() {
    this.hits++;
    if (this.hits === this.length) {
      this.sunk = true;
    }
  }

  isSunk() {
    return this.sunk;
  }
}

export class Gameboard {
  constructor() {
    this.board = this.createBoard();
    this.missedShots = [];
    this.hitShots = [];
  }

  createBoard() {
    const board = [];
    for (let i = 0; i < 10; i++) {
      const row = [];
      for (let j = 0; j < 10; j++) {
        row.push(null);
      }
      board.push(row);
    }
    return board;
  }

  placeShip(ship, row, col) {
    if (this.canPlaceShip(ship, row, col)) {
      console.log(ship.length);
      for (let i = 0; i < ship.length; i++) {
        if (ship.isHorizontal) {
          this.board[row][col + i] = ship;
        } else {
          this.board[row + i][col] = ship;
        }
      }
      return true;
    }
    return false;
  }

  autoPlaceShips(length) {
    while (true) {
      const isHorizontal = Math.random() < 0.5;
      const row = Math.floor(Math.random() * 10);
      const col = Math.floor(Math.random() * 10);
      const ship = new Ship(length, isHorizontal);
      if (this.canPlaceShip(ship, row, col)) {
        this.placeShip(ship, row, col);
        break;
      }
    }
  }

  canPlaceShip(ship, row, col) {
    if (ship.isHorizontal) {
      if (ship.length + col > 10) {
        return false;
      }

      for (let i = 0; i < ship.length; i++) {
        if (this.board[row][col + i] !== null) {
          return false;
        }
      }
    } else {
      if (ship.length + row > 10) {
        return false;
      }

      for (let i = 0; i < ship.length; i++) {
        if (this.board[row + i][col] !== null) {
          return false;
        }
      }
    }
    return true;
  }

  receiveAttack(row, col) {
    if (this.board[row][col] !== null) {
      if (this.board[row][col] instanceof Ship) {
        const ship = this.board[row][col];
        ship.hit();
        this.recordHitShot(row, col);
        return true;
      }
    } else {
      this.recordMissedShot(row, col);
      return false;
    }
  }

  recordMissedShot(row, col) {
    this.missedShots.push([row, col]);
    this.board[row][col] = "miss";
  }

  recordHitShot(row, col) {
    this.hitShots.push([row, col]);
    this.board[row][col] = "hit";
  }

  areAllShipsSunk() {
    return this.hitShots.length === 17;
  }
}

export class Player {
  constructor(name) {
    this.name = name;
    this.pastMoves = new Set();
  }

  takeTurn(enemyGameboard, row, col) {
    if (!this.pastMoves.has(`${row}-${col}`)) {
      this.pastMoves.add(`${row}-${col}`);
      enemyGameboard.receiveAttack(row, col);
      return true;
    } else {
      return false;
    }
  }
}

export class Computer {
  constructor() {
    this.name = "Computer";
    this.pastMoves = new Set();
    this.lastHit = null;
  }

  takeTurn(enemyGameboard) {
    let row, col;

    if (this.lastHit) {
      const adjacentPositions = [
        { row: this.lastHit.row - 1, col: this.lastHit.col },
        { row: this.lastHit.row + 1, col: this.lastHit.col },
        { row: this.lastHit.row, col: this.lastHit.col - 1 },
        { row: this.lastHit.row, col: this.lastHit.col + 1 },
      ];

      const validPositions = adjacentPositions.filter((pos) => {
        const key = `${pos.row}-${pos.col}`;
        return (
          pos.row >= 0 &&
          pos.row < 10 &&
          pos.col >= 0 &&
          pos.col < 10 &&
          !this.pastMoves.has(key)
        );
      });

      if (validPositions.length > 0) {
        const randomIndex = Math.floor(Math.random() * validPositions.length);
        row = validPositions[randomIndex].row;
        col = validPositions[randomIndex].col;
      } else {
        do {
          row = Math.floor(Math.random() * 10);
          col = Math.floor(Math.random() * 10);
        } while (this.pastMoves.has(`${row}-${col}`));
      }
    } else {
      do {
        row = Math.floor(Math.random() * 10);
        col = Math.floor(Math.random() * 10);
      } while (this.pastMoves.has(`${row}-${col}`));
    }

    this.pastMoves.add(`${row}-${col}`);
    const attackResult = enemyGameboard.receiveAttack(row, col);

    if (attackResult) {
      this.lastHit = { row, col };
    } else {
      this.lastHit = null;
    }

    return attackResult;
  }
}