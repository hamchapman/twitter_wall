module.exports = function(sequelize, DataTypes) {

  var Query = sequelize.define('Query', 
    {
      text: DataTypes.STRING
    }
  );
  return Query;
};