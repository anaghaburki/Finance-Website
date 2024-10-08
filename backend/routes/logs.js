const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Get all financial logs (last 4 logs by default)
router.get('/logs', (req, res) => {
  db.all('SELECT * FROM logs ORDER BY id DESC LIMIT 4', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ logs: rows });
  });
});

// Add a new financial log (income or expense)
router.post('/logs', (req, res) => {
  const { description, amount } = req.body;

  if (!description || amount === undefined) {
    return res.status(400).json({ error: 'Description and amount are required' });
  }

  db.run(
    'INSERT INTO logs (description, amount) VALUES (?, ?)',
    [description, amount],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, description, amount });
    }
  );
});

// Reset logs (delete all logs)
router.delete('/logs', (req, res) => {
  db.run('DELETE FROM logs', [], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: 'All logs have been reset' });
  });
});

module.exports = router;
