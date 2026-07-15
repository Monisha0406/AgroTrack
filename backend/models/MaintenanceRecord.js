const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Machine = require('./Machine');

const MaintenanceRecord = sequelize.define('MaintenanceRecord', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  scheduledDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Upcoming', 'Completed', 'Overdue'),
    defaultValue: 'Upcoming',
  },
  details: {
    type: DataTypes.STRING,
    defaultValue: 'General Service',
  },
  cost: {
    type: DataTypes.DOUBLE,
    defaultValue: 0,
  },
  serviceType: {
    type: DataTypes.STRING,
    defaultValue: 'Routine Maintenance',
  },
  _id: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.getDataValue('id');
    }
  }
}, {
  timestamps: true,
});

// Relationships
MaintenanceRecord.belongsTo(Machine, { foreignKey: 'machineId', as: 'machine', onDelete: 'CASCADE' });
Machine.hasMany(MaintenanceRecord, { foreignKey: 'machineId', as: 'maintenanceRecords', onDelete: 'CASCADE' });

module.exports = MaintenanceRecord;
