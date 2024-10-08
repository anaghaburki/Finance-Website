
const express = require('express');
const router = express.Router();
const db = require('../db/db');

router.delete('/reset-data', (req, res) => {
  db.run('DELETE FROM logs', [], (err) => {
    if (err) return res.status(500).json({ error: err.message });
  });
  db.run('DELETE FROM savings', [], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: 'Data reset successfully.' });
  });
});

module.exports = router;