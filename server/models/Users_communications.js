'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Users_Communications extends Model {
    static associate(models) {
      if (models.Users) {
        Users_Communications.belongsTo(models.Users, {
          foreignKey: 'user_id',
          as: 'user',
        });
      }
      
      if (models.Communications) {
        Users_Communications.belongsTo(models.Communications, {
          foreignKey: 'communication_id',
          as: 'communication',
        });
      }
    }
  }
  
  Users_Communications.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    communication_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'communications',
        key: 'id',
      },
    },
    confirmed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    date_confirmed: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    presence: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  }, {
    sequelize,
    modelName: 'Users_Communications',
    tableName: 'users_communications',
    timestamps: false,
  });
  
  return Users_Communications;
};