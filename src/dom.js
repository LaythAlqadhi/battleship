import { Ship, Gameboard, Player, Computer } from "./index.js";
import "./index.css";

const player = new Player("Player");
const computer = new Computer();
const playerGameboard = new Gameboard();
const computerGameboard = new Gameboard();

let isPlayerTurn = true;
let isHorizontal = true;
let isGameStarted = false;
let count = 0;

function isGameOver() {
  if (playerGameboard.areAllShipsSunk()) {
    alert("Computer wins!");
    return true;
  } else if (computerGameboard.areAllShipsSunk()) {
    alert("You win!");
    return true;
  }
  return false;
}

function attackMode(row, col) {
  if (!isGameOver()) {
    count = 0;
    while (!isGameOver() && count < 2) {
      isPlayerTurn
        ? player.takeTurn(computerGameboard, row, col)
        : computer.takeTurn(playerGameboard);
      isPlayerTurn = !isPlayerTurn;
      renderGameBoard(playerGameboard);
      renderGameBoard(computerGameboard);
      count++;
    }
  }
}

function placeShipsMode(row, col) {
  const length = [5, 4, 3, 3, 2];
  const ship = new Ship(length[count], isHorizontal);
  if (playerGameboard.canPlaceShip(ship, row, col)) {
    playerGameboard.placeShip(ship, row, col);
    computerGameboard.autoPlaceShips(length[count]);
    count++;
    renderGameBoard(playerGameboard);
  }
  if (length[count] === undefined) {
    isGameStarted = true;
    hideSwitchButton();
    renderGameBoard(computerGameboard);
    count = 0;
  }
}

function gameLoop(row, col) {
  isGameStarted ? attackMode(row, col) : placeShipsMode(row, col);
}

function createGameUI() {
  const title = document.createElement("h1");
  title.textContent = "Battleship";
  document.body.appendChild(title);

  const horizontal = document.createElement("button");
  horizontal.classList = "horizontal direction active";
  horizontal.textContent = "Horizontal";
  document.body.appendChild(horizontal);

  const vertical = document.createElement("button");
  vertical.classList = "vertical direction";
  vertical.textContent = "Vertical";
  document.body.appendChild(vertical);

  handleDirectionButtonsEvent(horizontal, vertical);

  const gameContainer = document.createElement("div");
  gameContainer.classList = "game-container";
  document.body.appendChild(gameContainer);

  const playerBoard = document.createElement("div");
  playerBoard.classList = "player-board";
  gameContainer.appendChild(playerBoard);

  const playerBoardTitle = document.createElement("h2");
  playerBoardTitle.textContent = "Your Board";
  playerBoard.appendChild(playerBoardTitle);

  const playerGrid = document.createElement("div");
  playerGrid.classList = "player-grid grid";
  playerBoard.appendChild(playerGrid);
  createGrid(playerGrid);

  const computerBoard = document.createElement("div");
  computerBoard.classList = "computer-board";
  gameContainer.appendChild(computerBoard);

  const computerBoardTitle = document.createElement("h2");
  computerBoardTitle.textContent = "Computer's Board";
  computerBoard.appendChild(computerBoardTitle);

  const computerGrid = document.createElement("div");
  computerGrid.classList = "computer-grid grid";
  computerBoard.appendChild(computerGrid);
  createGrid(computerGrid);
}
createGameUI();

function createGrid(element) {
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = i;
      cell.dataset.col = j;
      element.appendChild(cell);
    }
  }
}

function renderGameBoard(gameboard) {
  const gridSelector = isGameStarted
    ? getGridSelector(gameboard)
    : ".player-grid .cell";
  const cells = document.querySelectorAll(gridSelector);

  cells.forEach((cell) => {
    const { row, col } = getCellCoordinates(cell);
    const value = gameboard.board[row][col];

    isGameStarted
      ? handleCellForGameStarted(cell, value)
      : handleCellForGameNotStarted(cell, value);
  });
}

function getGridSelector(gameboard) {
  return gameboard === playerGameboard
    ? ".computer-grid .cell"
    : ".player-grid .cell";
}

function getCellCoordinates(cell) {
  const row = parseInt(cell.dataset.row);
  const col = parseInt(cell.dataset.col);
  return { row, col };
}

function handleCellForGameStarted(cell, value) {
  if (value === null) {
    cell.classList.remove("miss", "hit");
  } else if (value === "miss") {
    cell.classList.remove("hit");
    cell.classList.add("miss");
  } else if (value === "hit") {
    cell.classList.remove("miss");
    cell.classList.add("hit");
  }

  cell.classList.remove("ship");
}

function handleCellForGameNotStarted(cell, value) {
  if (value instanceof Ship && !cell.classList.contains("ship")) {
    cell.classList.add("ship");
  }
}

function handleCellsEvent() {
  const cells = document.querySelectorAll(".player-grid .cell");
  cells.forEach((cell) => {
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    cell.addEventListener("click", () => gameLoop(row, col));
  });
}
handleCellsEvent();

function handleDirectionButtonsEvent(h, v) {
  h.addEventListener("click", () => {
    h.classList.remove("active");
    v.classList.add("active");
    isHorizontal = false;
  });
  v.addEventListener("click", () => {
    v.classList.remove("active");
    h.classList.add("active");
    isHorizontal = true;
  });
}

function hideSwitchButton() {
  const directions = document.querySelectorAll(".direction");
  directions.forEach((direction) => direction.classList.remove("active"));
}