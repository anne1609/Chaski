'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Tutors_Students extends Model {
    static associate(models) {
      if (models.Tutors) {
        Tutors_Students.belongsTo(models.Tutors, {
          foreignKey: 'tutor_id',
          as: 'tutor',
        });
      }
      
      if (models.Students) {
        Tutors_Students.belongsTo(models.Students, {
          foreignKey: 'student_id',
          as: 'student',
        });
      }
      
      if (models.Grades) {
        Tutors_Students.belongsTo(models.Grades, {
          foreignKey: 'grades_id',
          as: 'grade',
        });
      }
    }
  }
  
  Tutors_Students.init({
    tutor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'tutors',
        key: 'id',
      },
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'students',
        key: 'id',
      },
    },
    grades_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'grades',
        key: 'id',
      },
    },
  }, {
    sequelize,
    modelName: 'Tutors_Students',
    tableName: 'tutors_students',
    timestamps: false,
  });
  
  return Tutors_Students;
};