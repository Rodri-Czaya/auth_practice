const express = require('express');
const router = express.Router();
const db = require('../models/db');
const jwt = require('jsonwebtoken');

// Middleware to check if user is an admin
const isAdmin = (req, res, next) => {
    // Session-based check
    if (req.session?.user?.isAdmin) {
        return next();
    }
    
    // JWT-based check
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET || 'secret_key', (err, decoded) => {
            if (err) {
                return res.status(403).send('Invalid or expired token.');
            }
            if (decoded.isAdmin) {
                return next();
            }
            return res.status(403).send('Access denied: Admins only.');
        });
        return;
    }
    return res.status(403).send('Access denied: Admins only.');
};

// Admin dashboard
router.get('/dashboard', isAdmin, (req, res) => {
    db.all(`SELECT id, email, isAdmin FROM users`, [], (err, rows) => {
        if (err) {
            return res.status(500).send('Error fetching users.');
        }
        res.render('adminView', { 
            users: rows,
            csrfToken: req.csrfToken()
        });
    });
});

// Route to update user role
router.post('/update-role', isAdmin, (req, res) => {
    const { id, isAdmin } = req.body;
    if (typeof id === 'undefined' || typeof isAdmin === 'undefined') {
        return res.status(400).send('User ID and role are required.');
    }

    const query = `UPDATE users SET isAdmin = ? WHERE id = ?`;
    db.run(query, [isAdmin, id], (err) => {
        if (err) return res.status(500).send('Error updating user role.');
        res.redirect('/admin/dashboard');
    });
});

module.exports = router;