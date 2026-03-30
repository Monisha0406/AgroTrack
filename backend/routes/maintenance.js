const express = require('express');
const router = express.Router();
const MaintenanceRecord = require('../models/MaintenanceRecord');
const Machine = require('../models/Machine');

// Get all maintenance records (populated with machine name)
router.get('/', async (req, res) => {
  try {
    const records = await MaintenanceRecord.find({})
      .populate('machine', 'name type')
      .sort({ scheduledDate: 1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all machines list (for the schedule modal dropdown)
router.get('/machines-list', async (req, res) => {
  try {
    const machines = await Machine.find({}, '_id name type');
    res.json(machines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Schedule a new maintenance record
router.post('/', async (req, res) => {
  try {
    const { machine, scheduledDate, details, cost } = req.body;
    const record = await MaintenanceRecord.create({
      machine,
      scheduledDate,
      details,
      cost: cost || 0,
      status: 'Upcoming'
    });
    const populated = await record.populate('machine', 'name type');
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update maintenance record status
router.put('/:id', async (req, res) => {
  try {
    const record = await MaintenanceRecord.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    ).populate('machine', 'name type');
    res.json(record);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a maintenance record
router.delete('/:id', async (req, res) => {
  try {
    await MaintenanceRecord.findByIdAndDelete(req.params.id);
    res.json({ message: 'Record deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
