const express = require('express')
const path = require('path')
const UserRoutes = require('./backend/routes/userRoutes')
const ExpenseRoutes = require('./backend/routes/expenseRoutes')
const WalletRoutes = require('./backend/routes/walletRoutes')
const TransactionRoutes = require('./backend/routes/transactionRoutes')
const IncomeRoutes = require('./backend/routes/incomeRoutes')
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

// Serve static files from React build
app.use(express.static(path.join(__dirname, 'frontend/build')))

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

// API routes
app.use('/', UserRoutes)
app.use('/', ExpenseRoutes)
app.use('/', WalletRoutes)
app.use('/', TransactionRoutes)
app.use('/', IncomeRoutes)

// Serve React app for all other routes (SPA behavior)
app.use((req, res, next) => {
  // Skip API routes
  if (req.path.startsWith('/api') || req.path.startsWith('/login') || req.path.startsWith('/signup') || req.path.startsWith('/logout')) {
    return next();
  }
  // Serve React app for all other routes
  res.sendFile(path.join(__dirname, 'frontend/build/index.html'));
});

app.listen(3000, ()=> console.log('Server Started on http://localhost:3000'))