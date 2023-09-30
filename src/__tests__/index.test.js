import { Ship, Gameboard, Player, Computer } from '../index.js';

describe('Ship', () => {
  test('ship should be created correctly', () => {
    const ship = new Ship(3, true);
    expect(ship.length).toBe(3);
    expect(ship.hits).toBe(0);
    expect(ship.sunk).toBe(false);
    expect(ship.isHorizontal).toBe(true);
  });

  test('ship should be marked as sunk when hit enough times', () => {
    const ship = new Ship(2);
    ship.hit();
    ship.hit();
    expect(ship.sunk).toBe(true);
  });
});

describe('Gameboard', () => {
  test('should place a ship on the board correctly', () => {
    const gameboard = new Gameboard();
    const ship = new Ship(3, true);
    const placed = gameboard.placeShip(ship, 0, 0);
    expect(placed).toBe(true);
    expect(gameboard.board[0][0]).toBe(ship);
    expect(gameboard.board[0][1]).toBe(ship);
    expect(gameboard.board[0][2]).toBe(ship);
  });

  test('should not place a ship if the placement is invalid', () => {
  const gameboard = new Gameboard();
  const ship1 = new Ship(4, true);
  const ship2 = new Ship(3, false);
  gameboard.placeShip(ship1, 0, 0);
  const placed = gameboard.placeShip(ship2, 0, 3);
  expect(placed).toBe(false);
  expect(gameboard.board[0][4]).toBe(null);
});


  test('should handle receiving a hit correctly', () => {
    const gameboard = new Gameboard();
    const ship = new Ship(2, true);
    gameboard.placeShip(ship, 0, 0);
    const result = gameboard.receiveAttack(0, 0);
    expect(result).toBe(true);
    expect(ship.hits).toBe(1);
    expect(gameboard.hitShots.length).toBe(1);
  });

  test('should handle receiving a miss correctly', () => {
    const gameboard = new Gameboard();
    const result = gameboard.receiveAttack(0, 0);
    expect(result).toBe(false);
    expect(gameboard.missedShots.length).toBe(1);
  });


  test('should check if all ships are sunk correctly', () => {
    const gameboard = new Gameboard();
    const ship1 = new Ship(8, true);
    const ship2 = new Ship(9, false);
    gameboard.placeShip(ship1, 0, 0);
    gameboard.placeShip(ship2, 1, 1);

    for (let i = 0; i < ship1.length; i++) {
      gameboard.receiveAttack(0, i);
    }

    for (let i = 1; i <= ship2.length; i++) {
      gameboard.receiveAttack(i, 1);
    }

    expect(gameboard.areAllShipsSunk()).toBe(true);
  });
});

describe('Player', () => {
  test('player should be created correctly', () => {
    const player = new Player('Player1');
    expect(player.name).toBe('Player1');
    expect(player.pastMoves.size).toBe(0);
  });

  test('player should take a turn and record past moves', () => {
    const player = new Player('Player1');
    const enemyGameboard = new Gameboard();
    const result = player.takeTurn(enemyGameboard, 1, 2);
    expect(result).toBe(true);
    expect(player.pastMoves.size).toBe(1);
  });

  test('player should not take a turn at the same position twice', () => {
    const player = new Player('Player1');
    const enemyGameboard = new Gameboard();
    player.takeTurn(enemyGameboard, 3, 4);
    const result = player.takeTurn(enemyGameboard, 3, 4);
    expect(result).toBe(false);
    expect(player.pastMoves.size).toBe(1);
  });
});

describe('Computer', () => {
  test('computer should be created correctly', () => {
    const computer = new Computer();
    expect(computer.name).toBe('Computer');
    expect(computer.pastMoves.size).toBe(0);
    expect(computer.lastHit).toBe(null);
  });

  test('computer should take a turn and record past moves', () => {
    const computer = new Computer();
    const enemyGameboard = new Gameboard();
    const result = computer.takeTurn(enemyGameboard);
    expect(result).toBeDefined();
    expect(computer.pastMoves.size).toBe(1);
  });
});