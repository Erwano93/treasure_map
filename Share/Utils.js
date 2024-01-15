function isValidPosition(map, x, y) {
  return x >= 0 && x < map.width && y >= 0 && y < map.height;
}

module.exports = {isValidPosition};
