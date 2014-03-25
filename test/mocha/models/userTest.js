var should = require('should');
var app = require('../../../app');
var db = require('../../../config/sequelize');
var User = db.User;
var testHelper = require('../../testHelper');

var user;

describe(__filename, function() {
  describe('Database', function() {
    it("starts with no users", function(done) {
      User.findAll()
        .success(function(users) {
          users.should.have.length(0);
          done();
        });
    });

    it("hashes the user\'s password", function(done) {
      var payload = { username: "admin", password: "secretpassword" };
      var newUser = testHelper.prepareUserForDatabase(payload);
      newUser.save();
      payload.password.should.not.equal(User.find({ where: { username: payload.username }}).hashedPassword);
      done();
    });

    it("prevents a user signing up with no username", function(done) {
      var payload = { username: "", password: "secretpassword" };
      var newUser = testHelper.prepareUserForDatabase(payload);
      newUser.save().error(function(err) {
        should.exist(err);
        done();
      });
    });

    // it("prevents a user signing up with the same username", function(done) {
    //   var payload = { username: "admin", password: "ssecretpassword" };
    //   var newUser = testHelper.prepareUserForDatabase(payload);
    //   var anotherNewUser = testHelper.prepareUserForDatabase(payload);
    //   newUser.save();
    //   anotherNewUser.save().error(function(err) {
    //     should.exist(err);
    //   });
    //   done();
    // });
  });
});