module.exports = function(sequelize, DataTypes) {

  var Hashtag = sequelize.define('Hashtag', 
    {
      text: DataTypes.STRING
    }
  );
  return Hashtag;
};
