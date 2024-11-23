const express = require('express');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const csrf = require('csurf'); 
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// These are our middlewares
app.use(cookieParser()); 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Configure CSRF
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

// Configure session middleware
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'supersecretkey',
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false,
            maxAge: 3600000
        }
    })
);

// Routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);

// Home route
app.get('/', (req, res) => {
    res.send('Welcome to the Very Very Simple Auth App!');
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});