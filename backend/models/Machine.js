const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Machine = sequelize.define('Machine', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Active', 'Idle', 'Maintenance', 'Offline'),
    defaultValue: 'Idle',
  },
  lat: {
    type: DataTypes.DOUBLE,
    defaultValue: 0.0,
  },
  lng: {
    type: DataTypes.DOUBLE,
    defaultValue: 0.0,
  },
  lastServiceDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  runtimeHours: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  performanceScore: {
    type: DataTypes.INTEGER,
    defaultValue: 100,
  },
  priority: {
    type: DataTypes.ENUM('High', 'Normal'),
    defaultValue: 'Normal',
  },
  city: {
    type: DataTypes.STRING,
    defaultValue: 'Unknown',
  },
  _id: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.getDataValue('id');
    }
  },
  location: {
    type: DataTypes.VIRTUAL,
    get() {
      return {
        lat: this.getDataValue('lat'),
        lng: this.getDataValue('lng')
      };
    },
    set(value) {
      if (value) {
        this.setDataValue('lat', value.lat);
        this.setDataValue('lng', value.lng);
      }
    }
  }
}, {
  timestamps: true,
});

module.exports = Machine;
