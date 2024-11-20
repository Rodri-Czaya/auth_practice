const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
// (We'll create these files later)
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);

// Home route
app.get('/', (req, res) => {
  res.send('Welcome to the Simple Auth App!');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
