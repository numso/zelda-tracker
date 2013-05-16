var     request = require('request')
       , config = require('config').couchConfig;

module.exports = function (app) {
  app.get('/games', getGames);
  app.get('/players', getPlayers);
  app.put('/updatePlayer', updatePlayer);
};

function getGames(req, res, next) {
  request(config.host + ':' + config.port + '/' + config.db + '/4d965941e47fcd11621e7ca145000b00', function (err, resp, body) {
    if (err) return res.send({ success: false, err: err});
    var json = JSON.parse(body);
    res.send({ success: true, data: json.games });
  });
}

function getPlayers(req, res, next) {
  request(config.host + ':' + config.port + '/' + config.db + '/_design/views/_view/players', function (err, resp, body) {
    if (err) return res.send({ success: false, err: err });
    var json = JSON.parse(body);
    res.send({ success: true, data: json.rows });
  });
}

function updatePlayer(req, res, next) {
  console.log(JSON.stringify(req.body.player));
  request.put({
    url: config.host + ':' + config.port + '/' + config.db + '/' + req.body.id,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(req.body.player)
  }, function (err, resp, body) {
    if (err) return res.send({ success: false, err: err });
    var json = JSON.parse(body);
    res.send({ success: true, data: json });
  });
}
