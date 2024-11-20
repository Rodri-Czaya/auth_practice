const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create a persistent SQLite database
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('Database connection error:', err.message);
  else console.log('Connected to SQLite database.');
});

// Initialize the User table
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      isAdmin BOOLEAN DEFAULT 0,
      loginAttempts INTEGER DEFAULT 0,
      isLocked BOOLEAN DEFAULT 0
    )
  `, (err) => {
    if (err) console.error('Error creating users table:', err.message);
    else console.log('Users table initialized.');
  });
});

module.exports = db;
