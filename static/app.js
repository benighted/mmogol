angular.module('GameOfLifeClient', [])
  .controller('GameController', function ($scope, $interval, $http) {
    $scope.period = 1000;
    $scope.timer = null;
    $scope.cells = [];
    $scope.generation = 0;
    $scope.population = 0;

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
          $scope.error('Game searver returned status ' + status);
          $scope.pause();
        });
    };

    $scope.toggle = function (x, y) {
      $scope.log([x, y]);
      $http.post('/mmogol/data', {toggle: [x, y]})
        .success(function(data, status, headers, config) {
          //$scope.log('Posted data to game server.');
          //$scope.log(data);
          $scope.loadData(data);
        })
        .error(function(data, status, headers, config) {
          $scope.error('Game searver returned status ' + status);
          $scope.pause();
        });
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
  });
