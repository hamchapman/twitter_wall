module.exports = function(sequelize, DataTypes) {

  var PusherConfig = sequelize.define('PusherConfig', 
    {
      app_id: DataTypes.INTEGER,
      key: DataTypes.STRING,
      secret: DataTypes.STRING
    }
  );

  return PusherConfig;
};
