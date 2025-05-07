'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Teachers extends Model {
    static associate(models) {
      // Relación con Subjects (uno a muchos)
      Teachers.hasMany(models.Subjects, { foreignKey: 'teacher_id' });
      
      // Relación muchos a muchos con Grades a través de la tabla pivote
      Teachers.belongsToMany(models.Grades, { 
        through: 'teachers_grades',
        foreignKey: 'teacher_id',
        otherKey: 'grade_id'
      });
      
      //Relación muchos a muchos con Subjects
      Teachers.belongsToMany(models.Subjects, {
        through: 'subjects_teachers',
        foreignKey: 'teacher_id',
        otherKey: 'subject_id',
        as: 'subjects'
      });
    }
  }

  Teachers.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    names: {
      type: DataTypes.STRING,
      allowNull: false
    },
    last_names: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: true
    },
    specialization: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Teachers',
    tableName: 'teachers',
    timestamps: false
  });

  return Teachers;
};