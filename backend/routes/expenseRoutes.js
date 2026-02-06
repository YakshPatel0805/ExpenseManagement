const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Expense = require('../models/Expense');
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

// GET /api/expenses - Get all expenses for user
router.get('/api/expenses', isAuthenticated, async (req, res) => {
  try {
    const { page = 1, limit = 10, category, startDate, endDate } = req.query;
    const userId = new mongoose.Types.ObjectId(req.session.user.id);

    // Build query
    const query = { userId };
    if (category && category !== 'all') {
      query.category = category;
    }
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const expenses = await Expense.find(query)
      .populate('walletId', 'name type')
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Expense.countDocuments(query);

    res.json({
      success: true,
      expenses,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/expenses/summary - Get expense summary by category
router.get('/api/expenses/summary', isAuthenticated, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const userId = new mongoose.Types.ObjectId(req.session.user.id);

    console.log('Fetching expense summary for user:', userId);
    console.log('Date range:', startDate, 'to', endDate);

    const matchQuery = { userId };
    if (startDate || endDate) {
      matchQuery.date = {};
      if (startDate) matchQuery.date.$gte = new Date(startDate);
      if (endDate) matchQuery.date.$lte = new Date(endDate);
    }

    console.log('Match query:', matchQuery);

    const summary = await Expense.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } }
    ]);

    console.log('Expense summary result:', summary);

    const totalSpent = summary.reduce((sum, item) => sum + item.total, 0);

    console.log('Total spent:', totalSpent);

    res.json({
      success: true,
      summary,
      totalSpent
    });
  } catch (error) {
    console.error('Get expense summary error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/expenses - Create new expense
router.post('/api/expenses', [
  body('title').trim().isLength({ min: 1, max: 100 }),
  body('amount').isFloat({ min: 0.01 }),
  body('category').isIn(['food', 'shopping', 'housing', 'transportation', 'entertainment', 'healthcare', 'utilities', 'other']),
  body('walletId').isMongoId(),
  body('description').optional().trim().isLength({ max: 500 }),
  body('date').optional().isISO8601()
], isAuthenticated, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Invalid input data', errors: errors.array() });
    }

    const { title, amount, category, walletId, description, date, tags } = req.body;
    const userId = new mongoose.Types.ObjectId(req.session.user.id);

    console.log('Creating expense:', { title, amount, category, walletId, userId });

    // Verify wallet belongs to user
    const wallet = await Wallet.findOne({ _id: walletId, userId });
    if (!wallet) {
      return res.status(404).json({ success: false, message: 'Wallet not found' });
    }

    // Check if wallet has sufficient balance (for non-credit cards)
    if (wallet.type !== 'credit_card' && wallet.balance < amount) {
      return res.status(400).json({ success: false, message: 'Insufficient balance' });
    }

    // Create expense
    const expense = new Expense({
      userId,
      title,
      amount,
      category,
      walletId,
      description,
      date: date ? new Date(date) : new Date(),
      tags: tags || []
    });

    await expense.save();

    // Update wallet balance
    if (wallet.type === 'credit_card') {
      wallet.balance -= amount; // Credit cards can go negative
    } else {
      wallet.balance -= amount;
    }
    await wallet.save();

    // Create transaction record
    const transaction = new Transaction({
      userId,
      type: 'expense',
      amount,
      description: title,
      category,
      fromWalletId: walletId,
      date: expense.date,
      expenseId: expense._id
    });

    await transaction.save();

    // Populate wallet info for response
    await expense.populate('walletId', 'name type');

    res.status(201).json({
      success: true,
      message: 'Expense created successfully',
      expense
    });
  } catch (error) {
    console.error('Create expense error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PUT /api/expenses/:id - Update expense
router.put('/api/expenses/:id', [
  body('title').optional().trim().isLength({ min: 1, max: 100 }),
  body('amount').optional().isFloat({ min: 0.01 }),
  body('category').optional().isIn(['food', 'shopping', 'housing', 'transportation', 'entertainment', 'healthcare', 'utilities', 'other']),
  body('description').optional().trim().isLength({ max: 500 }),
  body('date').optional().isISO8601()
], isAuthenticated, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Invalid input data', errors: errors.array() });
    }

    const { id } = req.params;
    const userId = req.session.user.id;
    const updates = req.body;

    const expense = await Expense.findOne({ _id: id, userId });
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    // If amount is being updated, adjust wallet balance
    if (updates.amount && updates.amount !== expense.amount) {
      const wallet = await Wallet.findById(expense.walletId);
      const difference = updates.amount - expense.amount;
      wallet.balance -= difference;
      await wallet.save();

      // Update related transaction
      await Transaction.findOneAndUpdate(
        { expenseId: expense._id },
        { amount: updates.amount }
      );
    }

    Object.assign(expense, updates);
    await expense.save();

    await expense.populate('walletId', 'name type');

    res.json({
      success: true,
      message: 'Expense updated successfully',
      expense
    });
  } catch (error) {
    console.error('Update expense error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE /api/expenses/:id - Delete expense
router.delete('/api/expenses/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.session.user.id;

    const expense = await Expense.findOne({ _id: id, userId });
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    // Restore wallet balance
    const wallet = await Wallet.findById(expense.walletId);
    wallet.balance += expense.amount;
    await wallet.save();

    // Delete related transaction
    await Transaction.findOneAndDelete({ expenseId: expense._id });

    // Delete expense
    await Expense.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Expense deleted successfully'
    });
  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/expenses/bulk - Bulk import expenses from CSV
router.post('/api/expenses/bulk', isAuthenticated, async (req, res) => {
  try {
    const { transactions } = req.body;
    const userId = new mongoose.Types.ObjectId(req.session.user.id);

    if (!transactions || !Array.isArray(transactions) || transactions.length === 0) {
      return res.status(400).json({ success: false, message: 'No transactions provided' });
    }

    console.log(`Bulk importing ${transactions.length} expenses for user:`, userId);

    let successCount = 0;
    let failedCount = 0;
    const errors = [];

    for (const txn of transactions) {
      try {
        // Verify wallet belongs to user
        const wallet = await Wallet.findOne({ _id: txn.walletId, userId });
        if (!wallet) {
          errors.push({ transaction: txn, error: 'Wallet not found' });
          failedCount++;
          continue;
        }

        // Create expense
        const expense = new Expense({
          userId,
          title: txn.title || 'Imported Transaction',
          amount: parseFloat(txn.amount),
          category: txn.category || 'other',
          walletId: txn.walletId,
          description: txn.description || '',
          date: txn.date ? new Date(txn.date) : new Date(),
          tags: txn.tags || []
        });

        await expense.save();

        // Update wallet balance
        wallet.balance -= expense.amount;
        await wallet.save();

        // Create transaction record
        const transaction = new Transaction({
          userId,
          type: 'expense',
          amount: expense.amount,
          description: expense.title,
          category: expense.category,
          fromWalletId: txn.walletId,
          date: expense.date,
          expenseId: expense._id
        });

        await transaction.save();
        successCount++;
      } catch (error) {
        console.error('Error importing transaction:', error);
        errors.push({ transaction: txn, error: error.message });
        failedCount++;
      }
    }

    res.json({
      success: true,
      message: `Imported ${successCount} expenses successfully`,
      count: successCount,
      failed: failedCount,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Bulk import error:', error);
    res.status(500).json({ success: false, message: 'Server error during bulk import' });
  }
});

module.exports = router;