'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Students_Communications extends Model {
    static associate(models) {
      if (models.Students) {
        Students_Communications.belongsTo(models.Students, {
          foreignKey: 'student_id',
          as: 'student',
        });
      }
      
      if (models.Communications) {
        Students_Communications.belongsTo(models.Communications, {
          foreignKey: 'communication_id',
          as: 'communication',
        });
      }
    }
  }
  
  Students_Communications.init({
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'students',
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
    modelName: 'Students_Communications',
    tableName: 'students_communications',
    timestamps: false,
  });
  
  return Students_Communications;
};