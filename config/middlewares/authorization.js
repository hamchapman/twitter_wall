exports.requiresLogin = function(req, res, next) {
  if (!req.isAuthenticated()) {
    res.redirect('/signin');
    // return res.send(401, 'User is not authorized');
  }
  next();
};