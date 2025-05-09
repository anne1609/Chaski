'use strict';


    const { Model } = require('sequelize');
    
    module.exports = (sequelize, DataTypes) => {
      class Categories extends Model {
        static associate(models) {
          // Define las asociaciones aquí
      
        }
      }
    
      Categories.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
      }, {
        sequelize,
        modelName: 'Categories',
        tableName: 'categories',
        timestamps: false
      });
    
      return Categories;
    };