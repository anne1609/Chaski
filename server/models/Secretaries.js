'use strict';

module.exports = (sequelize, DataTypes) => {
  const Secretaries = sequelize.define('Secretaries', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    names: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastNames: {
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
    phone_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'Secretaries',
    tableName: 'secretaries',
    timestamps: false,
  });

  return Secretaries;
};