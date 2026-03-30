const mongoose = require('mongoose');

const MachineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  status: { type: String, enum: ['Active', 'Idle', 'Maintenance', 'Offline'], default: 'Idle' },
  location: {
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 }
  },
  lastServiceDate: { type: Date, default: Date.now },
  runtimeHours: { type: Number, default: 0 },
  performanceScore: { type: Number, default: 100 },
  priority: { type: String, enum: ['High', 'Normal'], default: 'Normal' },
  city: { type: String, default: 'Unknown' }
}, { timestamps: true });

module.exports = mongoose.model('Machine', MachineSchema);
