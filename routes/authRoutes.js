const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Render the registration form
router.get('/register', (req, res) => {
  res.render('register');
});

// Handle registration form submission
router.post('/register', authController.register);

module.exports = router;
