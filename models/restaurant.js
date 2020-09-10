'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('Restaurant', {
    name: DataTypes.STRING,
    tel: DataTypes.STRING,
    address: DataTypes.STRING,
    opening_hours: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};