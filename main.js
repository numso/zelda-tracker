/* global angular, Firebase, _ */
var app = angular.module('zelda', ['ui.bootstrap', 'firebase']);

app.controller('mainCtrl',
  function ($scope, $firebase, $modal) {
    'use strict';

    var gamesRef = new Firebase('https://zelda.firebaseio.com/games');
    $scope.games = $firebase(gamesRef);

    var peopleRef = new Firebase('https://zelda.firebaseio.com/people');
    $scope.people = $firebase(peopleRef);

    var progressRef = new Firebase('https://zelda.firebaseio.com/data');
    $scope.progress = $firebase(progressRef);

    $scope.clickProgress = function (person, game, levels) {
      $modal.open({
        templateUrl: 'modal.html?aoeu=' + Math.random(), // to prevent cacheing
        controller: 'modalCtrl',
        resolve: {
          data: function () {
            return {
              person: person,
              game: game,
              levels: levels
            };
          }
        }
      });
    };
  }
);

app.controller('modalCtrl',
  function ($scope, $firebase, $modalInstance, data) {
    'use strict';

    $scope.game = data.game;
    $scope.player = data.person;
    $scope.levels = data.levels;

    var dataRef = new Firebase('https://zelda.firebaseio.com/data/' + data.person + '/' + data.game);
    $scope.progress = $firebase(dataRef);

    $scope.changed = function (which) {
      $scope.progress.$save(which);
    };

    $scope.dismiss = function () {
      $modalInstance.dismiss();
    };
  }
);

app.filter('progress',
  function () {
    'use strict';

    return function (levels, progress) {
      var numFinish = _.reduce(progress, function (memo, item, key) {
        if (key.indexOf('$') === 0) return memo;
        if (!item) return memo;
        return memo + 1;
      }, 0);
      var numLevels = _.size(levels);

      return numFinish / numLevels * 100;
    };
  }
);

app.filter('progressDungeons',
  function () {
    'use strict';

    return function (games, progress) {
      var numFinish = _.reduce(progress, function (memo, item, key) {
        if (key.indexOf('$') === 0) return memo;
        var num = _.reduce(item, function (memo, item) {
          if (!item) return memo;
          return memo + 1;
        }, 0);
        return memo + num;
      }, 0);

      var numLevels = _.reduce(games, function (memo, item, key) {
        if (key.indexOf('$') === 0) return memo;
        return memo + _.size(item);
      }, 0);

      return numFinish / numLevels * 100;
    };
  }
);

app.filter('progressGames',
  function () {
    'use strict';

    return function (games, progress) {
      var numFinish = _.reduce(progress, function (memo, item, key) {
        if (key.indexOf('$') === 0) return memo;

        var count = _.reduce(item, function (memo2, item2) {
          if (!item2) return memo2;
          return memo2 + 1;
        }, 0);

        if (count !== _.size(games[key])) return memo;

        return memo + 1;
      }, 0);

      var numGames = _.reduce(games, function (memo, item, key) {
        if (key.indexOf('$') === 0) return memo;
        return memo + 1;
      }, 0);

      return numFinish / numGames * 100;
    };
  }
);
