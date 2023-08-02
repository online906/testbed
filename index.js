const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let employees = [];

// Main screen to display in/out status and allow login/logout
app.get('/', (req, res) => {
  res.send(`
    <h1>Employee Tracking App</h1>
    <form action="/login" method="POST">
      <input type="text" name="name" placeholder="Enter your name" required />
      <button type="submit">Log In/Out</button>
    </form>
    <h2>Employee Status</h2>
    <ul>
      ${employees.map(employee => `<li>${employee.name}: ${employee.status}</li>`).join('')}
    </ul>
  `);
});

// Login/Logout route
app.post('/login', (req, res) => {
  const { name } = req.body;
  const existingEmployee = employees.find(employee => employee.name === name);
  if (existingEmployee) {
    existingEmployee.status = existingEmployee.status === 'In' ? 'Out' : 'In';
  } else {
    employees.push({ name, status: 'In' });
  }
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
