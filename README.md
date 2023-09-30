# Battleship Practice

This repository contains a JavaScript implementation of the classic game Battleship. It serves as a personal practice project focused on Test Driven Development (TDD) principles.

## Project Structure

### `index.js`

The core game logic is implemented in this file, featuring classes such as `Ship`, `Gameboard`, `Player`, and `Computer`. The code covers ship creation, gameboard setup, attacking mechanisms, and player interactions.

### `dom.js`

The `dom.js` module manages interaction with the Document Object Model (DOM). It creates the user interface, handles game modes (placing ships or attacking), and renders the game boards.

### `index.test.js`

Jest is employed in `index.test.js` to validate the correctness of implemented functionalities. The test suite covers ship creation, gameboard functionality, player actions, and computer player logic.

## Running Tests

Execute the following command in your terminal to run the test suite:

```bash
npm test
```

Jest will run the tests, providing feedback on the functionality of the implemented code.

## Game Instructions

1. **Placing Ships:**
   - Click on the "Horizontal" or "Vertical" button to set the ship orientation.
   - Click on the cells in "Your Board" to place your ships.

2. **Gameplay:**
   - After placing ships, the game switches to attack mode.
   - Click on cells in "Your board" to attack the computer's ships.
   - The game alternates turns between the player and the computer.

3. **Ending the Game:**
   - The game ends when all the player's or computer's ships are sunk.
   - An alert will display the winner.

Happy coding!
