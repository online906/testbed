const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const { db, initializeDatabase } = require('./db');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

initializeDatabase()
  .then(() => {
    app.get('/', (req, res) => {
      res.sendFile(__dirname + '/index.html');
    });

    app.get('/get-employees', (req, res) => {
      db.all('SELECT * FROM employees', (err, rows) => {
        if (err) {
          console.error('Error fetching employees:', err);
          res.json([]);
        } else {
          res.json(rows);
        }
      });
    });

    app.post('/login', (req, res) => {
      const { username, pin } = req.body;

      db.get('SELECT * FROM employees WHERE username = ?', [username], (err, row) => {
        if (err) {
          console.error('Error fetching employee:', err);
          res.json({ error: 'Error fetching employee' });
        } else if (!row) {
          res.json({ error: `Employee with username "${username}" not found.` });
        } else if (row.pin !== pin) {
          res.json({ error: `Invalid PIN for "${row.name}". Please try again.` });
        } else {
          const newStatus = row.status === 'In' ? 'Out' : 'In';
          db.run('UPDATE employees SET status = ? WHERE id = ?', [newStatus, row.id], (err) => {
            if (err) {
              console.error('Error updating status:', err);
              res.json({ error: 'Error updating status' });
            } else {
              res.json({ success: true });
            }
          });
        }
      });
    });

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error initializing database:', err);
  });
