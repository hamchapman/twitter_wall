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
  db.TwitterOAuth.findAll()
  .success(function(oauths) {
    if(oauths.length > 0) {     // Check if Tiwtter OAuth has already been added
      res.redirect('/');        // If it has then send on to admin panel
    } else {
      res.render('setup/twitter', {
        title: 'Twitter Setup'
      });
    }
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

exports.logoUpload = function(req, res) {
  fs.rename(
    req.files.logo.path, 
    path.normalize(__dirname + '/../../public/img/logo.png'), 
    function(err) {
      if (err) { 
        throw err; 
      };
    });
  res.set('Content-Type', 'text/html');
  res.json({path: '/img/logo.png'});
};

exports.sponsorLogos = function(req, res) {
  db.SponsorLogo.findAll()
    .success(function(logos) {
      console.log(logos);
      res.send({ success: true, logos: logos });
    }).error(function(err){
      res.send({ success: false });
    });
};

exports.removeSponsorLogo = function(req, res) {
  db.SponsorLogo.find({ where: { name: req.body.logo.name }})
    .success(function(logo) {
      console.log("Found logo")
      logo.destroy().success(function() {
        console.log("Sponsor logo removed from DB");
      })
  })
  res.send();
};

exports.sponsorLogoUpload = function(req, res) {
  var numOfSponsorLogos = 0;
  fs.readdir(__dirname + '/../../public/img/sponsors', function(err, files) {
    numOfSponsorLogos = files.length;
    fs.rename(
      req.files.sponsorLogo.path,
      path.normalize(__dirname + '/../../public/img/sponsors/sponsor' + (numOfSponsorLogos + 1) + '.png' ),
      function(err) {
        if (err) { 
          throw err; 
        };
      });
    var sponsorLogo = db.SponsorLogo.build({ 
      name: "sponsor" + (numOfSponsorLogos + 1) + '.png', 
      path: '/img/sponsors/sponsor' + (numOfSponsorLogos + 1) + '.png'
    });
    sponsorLogo.save()
      .success(function(){
        console.log("Sponsor logo saved");
      }).error(function(err){
        console.log("Failed to save sponsor logo");
      });
    res.set('Content-Type', 'text/html');
    res.json({path: sponsorLogo.path});
  })
};