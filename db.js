// db.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./employees.db'); // Use a file path for persistent storage.

const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    db.run(`
      CREATE TABLE IF NOT EXISTS employees (
        id INTEGER PRIMARY KEY,
        username TEXT UNIQUE,
        name TEXT,
        pin TEXT,
        status TEXT
      )
    `, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

const closeDatabase = () => {
  db.close();
};

module.exports = {
  db,
  initializeDatabase,
  closeDatabase,
};
