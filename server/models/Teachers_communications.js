'use strict';

module.exports = (sequelize, DataTypes) => {
    const Teachers_communications = sequelize.define('teachers_communications', {
        teacher_id: {
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
        sequelize,
        modelName: 'Teachers_communications',
        tableName: 'teachers_communications',
        timestamps: false,
    });
    Teachers_communications.associate = (models) => {
        Teachers_communications.belongsTo(models.Teachers, {
            foreignKey: 'teacher_id',
            as: 'teachers',
        });
        Teachers_communications.belongsTo(models.Communications, {
            foreignKey: 'communication_id',
            as: 'communication',
        });
    }
    return Teachers_communications;
}