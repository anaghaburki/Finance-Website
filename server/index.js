

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


const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Error opening database ' + err.message);
    } else {
        
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


app.post('/api/records', validateRecordData, (req, res) => {
    const { type, amount, date } = req.body;
    db.run(`INSERT INTO records (type, amount, date) VALUES (?, ?, ?)`, [type, amount, date], function(err) {
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
    db.run(`INSERT INTO savings (goal, savedAmount, targetAmount) VALUES (?, ?, ?)`, [goal, savedAmount, targetAmount], function(err) {
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
