var port = 80;
var verbose = false;

var util = require('util');
var express = require('express');
var game = require('./life');
var app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(express.static(__dirname + '/static'));
app.use(app.router);

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

app.get('/', function (req, res) {
  // util.log('%s %s', req.method, req.url);
  res.render('main', game);
});

app.get('/mmogol', function (req, res) {
  // util.log('%s %s', req.method, req.url);
  res.render('main', game);
});

app.get('/mmogol/data', function (req, res) {
  // util.log('%s %s', req.method, req.url);
  res.end(JSON.stringify(game.dump()));
});

app.put('/mmogol/data', function (req, res) {
  // util.log('%s %s', req.method, req.url);
  // util.log(JSON.stringify(req.body));
  if (req.body) {
    if (req.body.run) {
      util.log('Game running.');
      game.run();
    }
    if (req.body.pause) {
      util.log('Game paused.');
      game.pause();
    }
    if (req.body.tick) {
      util.log('Stepping ' + req.body.tick + ' turn' +
        (req.body.tick == 1 ? '' : 's') + '.');
      game.tick(req.body.tick);
    }
    if (req.body.set) {
      util.log(util.format('Set %j', req.body.set));
      game.set(req.body.set);
    }
  }
  res.end(JSON.stringify(game.dump()));
});

game.init();
game.run();
app.listen(port);
util.log('Game server listening on port ' + port);

// print game stats and board if verbose
if (verbose) setTimeout(function next() {
  if (!game.paused()) {
    util.log(util.format('\nGeneration: %d Population: %d',
        game.generation, game.population));

    // draw a game board, might look weird if too big
    for (var y = 0, row = ''; y < game.height; y++) {
      for (var x = 0; x < game.width; x++) {
        row += game.cells[x][y] ? '0' : ' ';
      }
      util.log(row + ' -');
      row = '';
    }
  }
  setTimeout(next, game.period);
}, game.period);
