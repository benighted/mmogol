# mmogol
### Massively Multiplayer Online Game of Life

Based on [Conway's Game of Life](http://wikipedia.org/wiki/Conway's_Game_of_Life).  Game and multiplayer server written in Node.js.


## Basic Usage
```
  var game = require('mmogol');

  game.init(); // generate game
  game.pause();   // pause game
  game.tick(n); // step n turns
  game.run(); // start / resume
```

## Server Usage
```
  > npm start
  Game server listening on port 80
```