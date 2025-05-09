'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SubjectsTeachers extends Model {
    static associate(models) {
      // Define asociaciones si es necesario
      if (models.Subjects) {
        SubjectsTeachers.belongsTo(models.Subjects, {
          foreignKey: 'subject_id',
          as: 'subject'
        });
      }
      
      if (models.Teachers) {
        SubjectsTeachers.belongsTo(models.Teachers, {
          foreignKey: 'teacher_id',
          as: 'teacher'
        });
      }
    }
  }

  SubjectsTeachers.init({
    subject_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'subjects',
        key: 'id'
      }
    },
    teacher_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'teachers',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'SubjectsTeachers',
    tableName: 'subjects_teachers',
    timestamps: false
  });

  return SubjectsTeachers;
};