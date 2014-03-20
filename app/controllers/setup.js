var db = require('../../config/sequelize');

exports.pusher = function(req, res) {
  res.render('setup/pusher', {
    title: 'Pusher Config'
  });
};


exports.pusherCreate = function(req, res) {
  var message = null;

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