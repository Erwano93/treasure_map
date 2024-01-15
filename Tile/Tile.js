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

module.exports = Tile;
