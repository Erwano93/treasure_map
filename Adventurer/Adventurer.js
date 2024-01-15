const {isValidPosition} = require("../Share/Utils");

class Adventurer {
  constructor(name, x, y, orientation, movements) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.orientation = orientation;
    this.movements = movements;
    this.treasuresCollected = 0;
  }

  move(map) {
    const movement = this.movements.shift();
    if (movement === "A") {
      this.advance(map);
    } else {
      this.turn(movement);
    }
  }

  advance(map) {
    let newX, newY;
    const moves = {
      N: {dx: 0, dy: -1},
      S: {dx: 0, dy: 1},
      E: {dx: 1, dy: 0},
      W: {dx: -1, dy: 0},
    };

    const move = moves[this.orientation];
    if (move) {
      newX = this.x + move.dx;
      newY = this.y + move.dy;
    }

    if (isValidPosition(map, newX, newY)) {
      let tile = map.grid[newY][newX];

      if (tile.isMountain()) return;

      if (tile.hasAdventurer()) return;

      if (tile.isTreasure()) {
        this.treasuresCollected += 1;
        tile.removeTreasure();
      }

      map.updateAdventurerPosition(this, newX, newY);
    }
  }

  turn(movement) {
    const orientations = ["N", "E", "S", "W"];
    let index = orientations.indexOf(this.orientation);
    if (movement === "G") {
      index = (index - 1 + orientations.length) % orientations.length;
    } else if (movement === "D") {
      index = (index + 1) % orientations.length;
    }
    this.orientation = orientations[index];
  }
}

module.exports = Adventurer;
