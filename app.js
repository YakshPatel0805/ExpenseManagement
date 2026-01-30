const express = require('express')
const path = require('path')
const UserRoutes = require('./backend/routes/userRoutes')
const mongoose = require('mongoose')
const session = require("express-session");
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express()

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login attempts per windowMs
  message: 'Too many login attempts, please try again later.'
});

app.use(limiter);
app.use('/login', authLimiter);
app.use('/signup', authLimiter);

// Add JSON parser middleware
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'frontend')))

// Environment variable validation
if (!process.env.MONGO_URL) {
  console.error('ERROR: MONGO_URL environment variable is required');
  process.exit(1);
}

if (!process.env.SESSION_SECRET) {
  console.error('ERROR: SESSION_SECRET environment variable is required');
  process.exit(1);
}

// MongoDB Database Configuration
mongoose.connect(process.env.MONGO_URL)
    .then(()=> console.log('MongoDB Connected...'))
    .catch(err => {
      console.error('MongoDB connection error:', err);
      process.exit(1);
    })

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
      maxAge: 1000 * 60 * 30, // 30 minutes
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' // HTTPS only in production
    }
  })
);

// routes
app.use('/', UserRoutes)

app.listen(3000, ()=> console.log('Server Started on http://localhost:3000'))