module.exports = function(sequelize, DataTypes) {

  var SponsorLogo = sequelize.define('SponsorLogo', 
    {
      name: DataTypes.STRING,
      path: DataTypes.STRING
    }
  );
  return SponsorLogo;
};
