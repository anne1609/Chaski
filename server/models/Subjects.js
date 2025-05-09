'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Subjects extends Model {
    static associate(models) {
      // Mantener la relación uno a uno por backward compatibility
      Subjects.belongsTo(models.Teachers, { foreignKey: 'teacher_id' });
      Subjects.belongsTo(models.Grades, { foreignKey: 'grade_id' });
      
      // Nueva relación muchos a muchos con Teachers
      Subjects.belongsToMany(models.Teachers, {
        through: 'subjects_teachers',
        foreignKey: 'subject_id',
        otherKey: 'teacher_id',
        as: 'teachers'
      });
    }
  }

  Subjects.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    grade_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'grades',
        key: 'id'
      }
    },
    teacher_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'teachers',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Subjects',
    tableName: 'subjects',
    timestamps: false
  });

  return Subjects;
};