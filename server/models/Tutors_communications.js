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
      type: DataTypes.STRING, 
      allowNull: true,
      defaultValue: 'pendiente', 
    },
    meeting_datetime:  {
      type: DataTypes.DATE,
      allowNull: true,
    },
   
  }, {
    sequelize,
    modelName: 'Tutors_Communications',
    tableName: 'tutors_communications',
    timestamps: false,
  });
  
  return Tutors_Communications;
};