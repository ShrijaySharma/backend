const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/orders');
const tableRoutes = require('./routes/tables');
const billRoutes = require('./routes/bills');
const reportRoutes = require('./routes/reports');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/reports', reportRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// WebSocket for real-time updates
const clients = new Set();

wss.on('connection', (ws, req) => {
  clients.add(ws);
  console.log('Client connected. Total clients:', clients.size);

  ws.on('close', () => {
    clients.delete(ws);
    console.log('Client disconnected. Total clients:', clients.size);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    clients.delete(ws);
  });

  // Send initial connection message
  ws.send(JSON.stringify({ type: 'CONNECTED', message: 'WebSocket connected' }));
});

// Broadcast function to send updates to all connected clients
function broadcast(data) {
  const message = JSON.stringify(data);
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// Make broadcast available to routes
app.locals.broadcast = broadcast;
app.locals.clients = clients;

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket server ready for connections`);
});

module.exports = { app, broadcast };

