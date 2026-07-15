const express = require('express');
const router = express.Router();
const MaintenanceRecord = require('../models/MaintenanceRecord');
const Machine = require('../models/Machine');

// Get all maintenance records (populated with machine name)
router.get('/', async (req, res) => {
  try {
    const records = await MaintenanceRecord.findAll({
      include: [{
        model: Machine,
        as: 'machine',
        attributes: ['id', 'name', 'type']
      }],
      order: [['scheduledDate', 'ASC']]
    });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all machines list (for the schedule modal dropdown)
router.get('/machines-list', async (req, res) => {
  try {
    const machines = await Machine.findAll({
      attributes: ['id', 'name', 'type']
    });
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
      machineId: machine, // ForeignKey in Sequelize
      scheduledDate,
      details,
      cost: cost || 0,
      status: 'Upcoming'
    });
    
    const populated = await MaintenanceRecord.findByPk(record.id, {
      include: [{
        model: Machine,
        as: 'machine',
        attributes: ['id', 'name', 'type']
      }]
    });
    
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update maintenance record status
router.put('/:id', async (req, res) => {
  try {
    const record = await MaintenanceRecord.findByPk(req.params.id);
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }
    
    record.status = req.body.status;
    await record.save();
    
    const populated = await record.reload({
      include: [{
        model: Machine,
        as: 'machine',
        attributes: ['id', 'name', 'type']
      }]
    });
    
    res.json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a maintenance record
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await MaintenanceRecord.destroy({
      where: { id: req.params.id }
    });
    if (!deleted) {
      return res.status(404).json({ message: 'Record not found' });
    }
    res.json({ message: 'Record deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
