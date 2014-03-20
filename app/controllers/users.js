var db = require('../../config/sequelize');

/**
 * Auth callback
 */
 exports.authCallback = function(req, res, next) {
  res.redirect('/');
};

exports.signin = function(req, res) {
  res.render('users/signin', {
    title: 'Signin',
    message: req.flash('error')
  });
};

exports.signup = function(req, res) {
  // Check if an admin has already been created
  // If it has then send on to next stage of setup
  db.User.findAll().success(function(users) {
    if(users.length > 0) { 
      res.redirect('/pusher');
    } else {
      res.render('users/signup', {
        title: 'Sign up',
      });
    }
  });
};

 exports.signout = function(req, res) {
  req.logout();
  res.redirect('/');
};

 exports.session = function(req, res) {
  res.redirect('/');
};

exports.create = function(req, res) {
  var message = null;

  var user = db.User.build(req.body);

    user.salt = user.makeSalt();
    user.hashedPassword = user.encryptPassword(req.body.password, user.salt);
    console.log('New User (local) : { id: ' + user.id + ' username: ' + user.username + ' }');
    
    user.save().success(function(){
      req.login(user, function(err){
        if(err) return next(err);
        res.redirect('/pusher');
      });
    }).error(function(err){
      res.render('users/signup',{
        message: message,
        user: user
      });
    });
};

/**
 * Find user by id
 */
 exports.user = function(req, res, next, id) {
  User.find({where : { id: id }}).success(function(user){
    if (!user) return next(new Error('Failed to load User ' + id));
    req.profile = user;
    next();
  }).error(function(err){
    next(err);
  });
};