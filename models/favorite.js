'use strict';
module.exports = (sequelize, DataTypes) => {
  const Favorite = sequelize.define('Favorite', {
    UserId: DataTypes.INTEGER,
    RestaurantId: DataTypes.INTEGER
  }, {});
  Favorite.associate = function(models) {
    
  };
  return Favorite;
};