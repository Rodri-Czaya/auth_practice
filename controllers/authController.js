const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models/db');

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const register = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Mail and password are required');
  }

  if (!validateEmail(email)) {
    return res.status(400).send('Mail not valid');
  }

  if (password.length < 8) {
    return res.status(400).send('Password must be at least 8 characters long');
  }

  // Escapar entradas para prevenir inyecciones SQL
  const sanitizedEmail = email.replace(/'/g, "''");

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).send('Error registering user.');

    const query = `INSERT INTO users (email, password) VALUES (?, ?)`;
    db.run(query, [sanitizedEmail, hash], (err) => {
      if (err) return res.status(500).send('Error creating account.');
      res.redirect('/auth/login');
    });
  });
};

// Login function
const login = (req, res) => {
  const { email, password, loginType } = req.body;

  if (!email || !password || !loginType) {
    return res.status(400).send('Email, password, and login type are required.');
  }

  const query = `SELECT * FROM users WHERE email = ?`;
  db.get(query, [email], (err, user) => {
    if (err) return res.status(500).send('Error fetching user.');
    if (!user) return res.status(404).send('User not found.');

    const now = Math.floor(Date.now() / 1000);

    // Check if the account is locked
    if (user.lockedUntil && now < user.lockedUntil) {
      const remainingTime = Math.ceil((user.lockedUntil - now) / 60);
      return res
        .status(403)
        .send(`Account is locked. Try again in ${remainingTime} minutes.`);
    }

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).send('Error validating password.');

      if (!isMatch) {
        const attempts = user.loginAttempts + 1;
        const isLocked = attempts >= 3;
        const lockedUntil = isLocked ? now + 2 * 60 : null; // Lock for 2 minutes

        db.run(
          `UPDATE users SET loginAttempts = ?, isLocked = ?, lockedUntil = ? WHERE email = ?`,
          [attempts, isLocked, lockedUntil, email],
          (updateErr) => {
            if (updateErr) return res.status(500).send('Error updating login attempts.');
            if (isLocked) {
              return res.status(403).send(
                'Account locked due to too many failed attempts. Try again in 2 minutes.'
              );
            }
            return res.status(401).send('Invalid password.');
          }
        );
        return;
      }

      // Reset login attempts and unlock account on successful login
      db.run(
        `UPDATE users SET loginAttempts = 0, isLocked = 0, lockedUntil = NULL WHERE email = ?`,
        [email]
      );

      if (loginType === 'session') {
        req.session.user = { id: user.id, email: user.email, isAdmin: user.isAdmin };
        return res.redirect(user.isAdmin ? '/admin/dashboard' : '/auth/user');
      } else if (loginType === 'jwt') {
        const token = jwt.sign(
          { id: user.id, email: user.email, isAdmin: user.isAdmin },
          process.env.JWT_SECRET || 'secret_key',
          { expiresIn: '1h' }
        );
        return res.json({ token });
      } else {
        return res.status(400).send('Invalid login type.');
      }
    });
  });
};


module.exports = { register, login };
