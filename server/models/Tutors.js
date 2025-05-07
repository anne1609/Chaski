'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Tutors extends Model {
    static associate(models) {
      if (models.Students) {
        Tutors.belongsToMany(models.Students, {
          through: 'tutors_students',
          foreignKey: 'tutor_id',
          otherKey: 'student_id'
        });
      }
      
      if (models.Communications) {
        Tutors.belongsToMany(models.Communications, {
          through: 'tutors_communications',
          foreignKey: 'tutor_id',
          otherKey: 'communication_id'
        });
      }
    }
  }

  Tutors.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    names: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_names: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'Tutors',
    tableName: 'tutors',
    timestamps: false,
  });

  return Tutors;
};