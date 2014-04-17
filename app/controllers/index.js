var db = require('../../config/sequelize');

exports.render = function(req, res) {
  db.User.findAll().success(function(users) {
    if (users.length > 0) {
      db.PusherConfig.findAll()
        .success(function(config) {
          var pusherKey = config[0].key;
          res.render('index', {
            pusherKey: pusherKey
          });
        })
    } else {
      res.send();
    }
  })
};