const express = require('express');
const router = express.Router();
const Machine = require('../models/Machine');

// Get all machines
router.get('/', async (req, res) => {
  try {
    const machines = await Machine.findAll();
    res.json(machines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a machine
router.post('/', async (req, res) => {
  try {
    const { name, type, status, runtimeHours, location } = req.body;
    const lat = location ? location.lat : 0.0;
    const lng = location ? location.lng : 0.0;
    
    const machine = await Machine.create({
      name,
      type,
      status: status || 'Idle',
      runtimeHours: runtimeHours || 0,
      lat,
      lng
    });
    
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
    const machine = await Machine.findByPk(req.params.id);
    if (!machine) {
      return res.status(404).json({ message: 'Machine not found' });
    }
    
    machine.status = status;
    await machine.save();
    
    // Emit real-time event to connected clients
    if (req.io) {
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
    const machine = await Machine.findByPk(req.params.id);
    if (!machine) {
      return res.status(404).json({ message: 'Machine not found' });
    }
    
    machine.lat = lat;
    machine.lng = lng;
    await machine.save();
    
    // Emit real-time event
    if (req.io) {
      req.io.emit('machine-location-changed', machine);
    }
    
    res.json(machine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
