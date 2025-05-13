'use strict';

module.exports = (sequelize, DataTypes) => {
  const Secretaries_communications = sequelize.define('secretaries_communications', {
    secretary_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'secretaries',
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
    modelName: 'Secretary_communications',
    tableName: 'secretaries_communications',
    timestamps: false,
  });
  Secretaries_communications.associate = (models) => {
    Secretaries_communications.belongsTo(models.Secretaries, {
      foreignKey: 'secretary_id',
      as: 'secretaries',
    });
    Secretaries_communications.belongsTo(models.Communications, {
      foreignKey: 'communication_id',
      as: 'communications',
    });
  }
  return Secretaries_communications;
};