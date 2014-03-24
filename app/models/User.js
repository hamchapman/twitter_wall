var crypto = require('crypto');

module.exports = function(sequelize, DataTypes) {

  var User = sequelize.define('User', 
  {
    username: { 
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    salt:           DataTypes.STRING,
    hashedPassword: DataTypes.STRING
  }, 
  {
    instanceMethods: {
      makeSalt: function() {
        return crypto.randomBytes(16).toString('base64'); 
      },
      authenticate: function(plainText){
        return this.encryptPassword(plainText, this.salt) === this.hashedPassword;
      },
      encryptPassword: function(password, salt) {
        if (!password || !salt) return '';
        salt = new Buffer(salt, 'base64');
        return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
      }
    }
  }
  );
  return User;
};