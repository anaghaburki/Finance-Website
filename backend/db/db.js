const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create a new database or open an existing one
const db = new sqlite3.Database(path.join(__dirname, 'finance.db'), (err) => {
  if (err) {
    console.error('Could not connect to the database:', err);
  } else {
    console.log('Connected to the SQLite database.');
    createTables();
  }
});

// Function to create tables
const createTables = () => {
  const createLogsTable = `
    CREATE TABLE IF NOT EXISTS logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      description TEXT NOT NULL,
      amount REAL NOT NULL
    );
  `;

  db.run(createLogsTable, (err) => {
    if (err) {
      console.error('Could not create logs table:', err);
    } else {
      console.log('Logs table created successfully.');
    }
  });
};

// Export the database instance
module.exports = db;
