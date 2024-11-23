const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Render the registration form
router.get('/register', (req, res) => {
    res.render('register', { csrfToken: req.csrfToken() });
});

// Handle registration form submission
router.post('/register', authController.register);

// Render the login form
router.get('/login', (req, res) => {
    res.render('login', { csrfToken: req.csrfToken() });
});

// Handle login form submission
router.post('/login', authController.login);

// User View
router.get('/user', (req, res) => {
    const user = req.session?.user;
    if (!user) return res.status(401).send('Access denied.');
    res.render('userView', { user: user }); 
});

// Logout route
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

module.exports = router;