var db = require('../../config/sequelize');
var config = require('../../config/config');
var Twit = require('twit');
var Pusher = require('pusher');

var tweets = [];
var cleanTweets = [];

var pusher = new Pusher({
  appId: '68375',
  key: '15d9668cc510aed91e23',
  secret: '31ea66fb880de018564d'
});

var T = new Twit({
    consumer_key: 'XppZMlS5p5XcKD95YpW7VA'
  , consumer_secret: 'pXApJAwdv7Acw1yGb2UmkTRlV8W8t2uTNXaZfOEMA'
  , access_token: '83189257-Gl23YMFaV3LMkvjI0B80YstmmHGtFDp704ZxUOjZo'
  , access_token_secret: 'CKbWEpQljoDYb2ZrxJagk1ilAqwICEA5Vo2Em68PXaD0o'
})

exports.tweets = function(req, res) {
  
  // var user_access_token = '';
  // var user_access_token_secret = '';
  // db.TwitterOAuth.findAll().success(function(oauths) {
  //   console.log(oauths);
  //   user_access_token = oauths[0].oauth_token;
  //   user_access_token_secret = oauths[0].oauth_secret;
  // });
  // var T = new Twit({
  //     consumer_key:        config.twitter.clientID
  //   , consumer_secret:     config.twitter.clientSecret
  //   , access_token:        user_access_token
  //   , access_token_secret: user_access_token_secret
  // })

  // var user_pusher_app_id = '';
  // var user_pusher_key = '';
  // var user_pusher_secret = '';
  // db.PusherConfig.findAll().success(function(configs) {
  //   console.log(configs);
  //   user_pusher_app_id = configs[0].app_id;
  //   user_pusher_key = configs[0].key;
  //   user_pusher_secret = configs[0].secret;
  // });

  // pusher = new Pusher({
  //     appId:  user_pusher_app_id
  //   , key:    user_pusher_key
  //   , secret: user_pusher_secret
  // });


  var queries = req.params.queries;
  console.log(queries);
  var stream = T.stream('statuses/filter', { track: queries });
  stream.on('tweet', function (tweet) {
    // console.log(tweet);
    console.log("Pusher should send some data to Angualar");
    pusher.trigger('twitter_wall', 'new_tweet', { tweet: tweet });
    tweets.push(tweet);
  });
  res.json({tweets: tweets, status: true});
};

exports.cleanTweets = function(req, res) { 
  res.json({tweets: cleanTweets, status: true});
};

exports.addCleanTweet = function(req, res) {
  var tweet = req.body.tweet;
  cleanTweets.push(tweet);
  pusher.trigger('twitter_wall', 'new_clean_tweet', { tweet: tweet });
  var newTweet = db.Tweet.build();
  newTweet.text = tweet.text;
  newTweet.tweeter = tweet.user.screen_name;
  newTweet.profile_image_url = tweet.user.profile_image_url;
  newTweet.save().success(function() {
    console.log("Saved clean tweet");
  }).error(function(err) {
    console.log(err);
  })
  res.send();
};

exports.removeCleanTweet = function(req, res) {
  var tweet = req.body.tweet;
  var i = cleanTweets.indexOf(tweet);
  if(i != -1) {
    cleanTweets.splice(i, 1);
  }
  res.send();
};

exports.removeTweet = function(req, res) {
  var tweet = req.body.tweet;
  var i = cleanTweets.indexOf(tweet);
  if(i != -1) {
    tweets.splice(i, 1);
  }
  res.send();
};