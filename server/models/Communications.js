'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Communications extends Model {
    static associate(models) {
      // Define las asociaciones solo si los modelos existen para evitar errores
      if (models.Categories) {
        Communications.belongsTo(models.Categories, {
          foreignKey: 'category_id',
          as: 'category',
        });
      }
      
      if (models.Secretaries) {
        Communications.belongsTo(models.Secretaries, {
          foreignKey: 'secretary_id',
          as: 'secretaries',
        });
      }

      if (models.Teachers) {
        Communications.belongsTo(models.Teachers, {
          foreignKey: 'teacher_id',
          as: 'teachers',
        });
      }
      
      // Relación muchos a muchos con Grades
      if (models.Grades) {
        Communications.belongsToMany(models.Grades, {
          through: 'grades_communications',
          foreignKey: 'communication_id',
          otherKey: 'grade_id',
        });
      }
      
      // Otras relaciones muchos a muchos
      if (models.Students) {
        Communications.belongsToMany(models.Students, {
          through: 'students_communications',
          foreignKey: 'communication_id',
          otherKey: 'student_id',
        });
      }
      
      if (models.Tutors) {
        Communications.belongsToMany(models.Tutors, {
          through: 'tutors_communications',
          foreignKey: 'communication_id',
          otherKey: 'tutor_id',
        });
      }
      
      if (models.Secretaries) {
        Communications.belongsToMany(models.Secretaries, {
          through: 'secretaries_communications',
          foreignKey: 'communication_id',
          otherKey: 'secretary_id',
        });
      }
    }
  }
  
  Communications.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'categories',
        key: 'id',
      },
    },
    secretary_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'secretaries',
        key: 'id',
      },
    },
    teacher_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'teachers',
        key: 'id',
      },
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    body: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    priority: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: { 
      type: DataTypes.STRING,
      allowNull: false,
    },
    meeting_datetime: { 
      type: DataTypes.DATE,
      allowNull: true,
    },
    attendance_status: { 
      type: DataTypes.STRING,
      allowNull: true,
    },
    attachment: { 
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    }
  }, {
    sequelize,
    modelName: 'Communications',
    tableName: 'communications',
    timestamps: false,
  });
  
  return Communications;
};
