const mongoose = require('mongoose');

const MaintenanceRecordSchema = new mongoose.Schema({
  machine: { type: mongoose.Schema.Types.ObjectId, ref: 'Machine', required: true },
  scheduledDate: { type: Date, required: true },
  status: { type: String, enum: ['Upcoming', 'Completed', 'Overdue'], default: 'Upcoming' },
  details: { type: String, default: 'General Service' },
  cost: { type: Number, default: 0 },
  serviceType: { type: String, default: 'Routine Maintenance' }
}, { timestamps: true });

module.exports = mongoose.model('MaintenanceRecord', MaintenanceRecordSchema);
