module.exports = function(sequelize, DataTypes) {

  var CleanTweet = sequelize.define('CleanTweet', 
    {
      text:              DataTypes.STRING,
      tweeter:           DataTypes.STRING,
      profile_image_url: DataTypes.STRING
    }
  );
  return CleanTweet;
};
