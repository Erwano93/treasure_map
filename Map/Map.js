const Tile = require("../Tile/Tile");
const {isValidPosition} = require("../Share/Utils");

class Map {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.grid = [];
  }

  initialize() {
    for (let i = 0; i < this.height; i++) {
      let row = [];
      for (let j = 0; j < this.width; j++) {
        row.push(new Tile());
      }
      this.grid.push(row);
    }
  }

  placeMountain(x, y) {
    if (!isValidPosition(this, x, y)) {
      console.log(`Cannot place mountain at (${x}, ${y}): Out of bounds.`);
      return;
    }
    this.grid[y][x].setMountain();
  }

  placeTreasure(x, y, quantity) {
    if (!isValidPosition(this, x, y)) {
      console.log(`Cannot place treasur at (${x}, ${y}): Out of bounds.`);
      return;
    }
    this.grid[y][x].setTreasure(quantity);
  }

  // Display the map in the console
  display() {
    for (let row of this.grid) {
      let rowDisplay = row.map((tile) => tile.type).join(" ");
      console.log(rowDisplay);
    }
  }

  updateAdventurerPosition(adventurer, newX, newY) {
    // Delete adventurer's current position
    this.grid[adventurer.y][adventurer.x].removeAdventurer();

    adventurer.x = newX;
    adventurer.y = newY;

    // Add new adventurer position
    this.grid[newY][newX].setAdventurer(adventurer.name);
  }
}

module.exports = Map;
