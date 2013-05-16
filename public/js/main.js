var app = angular.module('zelda', ['ui.bootstrap']);

app.config(function ($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'tmpl/index.html',
    controller: 'IndexController'
  });

  $routeProvider.otherwise({ redirectTo: '/' });
});

app.filter('average', function () {
  return function (input, scope) {
    var count = 0;
    for (var i = 0; i < input.length; ++i) {
      if (input[i]) ++count;
    }
    return count / input.length * 100;
  };
});

app.filter('gameAverage', function () {
  return function (input, scope) {
    var count = 0;
    for (var i = 0; i < input.length; ++i) {
      var beatLevel = true;
      for (var j = 0; j < input[i].length; ++j) {
        if (!input[i][j]) beatLevel = false;
      }
      if (beatLevel) ++count;
    }
    return count / input.length * 100;
  };
});

app.filter('dungeonAverage', function () {
  return function (input, scope) {
    var count = 0;
    var length = 0;
    for (var i = 0; i < input.length; ++i) {
      length += input[i].length;
      for (var j = 0; j < input[i].length; ++j) {
        if (input[i][j]) ++count;
      }
    }
    return count / length * 100;
  };
});

app.controller('IndexController', ['$scope', '$http', function ($scope, $http) {

  $scope.openEditBox = function(game, player) {
    $scope.dialogTitle = player.name + " - " + game.name;
    $scope.dialogOptions = game.levels;
    $scope.dialogValues = player.games[game.index];
    $scope.curPlayer = player;
  };

  $scope.clickedBox = function () {
    updatePlayer($scope.curPlayer);
  }

  getData(function (err, data) {
    if (err) return console.error(err);

    for (var i = 0; i < data.players.length; ++i) {
      data.players[i] = data.players[i].value;
      if (!data.players[i].games) {
        data.players[i].games = generateGames(data.games);
        updatePlayer(data.players[i]);
      }
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
        temp.push(false);
      }
      arr.push(temp);
    }
    return arr;
  }

  function getData(cb) {
    var obj = {},
          i = 2;

    var done = function (data, status, headers, config) {
      if (!data.success) return cb(data.err);
      obj[config.url.substr(1)] = data.data;
      if (--i === 0) cb(null, obj);
    };

    $http.get('/games').success(done);
    $http.get('/players').success(done);
  }

  function updatePlayer(player) {
    var updateObj = {
      id: player._id,
      player: {
        name: player.name,
        type: 'player',
        games: player.games,
        _rev: player._rev
      }
    };

    $http.put('/updatePlayer', updateObj).success(function (data, status, headers, config) {
      if (!data.success) console.error(data.err);
      if (data.data.error) console.error(data.data.error + ": " + data.data.reason);
      player._rev = data.data.rev;
    });
  }
}]);
