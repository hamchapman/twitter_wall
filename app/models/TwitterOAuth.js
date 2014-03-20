module.exports = function(sequelize, DataTypes) {

  var TwitterOAuth = sequelize.define('TwitterOAuth', 
  {
    oauth_token: DataTypes.STRING,
    oauth_secret: DataTypes.STRING
  }
  );
  return TwitterOAuth;
};
