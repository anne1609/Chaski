'use strict';

module.exports = (sequelize, DataTypes) => {
    Grades_Communications = sequelize.define('grades_communications', {
        grade_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'grades',
                key: 'id',
            },
        },
        communication_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'communications',
                key: 'id',
            },
        },
    }, {
        tableName: 'grades_communications',
        timestamps: false,
    });
    Grades_Communications.associate = (models) => {
        Grades_Communications.belongsTo(models.grades, {
            foreignKey: 'grade_id',
            as: 'grade',
        });
        Grades_Communications.belongsTo(models.communications, {
            foreignKey: 'communication_id',
            as: 'communication',
        });
    };
    return Grades_Communications;
}