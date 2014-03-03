var port = 80;
var verbose = true;

var express = require('express');
var game = require('./game');
var app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(express.static(__dirname + '/static'));
app.use(app.router);

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

app.get('/', function (req, res) {
  // console.log('%s %s', req.method, req.url);
  res.render('game', game);
});

app.get('/mmogol', function (req, res) {
  // console.log('%s %s', req.method, req.url);
  res.render('game', game);
});

app.get('/mmogol/data', function (req, res) {
  // console.log('%s %s', req.method, req.url);
  res.end(JSON.stringify(game.dump()));
});

app.put('/mmogol/data', function (req, res) {
  // console.log('%s %s', req.method, req.url);
  // console.log(JSON.stringify(req.body));
  if (req.body) {
    if (req.body.run) {
      game.run();
    }
    if (req.body.pause) {
      game.pause();
    }
    if (req.body.tick) {
      game.tick(req.body.tick);
    }
    if (req.body.set) {
      game.set(req.body.set);
    }
  }
  res.end(JSON.stringify(game.dump()));
});

game.init();
game.run();
app.listen(port);
console.log('Game server listening on port %d', port);

// print game stats and board if verbose
if (verbose) setTimeout(function next() {
  if (!game.paused()) {
    console.log('\nGeneration: %d Population: %d',
        game.generation, game.population);
    // draw a game board, might look weird if too big
    for (var y = 0, row = ''; y < game.height; y++) {
      for (var x = 0; x < game.width; x++) {
        row += game.cells[x][y] ? '0' : ' ';
      }
      console.log(row);
      row = '';
    }
  }
  setTimeout(next, game.period);
}, game.period);
