var    http = require('http')
  ,      fs = require('fs')
  ,    path = require('path')
  , express = require('express');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({
    store: new express.session.MemoryStore({
      reapInterval: 20 * 60 * 1000
    }),
    secret: "u8970oexkgoek*&EUKk)(*>ok"
  }));
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function () {
  app.use(express.errorHandler());
});

fs.readdirSync(__dirname + '/controllers').forEach(function (file) {
  require('./controllers/' + file)(app);
});

http.createServer(app).listen(app.get('port'), function () {
  console.log("Express server listening on port " + app.get('port'));
});
