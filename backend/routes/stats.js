const express = require('express');
const router = express.Router();
const Machine = require('../models/Machine');

router.get('/', async (req, res) => {
  try {
    const totalMachines = await Machine.count({});
    const activeMachines = await Machine.count({ where: { status: 'Active' } });
    const idleMachines = await Machine.count({ where: { status: 'Idle' } });
    const maintenanceMachines = await Machine.count({ where: { status: 'Maintenance' } });
    
    // Quick mock data for charts
    const chartData = [
      { name: 'Mon', active: 14, idle: 6, maintenance: 2 },
      { name: 'Tue', active: 15, idle: 5, maintenance: 2 },
      { name: 'Wed', active: 18, idle: 2, maintenance: 2 },
      { name: 'Thu', active: 16, idle: 4, maintenance: 2 },
      { name: 'Fri', active: 19, idle: 1, maintenance: 2 },
      { name: 'Sat', active: 10, idle: 10, maintenance: 2 },
      { name: 'Sun', active: 8, idle: 12, maintenance: 2 },
    ];
    
    res.json({
      cards: {
        total: totalMachines,
        active: activeMachines,
        idle: idleMachines,
        maintenance: maintenanceMachines,
      },
      lineChart: chartData,
      pieChart: [
        { name: 'Active', value: activeMachines },
        { name: 'Idle', value: idleMachines },
        { name: 'Maintenance', value: maintenanceMachines }
      ]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
