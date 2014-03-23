angular.module('GameOfLifeClient', [])
  .controller('GameController', function ($scope, $interval, $http) {
    $scope.cells      = [];
    $scope.stage      = [];
    $scope.timer      = null;
    $scope.period     = 100;
    $scope.generation = 0;
    $scope.population = 0;
    $scope.stageCoord = [];

    $scope.noop = function () {};

    $scope.pause = function (callback) {
      if (!callback) callback = $scope.noop();
      if (!$scope.timer) return callback();

      if ($interval.cancel($scope.timer)) {
        $scope.timer = null;
        return callback();
      } else {
        return callback('Unable to clear interval.');
      }
    };

    $scope.start = function (callback) {
      if (!callback) callback = $scope.noop();
      if ($scope.timer) return callback();

      $scope.timer = $interval($scope.refresh.bind($scope), $scope.period);
      $scope.refresh(callback);
    };

    $scope.refresh = function (callback) {
      $http.get('/mmogol/data')
        .success(function(data, status, headers, config) {
          //$scope.log('Loaded data from game server.');
          //$scope.log(data);
          $scope.loadData(data);
        })
        .error(function(data, status, headers, config) {
          $scope.error('Game server returned status ' + status);
        });
    };

    $scope.setCells = function (cells) {
      $http.put('/mmogol/data', {set: cells})
        .success(function(data, status, headers, config) {
          //$scope.log('Posted data to game server.');
          //$scope.log(data);
          $scope.loadData(data);
        })
        .error(function(data, status, headers, config) {
          $scope.error('Game server returned status ' + status);
        });
    };

    $scope.pauseGame = function (pause) {
      $http.put('/mmogol/data', pause ? {pause: true} : {run: true})
        .success(function(data, status, headers, config) {
          $scope.loadData(data);
        })
        .error(function(data, status, headers, config) {
          $scope.error('Game server returned status ' + status);
        });
    };

    $scope.stepGame = function (pause) {
      $http.put('/mmogol/data', {tick: 1})
        .success(function(data, status, headers, config) {
          $scope.loadData(data);
        })
        .error(function(data, status, headers, config) {
          $scope.error('Game server returned status ' + status);
        });
    };

    $scope.toggleStage = function (x, y) {
      $scope.stage[x][y] = !$scope.stage[x][y];
    };

    $scope.selectStage = function (x, y) {
      $scope.stageCoord = [x, y];
    };

    $scope.resizeStage = function (x, y) {
      if (x < 1) x = 1;
      if (y < 1) y = 1;

      while (x < $scope.stage.length) $scope.stage.pop();

      for (i = 0; i < x; i++) {
        if (!$scope.stage[i]) $scope.stage.push([]);
        while (y < $scope.stage[i].length) $scope.stage[i].pop();
        while (y > $scope.stage[i].length) $scope.stage[i].push(false);
      }
    };

    $scope.loadData = function (data) {
      if (data.cells != undefined) $scope.cells = data.cells;
      if (data.generation != undefined) $scope.generation = data.generation;
      if (data.population != undefined) $scope.population = data.population;
    };

    $scope.log = function (msg) {
      if (console) console.log(msg);
    };

    $scope.error = function (err) {
      if (console) console.error(err);
      else alert(err);
    };

    // build the initial stage
    $scope.resizeStage(32, 16);
  })

  .directive('dragsource', function () {
    return function (scope, element) {
      var el = element[0];

      el.draggable = true;

      el.addEventListener('dragstart', function (ev) {
        ev.dataTransfer.setData('Stage', JSON.stringify(scope.stage));
        this.classList.add('dragging');
      });

      el.addEventListener('dragend', function (ev) {
        this.classList.remove('dragging');
      });
    };
  })

  .directive('droptarget', function () {
    return function (scope, element) {
      var el = element[0];

      el.addEventListener('dragover', function (ev) {
        if (ev.preventDefault) ev.preventDefault();
      });

      el.addEventListener('drop', function (ev) {
        var data = JSON.parse(ev.dataTransfer.getData('Stage'));
            ox = scope.$parent.$index - scope.stageCoord[0],
            oy = scope.$index - scope.stageCoord[1],
            cells = [];

        if (ev.stopPropagation) ev.stopPropagation();

        for (var x = 0; x < data.length; x++) {
          for (var y = 0; y < data.length; y++) {
            if (data[x][y]) cells.push([x + ox, y + oy, true]);
          }
        }

        scope.setCells(cells);

        // scope.log(data);
        // scope.log(cells);
        // scope.log(scope.stageCoord);
        // scope.log([scope.$parent.$index, scope.$index]);
      });
    };
  });
