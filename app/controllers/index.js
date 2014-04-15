/**
 * Module dependencies.
 */
var _ = require('underscore');
var db = require('../../config/sequelize');

exports.render = function(req, res) {
  db.User.findAll().success(function(users) {
    if (users.length > 0) {
      res.render('index', {
        user: req.user ? JSON.stringify(req.user) : "null"
      });
    } else {
      // res.redirect('/signup');
      res.send();
    }
  })
};