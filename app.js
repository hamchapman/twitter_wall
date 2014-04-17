var express = require('express');
var app = express();
var http = require('http');
var path = require('path');
var flash = require('connect-flash');
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var passport = require('./config/passport');
var db = require('./config/sequelize');
var config = require('./config/config');
var auth = require('./config/middlewares/authorization');
var api = require('./app/controllers/api');

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/app/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({secret: 'asfsad'}));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

require('./config/routes').init(app, passport, auth);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

setTimeout(function() {
  api.setupClients();
  api.startStreams();  
},1000);