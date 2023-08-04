const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const { pool, initializeDatabase } = require('./db');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

initializeDatabase()
  .then(() => {
    app.get('/', (req, res) => {
      res.sendFile(__dirname + '/index.html');
    });

    app.get('/get-employees', async (req, res) => {
      console.log('Fetching employees...');
      try {
        const result = await pool.query('SELECT * FROM employees');
        res.json(result.rows);
      } catch (err) {
        console.error('Error fetching employees:', err);
        res.json([]);
      }
    });

    app.post('/login', async (req, res) => {
      const { username, pin } = req.body;

      try {
        const result = await pool.query('SELECT * FROM employees WHERE username = $1', [username]);
        const row = result.rows[0];

        if (!row) {
          res.json({ error: `Employee with username "${username}" not found.` });
        } else if (row.pin !== pin) {
          res.json({ error: `Invalid PIN for "${row.name}". Please try again.` });
        } else {
          const newStatus = row.status === 'In' ? 'Out' : 'In';
          await pool.query('UPDATE employees SET status = $1 WHERE id = $2', [newStatus, row.id]);
          res.json({ success: true });
        }
      } catch (err) {
        console.error('Error updating status:', err);
        res.json({ error: 'Error updating status' });
      }
    });

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error initializing database:', err);
  });
