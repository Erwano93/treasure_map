let fs = require("fs");
const Map = require("./Map/Map");
const Tile = require("./Tile/Tile");
const Adventurer = require("./Adventurer/Adventurer");

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
