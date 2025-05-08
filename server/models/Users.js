'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    static associate(models) {
      // Define las asociaciones aquí
      if (models.Communications) {
        Users.hasMany(models.Communications, { foreignKey: 'user_id' });
        Users.belongsToMany(models.Communications, {
          through: 'users_communications',
          foreignKey: 'user_id',
          otherKey: 'communication_id'
        });
      }
    }
  }

  Users.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    names: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastNames: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('secretary', 'teacher'),
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'Users',
    tableName: 'users',
    timestamps: false,
  });

  return Users;
};