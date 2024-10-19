// src/config/db.js
const { Pool } = require('pg'); // Import the Pool class from pg

const pool = new Pool({
    user: 'postgres',               // User should be a string
    host: 'localhost',              // Host should be a string
    database: 'expenses-sharing-app', // Database name should be a string
    password: 'host',               // Password should be a string
    port: 5432,                     // Port number (integer, no quotes needed)
});

module.exports = pool;

// Note: You can also use a DATABASE_URL as shown below, 
// but this requires using `pg`'s connection string format
// const pool = new Pool({ connectionString: process.env.DATABASE_URL });
