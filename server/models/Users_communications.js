'use strict';

module.exports = (sequelize, DataTypes) => {
    const Users_Communications = sequelize.define('users_communications', {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'users',
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
        tableName: 'users_communications',
        timestamps: false,
    });
    Users_Communications.associate = (models) => {
        Users_Communications.belongsTo(models.users, {
            foreignKey: 'user_id',
            as: 'user',
        });
        Users_Communications.belongsTo(models.communications, {
            foreignKey: 'communication_id',
            as: 'communication',
        });
    };
    return Users_Communications;
}