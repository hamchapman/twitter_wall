var db = require('../../config/sequelize');

exports.pusher = function(req, res) {
  // Check if a Pusher app has already been added
  // If it has then send on to next stage of setup
  db.PusherConfig.findAll().success(function(configs) {
    if(configs.length > 0) { 
      res.redirect('/twitter');
    } else {
      res.render('setup/pusher', {
        title: 'Pusher Config'
      });
    }
  });
};

exports.pusherCreate = function(req, res) {
  var config = db.PusherConfig.build(req.body);
  config.save().success(function(){
    res.redirect('/twitter');
  }).error(function(err){
    res.render('setup/pusher', {
      title: 'Pusher Config'
    });
  });
};

exports.twitter = function(req, res) {
  res.render('setup/twitter', {
    title: 'Twitter Setup'
  });
}