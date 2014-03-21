var users = require('../app/controllers/users');
var index = require('../app/controllers/index');
var setup = require('../app/controllers/setup');
var api = require('../app/controllers/api');

exports.init = function(app, passport, auth) {

  console.log('Initializing Routes');

  // User Routes
  app.get('/signin', users.signin);
  app.get('/signup', users.signup);
  app.get('/signout', users.signout);

  // Setting up the users api
  app.post('/users', users.create);

  // Setting up route to save Pusher config
  app.get('/pusher', setup.pusher);
  app.post('/pusher', setup.pusherCreate);
  
  // Route for connecting to Twitter API
  app.get('/twitter', setup.twitter);

  // Routes for the tweets api
  app.get('/api/tweets/:queries', api.tweets);
  app.get('/api/clean-tweets', api.cleanTweets);
  app.post('/api/add-clean-tweet', api.addCleanTweet);
  app.post('/api/remove-clean-tweet', api.removeCleanTweet);
  app.post('/api/remove-tweet', api.removeTweet);

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