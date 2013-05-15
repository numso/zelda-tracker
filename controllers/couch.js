var   games = require('../fake-couch/games.json')
    players = require('../fake-couch/players.json');

module.exports = function (app) {
  app.get('/games', getGames);
  app.get('/players', getPlayers);
};

function getGames(req, res, next) {
  res.send(games);
}

function getPlayers(req, res, next) {
  res.send(players);
}
