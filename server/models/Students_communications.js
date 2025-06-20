'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Students_Communications extends Model {
    static associate(models) {
      if (models.Students) {
        Students_Communications.belongsTo(models.Students, {
          foreignKey: 'student_id',
          as: 'students',
        });
      }
      
      if (models.Communications) {
        Students_Communications.belongsTo(models.Communications, {
          foreignKey: 'communication_id',
          as: 'communications',
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
    modelName: 'Students_Communications',
    tableName: 'students_communications',
    timestamps: false,
  });
  
  return Students_Communications;
};