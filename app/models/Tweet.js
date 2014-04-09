module.exports = function(sequelize, DataTypes) {

  var Tweet = sequelize.define('Tweet', 
    {
      text:              DataTypes.STRING,
      tweeter:           DataTypes.STRING,
      profile_image_url: DataTypes.STRING,
      media_url:         DataTypes.STRING,
      date:              DataTypes.DATE
    }
  );
  return Tweet;
};
