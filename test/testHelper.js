var db = require('../config/sequelize');

beforeEach(function(done) {
  db.User.findAll().success(function(users) {
    if (users.length === 0) { done(); }
    users.forEach(function(user, index) {
      user.destroy().success(function() {
        if (index === users.length - 1) { done(); }
      });
    })
  })
})

exports.prepareUserForDatabase = function(payload) {
  var newUser = db.User.build(payload);
  newUser.salt = newUser.makeSalt();
  newUser.hashedPassword = newUser.encryptPassword(payload.password, newUser.salt);
  return newUser;
}