'use strict';

module.exports = (sequelize, DataTypes) => {
    const Students = sequelize.define('students', {
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
        grade_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'grades',
                key: 'id',
            },
        },
    }, {
        tableName: 'students',
        timestamps: false,
    });
    Students.associate = (models) => {
        Students.belongsTo(models.grades, {
            foreignKey: 'grade_id',
            as: 'grade',
        });
    };
    return Students;
}
