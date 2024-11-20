const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Render the registration form
router.get('/register', (req, res) => {
  res.render('register');
});

// Handle registration form submission
router.post('/register', authController.register);

// Render the login form
router.get('/login', (req, res) => {
  res.render('login');
});

// Handle login form submission
router.post('/login', authController.login);

// Placeholder route for user dashboard
router.get('/user', (req, res) => {
  const user = req.session?.user;
  if (!user) return res.status(401).send('Access denied.');
  res.send(`<h1>Hello, ${user.email}!</h1>`);
});

module.exports = router;
