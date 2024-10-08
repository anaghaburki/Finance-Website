const express = require('express');
const router = express.Router();
const db = require('../db/db');

router.get('/savings', (req, res) => {
  db.all('SELECT * FROM savings', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ savings: rows });
  });
});

router.post('/savings', (req, res) => {
  const { goal, savedAmount } = req.body;
  db.run('INSERT INTO savings (goal, savedAmount) VALUES (?, ?)', [goal, savedAmount], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

module.exports = router;
