const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models/db');

const register = (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).send('Email and password are required.');
  }

  // Hash the password
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.status(500).send('Error hashing the password.');

    // Insert the user into the database
    const query = `INSERT INTO users (email, password) VALUES (?, ?)`;
    db.run(query, [email, hashedPassword], (err) => {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(400).send('Email already in use.');
        }
        return res.status(500).send('Error registering user.');
      }
      res.redirect('/auth/login');
    });
  });
};

module.exports = { register };
