var port = 80;
var period = 1000;
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

app.post('/mmogol/data', function (req, res) {
  // console.log('%s %s', req.method, req.url);
  // console.log(JSON.stringify(req.body));
  if (req.body) {
    if (req.body.toggle) {
      game.set.apply(game, req.body.toggle);
    }
    if (req.body.period && req.body.period != game.period) {
      var p = parseInt(req.body.period,10) || game.period;
      if (!isNaN(p) || p != game.period) {
        game.period = p;
        console.log('Period set to %d', p);
      }
    }
  }
  res.end(JSON.stringify(game.dump()));
});

game.period = period;
game.init();
game.run();

app.listen(port);
console.log('Game server listening on port %d', port);

// print game stats and board if verbose
if (verbose) setTimeout(function next() {
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
  setTimeout(next, game.period);
}, game.period);
