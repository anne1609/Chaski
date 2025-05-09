'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Grades_Communications extends Model {
    static associate(models) {
      // Las asociaciones se definen en los modelos principales (Grades y Communications)
    }
  }
  
  Grades_Communications.init({
    grade_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'grades',
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
    }
  }, {
    sequelize,
    modelName: 'Grades_Communications',
    tableName: 'grades_communications',
    timestamps: false,
  });
  
  return Grades_Communications;
};