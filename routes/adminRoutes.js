const express = require('express');
const router = express.Router();
const db = require('../models/db');

// Middleware to check if user is an admin
const isAdmin = (req, res, next) => {
  // Placeholder: Replace this with real authentication logic later
  const user = req.session?.user; // Assuming session holds logged-in user info
  if (user && user.isAdmin) {
    return next();
  }
  return res.status(403).send('Access denied: Admins only.');
};

// Admin dashboard
router.get('/dashboard', isAdmin, (req, res) => {
  // Placeholder dashboard view
  db.all(`SELECT id, email, isAdmin FROM users`, [], (err, rows) => {
    if (err) {
      return res.status(500).send('Error fetching users.');
    }
    res.render('adminView', { users: rows });
  });
});

module.exports = router;
