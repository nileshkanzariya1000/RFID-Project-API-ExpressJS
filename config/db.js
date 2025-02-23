// config/db.js
const { Client } = require('pg');

// Database configuration
const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'Nileshk1214@',  // Note: sensitive info should not be hardcoded in production
  database: 'RFID',
});

// Connect to PostgreSQL
client.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('Connection error', err.stack));

module.exports = client;
