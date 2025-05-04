'use strict';

module.exports = (sequelize, DataTypes) => {
    const Students_Communications = sequelize.define('students_communications', {
        student_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'students',
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
        confirmed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        date_confirmed: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        presence: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    }, {
        tableName: 'students_communications',
        timestamps: false,
    });
    Students_Communications.associate = (models) => {
        Students_Communications.belongsTo(models.students, {
            foreignKey: 'student_id',
            as: 'student',
        });
        Students_Communications.belongsTo(models.communications, {
            foreignKey: 'communication_id',
            as: 'communication',
        });
    };
    return Students_Communications;
}