const express = require('express');
const router = express.Router();
const Machine = require('../models/Machine');

// Get all machines
router.get('/', async (req, res) => {
  try {
    const machines = await Machine.find({});
    res.json(machines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a machine
router.post('/', async (req, res) => {
  try {
    const machine = await Machine.create(req.body);
    req.io.emit('machine-added', machine);
    res.status(201).json(machine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update machine status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const machine = await Machine.findByIdAndUpdate(req.params.id, { status }, { new: true });
    
    // Emit real-time event to connected clients
    if(req.io) {
      req.io.emit('machine-status-changed', machine);
    }
    
    res.json(machine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update machine location
router.put('/:id/location', async (req, res) => {
  try {
    const { lat, lng } = req.body;
    const machine = await Machine.findByIdAndUpdate(req.params.id, { location: { lat, lng } }, { new: true });
    
    // Emit real-time event
    if(req.io) {
      req.io.emit('machine-location-changed', machine);
    }
    
    res.json(machine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
