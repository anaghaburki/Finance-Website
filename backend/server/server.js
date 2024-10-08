const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Create a new SQLite database or open an existing one
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Error opening database ' + err.message);
    } else {
        console.log('Connected to SQLite database');

        // Create tables
        db.run(`CREATE TABLE IF NOT EXISTS records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT NOT NULL,
            amount REAL NOT NULL,
            date TEXT NOT NULL
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS savings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            goal TEXT NOT NULL,
            savedAmount REAL NOT NULL,
            targetAmount REAL NOT NULL
        )`);

        // Create logs table
        db.run(`CREATE TABLE IF NOT EXISTS logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            description TEXT NOT NULL,
            amount REAL NOT NULL
        )`, (err) => {
            if (err) {
                console.error('Could not create logs table:', err.message);
            } else {
                console.log('Logs table created successfully.');
            }
        });
    }
});

const validateRecordData = (req, res, next) => {
    const { type, amount, date } = req.body;
    if (!type || typeof amount !== 'number' || !date) {
        return res.status(400).json({ error: 'Invalid input data' });
    }
    next();
};

const validateSavingsData = (req, res, next) => {
    const { goal, savedAmount, targetAmount } = req.body;
    if (!goal || typeof savedAmount !== 'number' || typeof targetAmount !== 'number') {
        return res.status(400).json({ error: 'Invalid input data' });
    }
    next();
};

// API endpoints
app.post('/api/records', validateRecordData, (req, res) => {
    const { type, amount, date } = req.body;
    db.run(`INSERT INTO records (type, amount, date) VALUES (?, ?, ?)`, [type, amount, date], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID });
    });
});

app.get('/api/records', (req, res) => {
    db.all(`SELECT * FROM records`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.post('/api/savings', validateSavingsData, (req, res) => {
    const { goal, savedAmount, targetAmount } = req.body;
    db.run(`INSERT INTO savings (goal, savedAmount, targetAmount) VALUES (?, ?, ?)`, [goal, savedAmount, targetAmount], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID });
    });
});

app.get('/api/savings', (req, res) => {
    db.all(`SELECT * FROM savings`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Get balance
app.get('/balance', (req, res) => {
    db.get('SELECT SUM(amount) AS balance FROM records', [], (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ balance: row.balance || 0 });
    });
});

// Get last 4 logs
app.get('/logs', (req, res) => {
    db.all('SELECT description, amount FROM logs ORDER BY id DESC LIMIT 4', [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Get latest savings goal
app.get('/latest-savings', (req, res) => {
    db.get('SELECT goal, savedAmount FROM savings ORDER BY id DESC LIMIT 1', [], (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        const goalAmount = row ? row.goal : 0;
        const savedAmount = row ? row.savedAmount : 0;
        const percentage = goalAmount > 0 ? (savedAmount / goalAmount) * 100 : 0;
        res.json({
            goalAmount,
            savedAmount,
            percentage: percentage.toFixed(2),
        });
    });
});

// Reset data
app.delete('/reset-data', (req, res) => {
    db.run('DELETE FROM records', [], (err) => {
        if (err) {
            res.status(500).json({ error: 'Failed to delete records' });
            return;
        }
    });
    db.run('DELETE FROM savings', [], (err) => {
        if (err) {
            res.status(500).json({ error: 'Failed to delete savings' });
            return;
        }
    });
    db.run('DELETE FROM logs', [], (err) => {
        if (err) {
            res.status(500).json({ error: 'Failed to delete logs' });
            return;
        }
        res.status(200).json({ message: 'All data cleared successfully' });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database: ' + err.message);
        }
        console.log('Database closed. Server shutting down...');
        process.exit(0);
    });
});
