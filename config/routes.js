var users = require('../app/controllers/users');
var index = require('../app/controllers/index');
var setup = require('../app/controllers/setup');

exports.init = function(app, passport, auth) {

  console.log('Initializing Routes');

  // User Routes
  app.get('/signin', users.signin);
  app.get('/signup', users.signup);
  app.get('/signout', users.signout);
  app.get('/users/me', users.me);
  app.get('/pusher', setup.pusher);
  app.get('/twitter', setup.twitter);

  // Setting up the users api
  app.post('/users', users.create);

  app.post('/pusher', setup.pusherCreate);

  // Setting the local strategy route
  app.post('/users/session', passport.authenticate('local', {
      successRedirect: '/pusher',
      failureRedirect: '/signin',
      failureFlash: true
  }), users.session);

  // Setting the twitter oauth routes
  app.get('/auth/twitter', passport.authenticate('twitter', {
      failureRedirect: '/twitter'
  }), users.signin);

  app.get('/auth/twitter/callback', passport.authenticate('twitter', {
      failureRedirect: '/twitter'
  }), users.authCallback);

  // Finish with setting up the userId param
  app.param('userId', users.user);

  // Home route
  app.get('/', index.render);

};