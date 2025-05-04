'use strict';

module.exports = (sequelize, DataTypes) => {
    const Tutors_Communications = sequelize.define('tutors_communications', {
        tutor_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'tutors',
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
        tableName: 'tutors_communications',
        timestamps: false,
    });
    Tutors_Communications.associate = (models) => {
        Tutors_Communications.belongsTo(models.tutors, {
            foreignKey: 'tutor_id',
            as: 'tutor',
        });
        Tutors_Communications.belongsTo(models.communications, {
            foreignKey: 'communication_id',
            as: 'communication',
        });
    };
    return Tutors_Communications;
}