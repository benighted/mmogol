var timer = null;

module.exports = {
  // todo: add getters and setters for these vars
  cells: [],     // writeable
  period: 1000,  // writeable
  width: 32,     // read only
  height: 20,    // read only
  generation: 0, // read only
  population: 0, // read only

  init: function (callback) {
    for (var x = 0; x < this.width; x++) {
      if (!this.cells[x]) this.cells[x] = [];
      for (var y = 0; y < this.height; y++) {
        this.cells[x][y] = Math.random() > 0.9; //!!this.cells[x][y];
        if (this.cells[x][y]) this.population++;
      }
    }
    if (callback) callback();
  },

  run: function () {
    if (timer) return;
    timer = setInterval(this.tick.bind(this), this.period) || null;
  },

  pause: function () {
    if (!timer) return;
    timer = clearInterval(timer) && null;
  },

  tick: function (ticks) {
    if (ticks) {
      while (ticks--) {
        this.tick();
      }
      return;
    }

    var alive = false, neighbors = 0,
        snapshot = this.cells.slice();

    this.generation++;

    for (var y = 0; y < this.height; y++) {
      for (var x = 0; x < this.width; x++) {
        alive = snapshot[x][y];
        neighbors = 0;

        for (var x2 = x - 1; x2 <= x + 1; x2++) {
          if (x2 < 0 || x2 >= this.width) continue;
          for (var y2 = y - 1; y2 <= y + 1; y2++) {
            if (y2 < 0 || y2 >= this.height) continue;
            if (x === x2 && y === y2) continue;
            if (snapshot[x2][y2]) neighbors++;
          }
        }

        if (alive) {
          if (neighbors < 2 || neighbors > 3) {
            this.cells[x][y] = alive = false;
            this.population--;
          }
        } else if (neighbors === 3) {
          this.cells[x][y] = alive = true;
          this.population++;
        }
      }
    }
  },

  get: function (x, y) {
    if (x >= this.width || y >= this.height) return;

    return this.cells[x][y];
  },

  set: function (x, y, value) {
    if (x >= this.width || y >= this.height) return;

    if (arguments.length === 1 && Array.isArray(x)) {
      for (var i = 0; i < x.length; i++) {
        if (x[i].length !== 3) continue;
        this.set(x[i][0], x[i][1], x[i][2]);
      }
      return;
    } else if (arguments.length === 2) {
      // invert if not specified
      value = !this.cells[x][y];
    }
    if (value !== this.cells[x][y]) {
      this.population += value ? 1 : -1;
      this.cells[x][y] = !!value;
    }
  },

  dump: function () {
    return {
      cells: this.cells,
      width: this.width,
      height: this.height,
      population: this.population,
      generation: this.generation
    };
  },

  slice: function (x1, y1, x2, y2) {
    if (arguments.length < 4) {
      x2 = this.width - 1;
      y2 = this.height - 1;
      if (arguments.length < 2) {
        x1 = 0;
        y1 = 0;
      }
    }

    for (var x = x1, out = []; x <= x2; x++) {
      if (x >= this.width) break;

      for (var y = y1, col = []; y <= y2; y++) {
        if (y >= this.height) break;
        col.push(this.cells[x][y]);
      }
 
      out.push(col);
    }

    return out;
  },

  resize: function (w, h) {
    this.width = w;
    this.height = h;
    this.init();
  }
};
