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
    res.status(401).json({ message: 'Authentication required' });
  }
}

// ================ API Routes ====================
// Auth status check
router.get("/api/auth/status", (req, res) => {
  if (req.session.user) {
    res.json({ 
      name: req.session.user.name, 
      email: req.session.user.email 
    });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

// Update profile
router.put("/api/profile", [
  body('name').trim().isLength({ min: 2, max: 50 }).escape(),
  body('email').isEmail().normalizeEmail()
], isAuthenticated, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ success: false, message: "Invalid input data" });
    }

    const { name, email } = req.body;
    const userId = req.session.user.id;

    // Check if email is already taken by another user
    const existingUser = await User.findOne({ email, _id: { $ne: userId } });
    if (existingUser) {
      return res.json({ success: false, message: "Email already in use" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true }
    ).select('-password');

    // Update session
    req.session.user.name = updatedUser.name;
    req.session.user.email = updatedUser.email;

    res.json({ success: true, message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error('Update profile error:', error);
    res.json({ success: false, message: "Server error" });
  }
});

// Change password
router.put("/api/change-password", [
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 8 })
], isAuthenticated, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ success: false, message: "Invalid input data" });
    }

    const { currentPassword, newPassword } = req.body;
    const userId = req.session.user.id;

    // Get user with password
    const user = await User.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Current password is incorrect" });
    }

    // Check new password strength
    if (!isStrong(newPassword)) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters and include uppercase, lowercase, number and special character"
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await User.findByIdAndUpdate(userId, { password: hashedPassword });

    res.json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.error('Change password error:', error);
    res.json({ success: false, message: "Server error" });
  }
});

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

// Delete account - permanently delete user and all associated data
router.delete("/api/account", isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.user.id;
    const mongoose = require('mongoose');
    const userObjectId = new mongoose.Types.ObjectId(userId);

    console.log('Deleting account for user:', userId);

    // Import all models
    const Expense = require('../models/Expense');
    const Income = require('../models/Income');
    const Wallet = require('../models/Wallet');
    const Transaction = require('../models/Transaction');
    const Budget = require('../models/Budget');

    // Delete all user data in parallel
    const deleteResults = await Promise.allSettled([
      Expense.deleteMany({ userId: userObjectId }),
      Income.deleteMany({ userId: userObjectId }),
      Wallet.deleteMany({ userId: userObjectId }),
      Transaction.deleteMany({ userId: userObjectId }),
      Budget.deleteMany({ userId: userObjectId }).catch(() => null), // Budget model might not exist
      User.findByIdAndDelete(userId)
    ]);

    console.log('Delete results:', deleteResults.map(r => r.status));

    // Count successful deletions
    const successCount = deleteResults.filter(r => r.status === 'fulfilled').length;

    // Destroy session
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destroy error:', err);
      }
    });

    res.json({
      success: true,
      message: "Account and all associated data deleted successfully",
      deletedItems: successCount
    });

  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: "Error deleting account. Please try again."
    });
  }
});


module.exports = router;
