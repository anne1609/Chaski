'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TeacherGrades extends Model {
    static associate(models) {
      if (models.Teachers) {
        TeacherGrades.belongsTo(models.Teachers, {
          foreignKey: 'teacher_id',
          as: 'teacher'
        });
      }
      
      if (models.Grades) {
        TeacherGrades.belongsTo(models.Grades, {
          foreignKey: 'grade_id',
          as: 'grade'
        });
      }
    }
  }

  TeacherGrades.init({
    teacher_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'teachers',
        key: 'id'
      }
    },
    grade_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'grades',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'TeacherGrades',
    tableName: 'teachers_grades',
    timestamps: false
  });

  return TeacherGrades;
}