/**
 * Seed Script — AgriTrack CRM (Tamil Nadu Edition)
 * Run: node seed.js
 * Seeds 32 machines + realistic maintenance records
 */

const mongoose = require('mongoose');
const Machine = require('./models/Machine');
const MaintenanceRecord = require('./models/MaintenanceRecord');

mongoose
  .connect('mongodb://127.0.0.1:27017/crm_machine_tracking')
  .then(() => console.log('MongoDB connected for seeding...'))
  .catch(err => { console.error(err); process.exit(1); });

// Tamil Nadu city coordinates (realistic lat/lng bounds)
const tnLocations = [
  { city: 'Chennai',      lat: 13.0827, lng: 80.2707 },
  { city: 'Coimbatore',   lat: 11.0168, lng: 76.9558 },
  { city: 'Madurai',      lat: 9.9252,  lng: 78.1198 },
  { city: 'Trichy',       lat: 10.7905, lng: 78.7047 },
  { city: 'Salem',        lat: 11.6643, lng: 78.1460 },
  { city: 'Erode',        lat: 11.3410, lng: 77.7172 },
  { city: 'Tirunelveli',  lat: 8.7139,  lng: 77.7567 },
  { city: 'Vellore',      lat: 12.9165, lng: 79.1325 },
  { city: 'Thanjavur',    lat: 10.7867, lng: 79.1378 },
  { city: 'Dindigul',     lat: 10.3673, lng: 77.9803 },
  { city: 'Tiruppur',     lat: 11.1085, lng: 77.3411 },
  { city: 'Kanchipuram',  lat: 12.8342, lng: 79.7036 },
];

// Add slight jitter to a base location to make each machine unique
const jitter = (val, range = 0.05) => val + (Math.random() - 0.5) * range;

