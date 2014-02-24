var port = 80;
var step = 1000;

var express = require('express');
var game = require('./game');
var app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(express.static(__dirname + '/static'));
app.use(app.router);

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

app.get('/cgol', function (req, res) {
  // console.log('%s %s', req.method, req.url);
  res.render('game', game);
});

app.get('/cgol/data', function (req, res) {
  // console.log('%s %s', req.method, req.url);
  res.end(JSON.stringify(game.dump()));
});

app.post('/cgol/data', function (req, res) {
  // console.log('%s %s', req.method, req.url);
  // console.log(JSON.stringify(req.body));
  if (req.body) {
    if (req.body.toggle) {
      game.set.apply(game, req.body.toggle);
    }
  }
  res.end(JSON.stringify(game.dump()));
});

game.step = step;
game.init();
game.run();

app.listen(port);
console.log('Game server listening on port %d', port);

setTimeout(function next() {
  console.log('\nTurn: %d, Step: %d, Population: %d', game.turn, game.step, game.population);
  for (var y = 0, row = ''; y < game.height; y++) {
    for (var x = 0; x < game.width; x++) {
      row += game.cells[x][y] ? '0' : ' ';
    }
    console.log(row);
    row = '';
  }
  setTimeout(next, game.step);
}, game.step);
