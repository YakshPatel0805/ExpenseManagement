const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Income = require('../models/Income');
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const { body, validationResult } = require('express-validator');

// Middleware to check authentication
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({ message: 'Authentication required' });
  }
}

// GET /api/income - Get all income for user
router.get('/api/income', isAuthenticated, async (req, res) => {
  try {
    const { page = 1, limit = 10, startDate, endDate } = req.query;
    const userId = new mongoose.Types.ObjectId(req.session.user.id);

    const query = { userId };
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const income = await Income.find(query)
      .populate('walletId', 'name type')
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Income.countDocuments(query);

    res.json({
      success: true,
      income,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    console.error('Get income error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/income/summary - Get income summary
router.get('/api/income/summary', isAuthenticated, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const userId = new mongoose.Types.ObjectId(req.session.user.id);

    const matchQuery = { userId };
    if (startDate || endDate) {
      matchQuery.date = {};
      if (startDate) matchQuery.date.$gte = new Date(startDate);
      if (endDate) matchQuery.date.$lte = new Date(endDate);
    }

    const summary = await Income.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          totalIncome: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    const result = summary[0] || { totalIncome: 0, count: 0 };

    res.json({
      success: true,
      totalIncome: result.totalIncome,
      count: result.count
    });
  } catch (error) {
    console.error('Get income summary error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/income - Create new income
router.post('/api/income', [
  body('title').trim().isLength({ min: 1, max: 100 }),
  body('amount').isFloat({ min: 0.01 }),
  body('walletId').isMongoId(),
  body('description').optional().trim().isLength({ max: 500 }),
  body('date').optional().isISO8601()
], isAuthenticated, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Invalid input data', errors: errors.array() });
    }

    const { title, amount, walletId, description, date } = req.body;
    const userId = new mongoose.Types.ObjectId(req.session.user.id);

    // Verify wallet belongs to user
    const wallet = await Wallet.findOne({ _id: walletId, userId });
    if (!wallet) {
      return res.status(404).json({ success: false, message: 'Wallet not found' });
    }

    // Create income
    const income = new Income({
      userId,
      title,
      amount,
      walletId,
      description,
      date: date ? new Date(date) : new Date()
    });

    await income.save();

    // Update wallet balance
    wallet.balance += amount;
    await wallet.save();

    // Create transaction record
    const transaction = new Transaction({
      userId,
      type: 'income',
      amount,
      description: title,
      toWalletId: walletId,
      date: income.date
    });

    await transaction.save();

    // Populate wallet info for response
    await income.populate('walletId', 'name type');

    res.status(201).json({
      success: true,
      message: 'Income added successfully',
      income
    });
  } catch (error) {
    console.error('Create income error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE /api/income/:id - Delete income
router.delete('/api/income/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = new mongoose.Types.ObjectId(req.session.user.id);

    const income = await Income.findOne({ _id: id, userId });
    if (!income) {
      return res.status(404).json({ success: false, message: 'Income not found' });
    }

    // Restore wallet balance
    const wallet = await Wallet.findById(income.walletId);
    wallet.balance -= income.amount;
    await wallet.save();

    // Delete related transaction
    await Transaction.findOneAndDelete({ _id: income.transactionId });

    // Delete income
    await Income.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Income deleted successfully'
    });
  } catch (error) {
    console.error('Delete income error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
