const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'ndaje-backend' });
});

app.post('/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: 'email and password are required' });
  }
  // Demo stub: always succeeds
  const user = { id: 'u_1', email, role: 'admin' };
  return res.json({ user, token: 'fake-token' });
});

app.post('/auth/signup', (req, res) => {
  const payload = req.body || {};
  if (!payload.email || !payload.password) {
    return res.status(400).json({ message: 'email and password are required' });
  }
  // Demo stub: echo user
  const user = { id: 'u_2', email: payload.email, role: payload.role || 'client' };
  return res.status(201).json({ user, token: 'fake-token' });
});

// Basic error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`ndaje-backend listening on http://localhost:${port}`);
});
