var db = require('../../config/sequelize');
var config = require('../../config/config');
var Twit = require('twit');
var Pusher = require('pusher');

var tweets = [];
var cleanTweets = [];
var pusherClient = 0;
var twitterClient = 0;
var streamList = [];
var isAutomatic = false;

exports.setupClients = function() {
  if (pusherClient === 0) { setupPusherClient(); }
  if (twitterClient === 0) { setupTwitterClient(); } 
};

exports.tweets = function(req, res) {
  var query = req.params.query;
  db.Query.create({text: query});
  setupStream(query);
  res.json({tweets: tweets, status: true});
};

exports.uncleanTweets = function(req, res) { 
  db.Tweet.findAll().success(function(tweets) {
    var uncleanTweets = tweets;
    res.json({tweets: uncleanTweets, status: true});
  });
};

exports.cleanTweets = function(req, res) { 
  db.CleanTweet.findAll().success(function(tweets) {
    var cleanTweets = tweets;
    res.json({tweets: cleanTweets, status: true});
  });
};

exports.addCleanTweet = function(req, res) {
  var tweet = req.body.tweet;
  pushCleanTweet(tweet);
  if (!isAutomatic) {
    db.Tweet.find({ where: { text: tweet.text, tweeter: tweet.tweeter }})
      .success(function(tweet) {
        tweet.destroy().success(function() {
          console.log("Tweet removed from DB");
        })
    })
  }
  res.send();
};

exports.removeCleanTweet = function(req, res) {
  var tweet = req.body.tweet;
  var tweetIndex = req.body.index;
  db.CleanTweet.find({ where: { text: tweet.text }})
    .success(function(tweet) {
      tweet.destroy().success(function() {
        console.log("Tweet removed from DB");
      })
  })
  pusherClient.trigger('twitter_wall', 'remove_clean_tweet', { index: tweetIndex }); 
  if(tweetIndex != -1) {
    cleanTweets.splice(tweetIndex, 1);
  }
  res.send();
};

exports.removeTweet = function(req, res) {
  var tweet = req.body.tweet;
  if (!isAutomatic) {
    db.Tweet.find({ where: { text: tweet.text, tweeter: tweet.tweeter }})
      .success(function(tweet) {
        tweet.destroy().success(function() {
          console.log("Tweet removed from DB");
        })
    })
  }
  var i = tweets.indexOf(tweet);
  if(i != -1) {
    tweets.splice(i, 1);
  }
  res.send();
};

exports.queries = function(req, res) {
  db.Query.findAll().success(function(queries) {
    res.json({queries: queries, status: true});
  });
};

exports.removeQuery = function(req, res) {
  var indexOfStreamForQuery = req.body.index;
  streamList[indexOfStreamForQuery].stop();
  streamList.splice(indexOfStreamForQuery, 1);
  db.Query.find({ where: { text: req.body.query }})
    .success(function(query) {
      query.destroy().success(function() {
        console.log("Query removed from DB");
      })
  })
  res.send();
};

exports.startStreams = function() {
  db.Query.findAll().success(function(queries) {
    queries.forEach(function(query) {
      setupStream(query.text);
    })
  })
};

exports.mode = function(req, res) {
  res.json({ automatic: isAutomatic });
};

exports.swapMode = function(req, res) {
  isAutomatic = !isAutomatic;
  res.send();
};

var pushCleanTweet = function(formattedTweet) {
  cleanTweets.push(formattedTweet);
  pusherClient.trigger('twitter_wall', 'new_clean_tweet', { tweet: formattedTweet });
  var newTweet = db.CleanTweet.build(formattedTweet);
  newTweet.save().success(function() {
    console.log("Saved moderated tweet");
  }).error(function(err) {
    console.log(err);
  });
};

var formatTweetForDB = function(tweet) {
  var formattedTweet = {};
  formattedTweet.text = tweet.text;
  formattedTweet.tweeter = tweet.user.screen_name;
  formattedTweet.profile_image_url = tweet.user.profile_image_url;
  return formattedTweet;
}

var setupStream = function(query) {
  var stream = twitterClient.stream('statuses/filter', { track: query });
  tweetStream = stream;
  streamList.push(stream);
  pusherClient.trigger('twitter_wall', 'new_query', { query: query });
  stream.on('tweet', function (tweet) {
    var formattedTweet = formatTweetForDB(tweet);
    if (isAutomatic) { 
      pushCleanTweet(formattedTweet);
    } else {
      db.Tweet.create(formattedTweet);
    }

    pusherClient.trigger('twitter_wall', 'new_tweet', { tweet: formattedTweet });
    tweets.push(tweet);
  });
};

var setupTwitterClient = function() {
  var user_access_token = '';
  var user_access_token_secret = '';
  db.TwitterOAuth.findAll().success(function(oauths) {
    if (oauths != []) {
      user_access_token = oauths[0].oauth_token;
      user_access_token_secret = oauths[0].oauth_secret;
      twitterClient = new Twit({
          consumer_key:        config.twitter.clientID
        , consumer_secret:     config.twitter.clientSecret
        , access_token:        user_access_token
        , access_token_secret: user_access_token_secret
      });
    }
  }).error(function(err) {
    console.log(err);
  });
};

var setupPusherClient = function() {
  var user_pusher_app_id = '';
  var user_pusher_key = '';
  var user_pusher_secret = '';
  db.PusherConfig.findAll().success(function(configs) {
    if (configs != []) {
      user_pusher_app_id = configs[0].app_id;
      user_pusher_key = configs[0].key;
      user_pusher_secret = configs[0].secret;
      pusherClient = new Pusher({
          appId:  user_pusher_app_id
        , key:    user_pusher_key
        , secret: user_pusher_secret
      });  
    }
  }).error(function(err) {
    console.log(err);
  });
};