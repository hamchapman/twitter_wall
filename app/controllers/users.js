var db = require('../../config/sequelize');

exports.signin = function(req, res) {
  res.render('users/signin', {
    title: 'Signin',
    message: req.flash('error')
  });
};

exports.signup = function(req, res) {
  db.User.findAll().success(function(users) {
    if(users.length > 0) {          // Check if an admin has already been created
      res.redirect('/pusher');      // If it has then send on to next stage of setup
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

exports.authCallback = function(req, res, next) {
  res.redirect('/');
};

exports.session = function(req, res) {
  res.redirect('/');
};

exports.create = function(req, res) {
  var user = db.User.build(req.body);
  user.salt = user.makeSalt();
  user.hashedPassword = user.encryptPassword(req.body.password, user.salt);

  user.save()
    .success(function(){
      req.login(user, function(err){
        if (err) { 
          res.status(422).send(err.message);
          return next(err);
        }
        res.status(200).redirect('/pusher');
      });
    })
    .error(function(err){
      res.status(422).render('users/signup', {
        user: user
      });
  });
};

exports.user = function(req, res, next, id) {
  User.find({where : { id: id }})
    .success(function(user){
      if (!user) return next(new Error('Failed to load User ' + id));
      req.profile = user;
      next();
    })
    .error(function(err){
      next(err);
    });
};