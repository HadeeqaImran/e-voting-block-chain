const express = require('express');
const db = require('./connection'); // Assuming connection.js is in the same directory

const app = express();
const port = process.env.PORT || 8000; // Set your preferred port

// Sample endpoint to check database connection
app.get('/api/health', (req, res) => {
  db.all('SELECT 1', (err) => {
    if (err) {
      console.error('Database connection error:', err);
      res.status(500).json({ message: 'Database error' });
    } else {
      res.json({ message: 'Database connection successful!' });
    }
  });
});

app.listen(port, () => console.log(`Server listening on port ${port}`));
