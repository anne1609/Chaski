'use strict';

module.exports = (sequelize, DataTypes) => {
    const Tutor = sequelize.define('tutors', {
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
        tableName: 'tutors',
        timestamps: false,
    });
    return Tutor;
}