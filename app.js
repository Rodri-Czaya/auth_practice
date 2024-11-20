const express = require('express');
const path = require('path');
const session = require('express-session');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Configure session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'supersecretkey', // Use a strong secret in production
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true, // Prevents client-side JS from accessing the cookie
      secure: false,  // Set to true if using HTTPS
      maxAge: 3600000 // 1 hour
    }
  })
);

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
