'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Students extends Model {
    static associate(models) {
      // Define asociaciones
      Students.belongsTo(models.Grades, { foreignKey: 'grade_id' });
      Students.belongsToMany(models.Communications, {
        through: 'students_communications',
        foreignKey: 'student_id',
        otherKey: 'communication_id'
      });
      Students.belongsToMany(models.Tutors, {
        through: 'tutors_students',
        foreignKey: 'student_id',
        otherKey: 'tutor_id'
      });
    }
  }

  Students.init({
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
      unique: true
    },
    grade_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'grades',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Students',
    tableName: 'students',
    timestamps: false
  });

  return Students;
};
