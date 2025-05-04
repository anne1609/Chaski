'use strict';

module.exports = (sequelize, DataTypes) => {
    const Tutors_students = sequelize.define('tutors_students', {
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
        tableName: 'tutors_students',
        timestamps: false,
    });
    Tutors_students.associate = (models) => {
        Tutors_students.belongsTo(models.tutors, {
            foreignKey: 'tutor_id',
            as: 'tutor',
        });
        Tutors_students.belongsTo(models.students, {
            foreignKey: 'student_id',
            as: 'student',
        });
        Tutors_students.belongsTo(models.grades, {
            foreignKey: 'grades_id',
            as: 'grade',
        });
    };
    return Tutors_students;
}