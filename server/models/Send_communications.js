'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Send_Communications extends Model {
        static associate(models) {
          // Las asociaciones se definen en los modelos principales (Grades y Communications)
        }
      }



      Send_Communications.init({
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
        sequelize,
        modelName: 'Send_Communications',
        tableName: 'send_communications',
        timestamps: false,
      });
      
      return Send_Communications;
    };