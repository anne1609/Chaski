'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Grades extends Model {
    static associate(models) {
      // Define las asociaciones aquí
      Grades.hasMany(models.Students, { foreignKey: 'grade_id' });
      Grades.belongsToMany(models.Teachers, { 
        through: 'teachers_grades',
        foreignKey: 'grade_id',
        otherKey: 'teacher_id'
      });
      Grades.hasMany(models.Subjects, { foreignKey: 'grade_id' });
      Grades.belongsToMany(models.Communications, {
        through: 'grades_communications',
        foreignKey: 'grade_id',
        otherKey: 'communication_id'
      });



    }
  }

  Grades.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Grades',
    tableName: 'grades',
    timestamps: false
  });

  return Grades;
};