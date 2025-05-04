'use strict';

module.exports = (sequelize, DataTypes) => {
    const Grades = sequelize.define('grades', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    }, {
        tableName: 'grades',
        timestamps: false,
    });
    return Grades;
}