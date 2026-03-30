# Agri CRM: Machine Tracking System

A full-stack premium agricultural SaaS platform for managing, monitoring, and tracking farm machinery via real-time telemetry.

Built with the **MERN Stack** (MongoDB, Express, React, Node.js) featuring completely robust mapping utilizing **Socket.io** and **React-Leaflet**.

## Application Features

- **JWT Authentication**: Full Registration, Login, and AuthContext-based protected routing based on user profiles (Admin/Employee).
- **Fleet Dashboard**: Interactive `recharts` graphs (Bar/Pie) showcasing aggregated statuses across the complete farm.
- **Machine Grid Management**: Advanced grid system tracking IDs, status types, models, operating runtimes, and location tracking.
- **Live Real-time Telemetry**: Active background loop pushing WebSocket broadcasts (`socket.io`) simulating shifting coordinates and shifting operation statuses. 
  - **Animated Activity Logging**: Real-time event populator that logs status changes and formats connection metrics with `date-fns`.
- **Location Map Tracking**: `react-leaflet`-powered OpenStreetMap views integrating custom color-coded HTML DivIcon markers. Simulates active location changes instantly shifting on screen with "animated radar" CSS blips.
- **SaaS First Premium UI**: Tailor-made 'Agro-Green' color system merged seamlessly with Lucide-React icons and intricate drop shadows matching enterprise-level standards. Fully mobile responsive layouts.

## Project Structure

```bash
/CRM Tracking
├── backend/ # Node + Express + Mongoose + Socket.io Server
│   ├── models/           # Mongoose DB Schemas (Machine.js, User.js, etc.)
│   ├── routes/           # RESTful API Endpoints (auth.js, machines.js, stats.js)
│   ├── package.json      # Backend dependencies
│   └── server.js         # Core Express app, IO simulator loop, & MongoDB connection
│
└── frontend/ # React (Create React App) + Tailwind CSS
    ├── public/
    ├── src/
    │   ├── components/
    │   │   └── layout/   # Responsively dynamic Sidebar, Top Navbar, & Global Layout
    │   ├── context/      # AuthContext to handle live Global User state and Session Tokens
    │   ├── pages/        # Dashboard, Login, Machines, MachineMonitoring, Maintenance, Register, Tracking
    │   ├── App.jsx       # Routing Provider & Core View Definitions
    │   ├── index.css     # Global Styles incl. Tailwind Setup & Map tweaks
    │   └── index.js      # App mount point
    ├── tailwind.config.js # Themed customizations
    └── package.json       # Frontend dependencies
```

## How to Run Locally

### Requirements
- **Node.js** Environment installed (v16+)
- **MongoDB** Local Instance humming at `mongodb://localhost:27017`

### 1. Run the Backend API & Socket Server
Open a terminal and navigate to the backend folder:
```bash
cd backend
npm install
node server.js
```
*The simulated socket events and `crm_machine_tracking` DB initial seed happens instantly on initial boot.* The server will run on `http://localhost:5000`.

### 2. Run the React Web Application
Open a new terminal and navigate to the frontend folder:
```bash
cd frontend
npm install
npm start
```
*Navigating to `http://localhost:3000` will redirect you into the Auth Guard. Register a new user, and log in to dive directly into the full live suite.*

---
*Developed 2026. Custom CRM Solutions Architecture.*
