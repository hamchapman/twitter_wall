var db = require('../../../config/sequelize');
require('../../testHelper');

describe(__filename, function() {
  it("creates a new user", function(done) {
    var req = {
      body: {
        username: 'admin',
        password: 'secretpassword'
      },
      login: function(user, err) {
        db.User.findAll().success(function(users) {
          users.length.should.equal(1);
        })
        done();
      }
    }

    var res = {
      status: function(val) {
        this._status = val;
        return this;
      },
      send: function(val) {
        this._status.should.equal(200);
      }
    }
    var userRoutes = require('../../../app/controllers/users');
    userRoutes.create(req, res);

  });
});