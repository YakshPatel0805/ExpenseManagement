// routes section
const express = require("express");
const path = require("path");
const router = express.Router();
const User = require('../models/User')
const bcrypt = require("bcrypt");
const { body, validationResult } = require('express-validator');

// ================= password ckecker =====================
function isStrong(password) {
  const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
  return strongRegex.test(password);
}

// middleware
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    next(); // user is logged in
  } else {
    res.redirect("/login");
  }
}


// ================ Get Routes ====================
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/views/index.html"));
});

router.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/views/login.html"));
});

router.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/views/signup.html"));
});

router.get("/dashboard", isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/views/dashboard.html"));
});

router.get("/expense", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/views/expense.html"));
})

// ================ Post Routes ====================
// Signup with validation
router.post("/signup", [
  body('name').trim().isLength({ min: 2, max: 50 }).escape(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ success: false, message: "Invalid input data" });
    }

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: "All fields are required" });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.json({ success: false, message: "Invalid email format" });
    }

    if (!isStrong(password)) {
      return res.json({
        success: false,
        message:
          "Password must be at least 8 characters and include uppercase, lowercase, number and special character"
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();

    res.json({ success: true, message: "Account created successfully" });

  } catch (err) {
    console.error('Signup error:', err);
    res.json({ success: false, message: "Server error" });
  }
});

// Login with validation
router.post("/login", [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ success: false, message: "Invalid input data" });
    }

    const { email, password, remember } = req.body;

    if (!email || !password) {
      return res.json({ success: false, message: "All fields are required" });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.json({ success: false, message: "Invalid email format" });
    }

    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    req.session.user = {
      id: foundUser._id,
      name: foundUser.name,
      email: foundUser.email
    };

    if (remember) {
      req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7; // 7 days
    } else {
      req.session.cookie.expires = false;
    }

    res.json({
      success: true,
      message: "Login successful",
    });

  } catch (err) {
    console.error('Login error:', err);
    res.json({ success: false, message: "Server error" });
  }
});

// Logout
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});


module.exports = router;
