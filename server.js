var port = 80;
var step = 1000;

var express = require('express');
var game = require('./game');
var app = express();

app.use(app.router);
app.use(express.static(__dirname + '/static'));

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

app.get('/cgol/data', function (req, res) {
  // console.log('%s %s', req.method, req.url);
  res.end(JSON.stringify(game.slice()));
});

app.get('/cgol', function (req, res) {
  // console.log('%s %s', req.method, req.url);
  res.render('game', game);
});

app.post('/cgol', function (req, res) {
  // console.log('%s %s', req.method, req.url);
  // console.log(req.params);
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