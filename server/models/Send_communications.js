'use strict';

module.exports = (sequelize, DataTypes) => {
    Send_Communications = sequelize.define('send_communications', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        communication_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'communications',
                key: 'id',
            },
        },
        date_sent: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        fowarded: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    }, {
        tableName: 'send_communications',
        timestamps: false,
    });
    Send_Communications.associate = (models) => {
        Send_Communications.belongsTo(models.communications, {
            foreignKey: 'communication_id',
            as: 'communication',
        });
    };
    return Send_Communications;
}