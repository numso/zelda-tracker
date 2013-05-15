var app = angular.module('zelda', []);

app.config(function ($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'tmpl/index.html',
    controller: 'IndexController'
  });

  $routeProvider.otherwise({ redirectTo: '/' });
});

app.controller('IndexController', ['$scope', '$http', function ($scope, $http) {

  $scope.openEditBox = function(game, player) {
    $scope.dialogTitle = player.name + " - " + game.name;
    $scope.dialogOptions = game.levels;
    $scope.dialogValues = player.games[game.index];
  };

  // $scope.watch() checked values to update the db

  getData(function (data) {
    for (var i = 0; i < data.players.length; ++i) {
      if (!data.players[i].games)
        data.players[i].games = generateGames(data.games);
    }

    for (var i = 0; i < data.games.length; ++i) {
      data.games[i].index = i;
    }

    $scope.games = data.games;
    $scope.players = data.players;
  });

  function generateGames(games) {
    var arr = [];
    for (var i = 0; i < games.length; ++i) {
      var temp = [];
      for (var j = 0; j < games[i].levels.length; ++j) {
        temp.push(Math.random() < .5);
      }
      arr.push(temp);
    }
    return arr;
  }

  function getData(cb) {
    var obj = {},
          i = 2;
    var done = function (data, status, headers, config) {
      obj[config.url.substr(1)] = data;
      if (--i === 0) cb(obj);
    };
    $http.get('/games').success(done);
    $http.get('/players').success(done);
  }
}]);
