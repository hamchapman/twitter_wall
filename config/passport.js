var passport = require('passport');
var _ = require('lodash');
var LocalStrategy = require('passport-local').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var config = require('./config');
var db = require('./sequelize');

// Serialize sessions
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  db.User.find({where: {id: id}}).success(function(user){
    done(null, user);
  }).error(function(err){
    done(err, null);
  });
});

// Use local strategy to create admin account
passport.use(new LocalStrategy(
  function(username, password, done) {
    db.User.find({ where: { username: username }}).success(function(user) {
      if (!user) {
        done(null, false, { message: 'Unknown user' });
      } else if (!user.authenticate(password)) {
        done(null, false, { message: 'Invalid password'});
      } else {
        console.log('Login (local) : { id: ' + user.id + ', username: ' + user.username + ' }');
        done(null, user);
      }
    }).error(function(err){
      done(err);
    });
  }
  ));

// Use twitter strategy just to save oauth token 
// and token secret to use with the Twitter API
passport.use(new TwitterStrategy({
  consumerKey: config.twitter.clientID,
  consumerSecret: config.twitter.clientSecret,
  callbackURL: config.twitter.callbackURL
},
function(token, tokenSecret, profile, done) {
  
  db.TwitterOAuth.find({where: {oauth_token: token}}).success(function(oauthData){
    if(!oauthData){
      db.TwitterOAuth.create({
        oauth_token: token,
        oauth_secret: tokenSecret
      }).success(function(u){
        console.log('New oauth data saved');
        done(null, u);
      });
    } else {
      console.log('Oauth data already exists');
      done(null, user);
    }
    
  }).error(function(err){
    done(err, null);
  });
}
));

module.exports = passport;

