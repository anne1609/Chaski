'use strict';

module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define('users', {
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
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM('teacher','secretary'),
            allowNull: false,
        },
        phone_number: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    }, {
        tableName: 'users',
        timestamps: false,
    });
    return Users;
}