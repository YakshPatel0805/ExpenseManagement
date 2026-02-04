const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
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

// GET /api/transactions - Get all transactions for user
router.get('/api/transactions', isAuthenticated, async (req, res) => {
  try {
    const { page = 1, limit = 20, type, walletId, startDate, endDate } = req.query;
    const userId = req.session.user.id;

    // Build query
    const query = { userId };
    if (type && type !== 'all') {
      query.type = type;
    }
    if (walletId) {
      query.$or = [
        { fromWalletId: walletId },
        { toWalletId: walletId }
      ];
    }
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(query)
      .populate('fromWalletId', 'name type icon')
      .populate('toWalletId', 'name type icon')
      .populate('expenseId', 'title category')
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Transaction.countDocuments(query);

    res.json({
      success: true,
      transactions,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/transactions/recent - Get recent transactions
router.get('/api/transactions/recent', isAuthenticated, async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const userId = req.session.user.id;

    const transactions = await Transaction.find({ userId })
      .populate('fromWalletId', 'name type icon')
      .populate('toWalletId', 'name type icon')
      .populate('expenseId', 'title category')
      .sort({ date: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      transactions
    });
  } catch (error) {
    console.error('Get recent transactions error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/transactions/stats - Get transaction statistics
router.get('/api/transactions/stats', isAuthenticated, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const userId = new mongoose.Types.ObjectId(req.session.user.id);

    console.log('Fetching transaction stats for user:', userId);
    console.log('Date range:', startDate, 'to', endDate);

    const matchQuery = { userId };
    if (startDate || endDate) {
      matchQuery.date = {};
      if (startDate) matchQuery.date.$gte = new Date(startDate);
      if (endDate) matchQuery.date.$lte = new Date(endDate);
    }

    console.log('Transaction match query:', matchQuery);

    const stats = await Transaction.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    console.log('Transaction stats result:', stats);

    // Calculate totals
    const result = {
      totalExpenses: 0,
      totalIncome: 0,
      totalTransfers: 0,
      transactionCount: 0
    };

    stats.forEach(stat => {
      result.transactionCount += stat.count;
      switch (stat._id) {
        case 'expense':
          result.totalExpenses = stat.total;
          break;
        case 'income':
          result.totalIncome = stat.total;
          break;
        case 'transfer':
          result.totalTransfers = stat.total;
          break;
      }
    });

    result.netAmount = result.totalIncome - result.totalExpenses;

    console.log('Final transaction stats:', result);

    res.json({
      success: true,
      stats: result
    });
  } catch (error) {
    console.error('Get transaction stats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;