const seed = async () => {
  try {
    await Machine.deleteMany({});
    await MaintenanceRecord.deleteMany({});
    console.log('Cleared existing data.');

    const statuses = ['Active', 'Active', 'Active', 'Idle', 'Idle', 'Maintenance'];

    const machineData = [
      // Tractors
      { name: 'Tractor TN-01',    type: 'Tractor',    locIdx: 0  },
      { name: 'Tractor TN-02',    type: 'Tractor',    locIdx: 1  },
      { name: 'Tractor TN-03',    type: 'Tractor',    locIdx: 2  },
      { name: 'Tractor TN-04',    type: 'Tractor',    locIdx: 3  },
      { name: 'Tractor TN-05',    type: 'Tractor',    locIdx: 4  },
      { name: 'Tractor TN-06',    type: 'Tractor',    locIdx: 5  },
      { name: 'Tractor TN-07',    type: 'Tractor',    locIdx: 6  },
      { name: 'Tractor TN-08',    type: 'Tractor',    locIdx: 7  },
      // Harvesters
      { name: 'Harvester TN-09',  type: 'Harvester',  locIdx: 8  },
      { name: 'Harvester TN-10',  type: 'Harvester',  locIdx: 9  },
      { name: 'Harvester TN-11',  type: 'Harvester',  locIdx: 10 },
      { name: 'Harvester TN-12',  type: 'Harvester',  locIdx: 11 },
      { name: 'Harvester TN-13',  type: 'Harvester',  locIdx: 0  },
      { name: 'Harvester TN-14',  type: 'Harvester',  locIdx: 1  },
      // Sprayers
      { name: 'Sprayer TN-15',    type: 'Sprayer',    locIdx: 2  },
      { name: 'Sprayer TN-16',    type: 'Sprayer',    locIdx: 3  },
      { name: 'Sprayer TN-17',    type: 'Sprayer',    locIdx: 4  },
      { name: 'Sprayer TN-18',    type: 'Sprayer',    locIdx: 5  },
      { name: 'Sprayer TN-19',    type: 'Sprayer',    locIdx: 6  },
      // Planters
      { name: 'Planter TN-20',    type: 'Planter',    locIdx: 7  },
      { name: 'Planter TN-21',    type: 'Planter',    locIdx: 8  },
      { name: 'Planter TN-22',    type: 'Planter',    locIdx: 9  },
      { name: 'Planter TN-23',    type: 'Planter',    locIdx: 10 },
      // Tillers
      { name: 'Tiller TN-24',     type: 'Tillage',    locIdx: 11 },
      { name: 'Tiller TN-25',     type: 'Tillage',    locIdx: 0  },
      { name: 'Tiller TN-26',     type: 'Tillage',    locIdx: 1  },
      // Combines
      { name: 'Combine TN-27',    type: 'Combine',    locIdx: 2  },
      { name: 'Combine TN-28',    type: 'Combine',    locIdx: 3  },
      { name: 'Combine TN-29',    type: 'Combine',    locIdx: 4  },
      // Irrigation
      { name: 'Irrigator TN-30',  type: 'Irrigation', locIdx: 5  },
      { name: 'Irrigator TN-31',  type: 'Irrigation', locIdx: 6  },
      // Loader
      { name: 'Loader TN-32',     type: 'Loader',     locIdx: 7  },
    ];

    // Force certain machines into Maintenance for dashboard variety
    const maintenanceForcedIdx = [3, 9, 14, 18, 23, 27]; // 6 machines in maintenance

    const machines = await Machine.insertMany(
      machineData.map((m, i) => {
        const base = tnLocations[m.locIdx];
        let status = statuses[i % statuses.length];
        if (maintenanceForcedIdx.includes(i)) status = 'Maintenance';

        const lastServiceDate = new Date();
        lastServiceDate.setDate(lastServiceDate.getDate() - Math.floor(Math.random() * 60 + 10));

        return {
          name: m.name,
          type: m.type,
          status,
          city: base.city,
          location: { lat: jitter(base.lat), lng: jitter(base.lng) },
          runtimeHours: Math.floor(Math.random() * 3000 + 100),
          priority: maintenanceForcedIdx.includes(i) ? 'High' : 'Normal',
          lastServiceDate,
        };
      })
    );

    console.log(`✅ Seeded ${machines.length} machines across Tamil Nadu.`);

    // ── Maintenance Records ────────────────────────────────
    const today = new Date();
    const daysAgo   = (n) => new Date(today.getTime() - n * 86400000);
    const daysAhead = (n) => new Date(today.getTime() + n * 86400000);

    const serviceTypes = [
      'Engine Oil & Filter Change',
      'Hydraulic System Check',
      'Air Filter Replacement',
      'Threshing Drum Belt Replacement',
      'Full Fluid Flush',
      'Engine Overhaul & Diagnostic',
      'Tire Rotation & Balancing',
      'Transmission Fluid Top-Up',
      'Battery & Electrical Test',
      'Nozzle & Boom Leak Repair',
      'Seed Disc Calibration',
      'Gearbox Lubrication',
      'Header Attachment Service',
      'Rear Axle Bearing Replacement',
      'Fuel Injector Cleaning',
    ];

    const priorities = ['High', 'Normal', 'High', 'Normal', 'Normal', 'High'];

    const maintenanceRecords = [];
    const statusPool = ['Completed', 'Upcoming', 'Overdue', 'Completed', 'Upcoming'];

    machines.forEach((machine, i) => {
      // Every machine gets at least 1 record; maintenance ones get 2
      const numRecords = maintenanceForcedIdx.includes(i) ? 2 : 1;
      for (let r = 0; r < numRecords; r++) {
        const status = statusPool[(i + r) % statusPool.length];
        const dateOffset = status === 'Completed' ? -daysAgo(0).getDate() : (status === 'Overdue' ? -2 : (i % 20) + 5);

        maintenanceRecords.push({
          machine: machine._id,
          scheduledDate: status === 'Completed' ? daysAgo(Math.floor(Math.random() * 20 + 5)) : daysAhead(Math.floor(Math.random() * 30 + 1)),
          status,
          details: serviceTypes[(i + r) % serviceTypes.length],
          cost: [2000, 3500, 5000, 7500, 10000, 15000, 20000][Math.floor(Math.random() * 7)],
          serviceType: ['Routine Maintenance', 'Preventive Maintenance', 'Major Repair', 'Inspection', 'Component Replacement'][(i + r) % 5],
        });
      }
    });

    await MaintenanceRecord.insertMany(maintenanceRecords);
    console.log(`✅ Seeded ${maintenanceRecords.length} maintenance records.`);

    console.log('\n🚀 Done! Restart your Node server now: node server.js');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err.message);
    process.exit(1);
  }
};

seed();
