var db = require('../../config/sequelize');
var fs = require('fs');
var path = require('path');

exports.pusher = function(req, res) {
  db.PusherConfig.findAll()
  .success(function(configs) {
    if(configs.length > 0) {       // Check if a Pusher config has already been added
      res.redirect('/twitter');    // If it has then send on to next stage of setup 
    } else {
      res.render('setup/pusher', {
        title: 'Pusher Config'
      });
    }
  });
};

exports.pusherCreate = function(req, res) {
  var config = db.PusherConfig.build(req.body);
  config.save()
  .success(function(){
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

exports.pusherUpdate = function(req, res) {
  var oldConfig;
  var newConfig = req.body.config;
  db.PusherConfig.findAll()
  .success(function(configs) {
    oldConfig = configs[0];
    oldConfig.updateAttributes(newConfig)
    .success(function(){
      res.send({ success: true});
    }).error(function(err){
      res.send({ success: false});
    });
  })
};

exports.logo = function(req, res) {
  fs.rename(
    req.files.logo.path, 
    path.normalize(__dirname + '/../../public/img/logo.png'), 
    function(err) {
      if (err) { 
        throw err; 
      };
    });
  res.send();
};