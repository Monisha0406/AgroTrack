const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const { sequelize, connectDB } = require('./config/db');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

app.use(cors());
app.use(express.json());

// Pass io to request object for use in controllers
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Connect to MySQL database
connectDB();

// Sync Database Tables
sequelize.sync({ alter: true })
  .then(() => console.log('MySQL database tables synchronized successfully.'))
  .catch((err) => console.error('MySQL database sync error:', err));

// Routes Configuration
app.use('/api/auth', require('./routes/auth'));
app.use('/api/machines', require('./routes/machines'));
app.use('/api/stats', require('./routes/stats')); // For dashboard charts
app.use('/api/maintenance', require('./routes/maintenance'));

// Basic Route
app.get('/', (req, res) => {
  res.send('CRM Machine Tracking API is running (MySQL)');
});

// Socket.io Connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Tamil Nadu geographic bounds
const TN_BOUNDS = { latMin: 8.0, latMax: 13.5, lngMin: 76.9, lngMax: 80.3 };
const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

// Telemetry Simulation — Tamil Nadu region using Sequelize
const Machine = require('./models/Machine');
const statuses = ['Active', 'Idle', 'Maintenance'];

setInterval(async () => {
  try {
    const count = await Machine.count();
    if (count > 0) {
      // Pick 2 random machines per tick for more activity
      for (let t = 0; t < 2; t++) {
        const random = Math.floor(Math.random() * count);
        const machine = await Machine.findOne({ offset: random });
        if (!machine) continue;

        const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
        machine.status = newStatus;
        machine.runtimeHours += Math.floor(Math.random() * 3);

        // Move Active machines within TN bounds
        if (machine.status === 'Active') {
          machine.lat = clamp(
            machine.lat + (Math.random() - 0.5) * 0.003,
            TN_BOUNDS.latMin, TN_BOUNDS.latMax
          );
          machine.lng = clamp(
            machine.lng + (Math.random() - 0.5) * 0.003,
            TN_BOUNDS.lngMin, TN_BOUNDS.lngMax
          );
        }

        await machine.save();
        io.emit('machine-status-changed', machine);
        io.emit('machine-location-changed', machine);
        console.log(`[Telemetry] ${machine.name} → ${newStatus} @ (${machine.lat?.toFixed(4)}, ${machine.lng?.toFixed(4)})`);
      }
    } else {
      // Fallback seed if DB is empty (TN coordinates)
      const initialMachines = [
        { name: 'Tractor TN-01',   type: 'Tractor',   status: 'Active',      lat: 13.08, lng: 80.27, runtimeHours: 1240, city: 'Chennai' },
        { name: 'Harvester TN-09', type: 'Harvester',  status: 'Active',      lat: 11.02, lng: 76.96, runtimeHours: 890,  city: 'Coimbatore' },
        { name: 'Sprayer TN-15',   type: 'Sprayer',    status: 'Idle',        lat: 9.93,  lng: 78.12, runtimeHours: 450,  city: 'Madurai' },
        { name: 'Planter TN-20',   type: 'Planter',    status: 'Maintenance', lat: 10.79, lng: 78.70, runtimeHours: 780,  city: 'Trichy' },
        { name: 'Tractor TN-05',   type: 'Tractor',    status: 'Active',      lat: 11.66, lng: 78.15, runtimeHours: 320,  city: 'Salem' },
      ];
      await Machine.bulkCreate(initialMachines);
      console.log('Fallback: seeded initial TN machines. Run node seed.js for full 32-machine dataset.');
    }
  } catch (err) {
    console.error('Simulation error:', err.message);
  }
}, 8000);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
