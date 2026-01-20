const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: 'teams_platform',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
});

async function test() {
  try {
    const client = await pool.connect();
    console.log('Successfully connected to PostgreSQL');
    
    const res = await client.query("SELECT datname FROM pg_database WHERE datname = 'teams_platform'");
    if (res.rows.length === 0) {
      console.log("Database 'teams_platform' does NOT exist.");
    } else {
      console.log("Database 'teams_platform' exists.");
    }
    
    client.release();
  } catch (err) {
    console.error('Connection error:', err.message);
  } finally {
    process.exit();
  }
}

test();
