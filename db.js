const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config({ path: '.env' });

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL + "?sslmode=require",
});

const initializeDatabase = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS employees (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE,
        name TEXT,
        pin TEXT,
        status TEXT
      )
    `);
    console.log('Database initialized');
  } catch (err) {
    console.error('Error initializing database:', err);
  }
};

module.exports = {
  pool,
  initializeDatabase,
};
