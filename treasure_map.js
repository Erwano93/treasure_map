let fs = require("fs");

class Tile {
  constructor(type = ".", treasure = 0) {
    this.type = type;
    this.treasure = treasure;
  }

  isMountain() {
    return this.type === "M";
  }

  isTreasure() {
    return this.treasure > 0;
  }

  hasAdventurer() {
    return this.type.startsWith("A");
  }

  setMountain() {
    this.type = "M";
  }

  setTreasure(quantity) {
    this.type = `T(${quantity})`;
    this.treasure = quantity;
  }

  removeTreasure() {
    if (this.treasure > 0) {
      this.treasure -= 1;
    }
    if (this.treasure === 0) {
      this.type = ".";
    }
  }

  setAdventurer(name) {
    this.type = `A(${name})`;
  }

  removeAdventurer() {
    this.type = this.treasure > 0 ? `T(${this.treasure})` : ".";
  }
}

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

function isValidPosition(map, x, y) {
  return x >= 0 && x < map.width && y >= 0 && y < map.height;
}

function readInputFile(filename) {
  const data = fs.readFileSync(filename, "utf8");

  let lines = data
    .split("\n")
    .filter((line) => !line.startsWith("#") || line.trim() !== "");

  let map,
    adventurers = [];

  for (let line of lines) {
    // Split the line into an array and delete the spaces
    let parts = line.split("-").map((part) => part.trim());

    switch (parts[0]) {
      case "C":
        map = new Map(parseInt(parts[1]), parseInt(parts[2]));
        map.initialize();
        break;
      case "M":
        map.placeMountain(parseInt(parts[1]), parseInt(parts[2]));
        break;
      case "T":
        map.placeTreasure(
          parseInt(parts[1]),
          parseInt(parts[2]),
          parseInt(parts[3])
        );
        break;
      case "A":
        parts[5] = parts[5].trim().split("");
        let adventurer = new Adventurer(
          parts[1],
          parseInt(parts[2]),
          parseInt(parts[3]),
          parts[4],
          parts[5]
        );
        adventurers.push(adventurer);
        break;
    }
  }
  return {map, adventurers};
}

function writeOutputFile(outputFileName, map, adventurers) {
  let output = "";

  // Get map dimensions
  output += `C - ${map.width} - ${map.height}\n`;

  // Get mountains and treasures
  for (let y = 0; y < map.height; y++) {
    for (let x = 0; x < map.width; x++) {
      let tile = map.grid[y][x];
      if (tile.isMountain()) {
        output += `M - ${x} - ${y}\n`;
      }
      if (tile.isTreasure()) {
        output += `T - ${x} - ${y} - ${tile.treasure}\n`;
      }
    }
  }

  // Get adventurers
  for (let adventurer of adventurers) {
    output += `A - ${adventurer.name} - ${adventurer.x} - ${adventurer.y} - ${adventurer.orientation} - ${adventurer.treasuresCollected}\n`;
  }

  fs.writeFileSync(outputFileName, output);
}

function simulateAdventure(inputFileName, outputFileName) {
  const {map, adventurers} = readInputFile(inputFileName);

  // Get the maximum number of movements
  let maxMovements = Math.max(...adventurers.map((a) => a.movements.length));

  // Simulate the adventure
  for (let i = 0; i < maxMovements; i++) {
    for (let adventurer of adventurers) {
      if (adventurer.movements.length > 0) {
        adventurer.move(map);
      }
    }
  }

  writeOutputFile(outputFileName, map, adventurers);
}

if (process.argv.length < 3) {
  console.log(
    "Veuillez spécifier le nom du fichier en argument : node treasure_map.js <filename>"
  );
  process.exit(1);
}

let filename = process.argv[2];
if (filename && fs.existsSync(filename)) {
  simulateAdventure(filename, "output.txt");
} else {
  console.error(`Le fichier ${filename} n'existe pas.`);
  process.exit(1);
}
