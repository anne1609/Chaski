'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Tutors_Communications extends Model {
    static associate(models) {
      if (models.Tutors) {
        Tutors_Communications.belongsTo(models.Tutors, {
          foreignKey: 'tutor_id',
          as: 'tutors',
        });
      }
      
      if (models.Communications) {
        Tutors_Communications.belongsTo(models.Communications, {
          foreignKey: 'communication_id',
          as: 'communications',
        });
      }
    }
  }
  
  Tutors_Communications.init({
    tutor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'tutors',
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
    modelName: 'Tutors_Communications',
    tableName: 'tutors_communications',
    timestamps: false,
  });
  
  return Tutors_Communications;
};