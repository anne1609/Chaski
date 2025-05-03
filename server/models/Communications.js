'use strict';

module.exports = (sequelize, DataTypes) => {
    const Communications = sequelize.define('communications', {
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
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
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
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        }
    }, {
        tableName: 'communications',
        timestamps: false,
    });
    Communications.associate = (models) => {
        Communications.belongsTo(models.categories, {
            foreignKey: 'category_id',
            as: 'category',
        });
        Communications.belongsTo(models.users, {
            foreignKey: 'user_id',
            as: 'user',
        });
    };
    return Communications;
}
