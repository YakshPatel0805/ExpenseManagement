const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
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

// GET /api/wallets - Get all wallets for user
router.get('/api/wallets', isAuthenticated, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.session.user.id);
    const wallets = await Wallet.find({ userId, isActive: true }).sort({ createdAt: -1 });

    res.json({
      success: true,
      wallets
    });
  } catch (error) {
    console.error('Get wallets error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/wallets/summary - Get wallet summary
router.get('/api/wallets/summary', isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.user.id;
    
    const summary = await Wallet.aggregate([
      { $match: { userId: userId, isActive: true } },
      {
        $group: {
          _id: null,
          totalBalance: { $sum: '$balance' },
          totalWallets: { $sum: 1 },
          walletsByType: {
            $push: {
              type: '$type',
              balance: '$balance',
              name: '$name'
            }
          }
        }
      }
    ]);

    const result = summary[0] || { totalBalance: 0, totalWallets: 0, walletsByType: [] };

    res.json({
      success: true,
      summary: result
    });
  } catch (error) {
    console.error('Get wallet summary error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/wallets - Create new wallet
router.post('/api/wallets', [
  body('name').trim().isLength({ min: 1, max: 50 }).withMessage('Name must be 1-50 characters'),
  body('type').isIn(['credit_card', 'debit_card', 'savings', 'checking', 'cash', 'investment', 'other']).withMessage('Invalid account type'),
  body('balance').optional().isNumeric().withMessage('Balance must be a number'),
  body('currency').optional().isLength({ min: 3, max: 3 }).withMessage('Currency must be 3 characters'),
  body('color').optional().matches(/^#[0-9A-F]{6}$/i).withMessage('Color must be a valid hex color'),
  body('creditLimit').optional().isNumeric().withMessage('Credit limit must be a number'),
  body('accountNumber').optional().trim().isLength({ max: 20 }).withMessage('Account number too long'),
  body('bankName').optional().trim().isLength({ max: 50 }).withMessage('Bank name too long')
], isAuthenticated, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid input data', 
        errors: errors.array() 
      });
    }

    const { name, type, balance, currency, color, icon, creditLimit, accountNumber, bankName } = req.body;
    const userId = new mongoose.Types.ObjectId(req.session.user.id);

    const wallet = new Wallet({
      userId,
      name,
      type,
      balance: parseFloat(balance) || 0,
      currency: currency || 'USD',
      color: color || '#3498db',
      icon: icon || getDefaultIcon(type),
      creditLimit: creditLimit ? parseFloat(creditLimit) : null,
      accountNumber,
      bankName
    });

    await wallet.save();

    res.status(201).json({
      success: true,
      message: 'Wallet created successfully',
      wallet
    });
  } catch (error) {
    console.error('Create wallet error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PUT /api/wallets/:id - Update wallet
router.put('/api/wallets/:id', [
  body('name').optional().trim().isLength({ min: 1, max: 50 }),
  body('balance').optional().isFloat(),
  body('color').optional().isHexColor(),
  body('creditLimit').optional().isFloat({ min: 0 }),
  body('bankName').optional().trim().isLength({ max: 50 })
], isAuthenticated, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Invalid input data', errors: errors.array() });
    }

    const { id } = req.params;
    const userId = req.session.user.id;
    const updates = req.body;

    const wallet = await Wallet.findOne({ _id: id, userId });
    if (!wallet) {
      return res.status(404).json({ success: false, message: 'Wallet not found' });
    }

    Object.assign(wallet, updates);
    await wallet.save();

    res.json({
      success: true,
      message: 'Wallet updated successfully',
      wallet
    });
  } catch (error) {
    console.error('Update wallet error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE /api/wallets/:id - Delete wallet (soft delete)
router.delete('/api/wallets/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.session.user.id;

    const wallet = await Wallet.findOne({ _id: id, userId });
    if (!wallet) {
      return res.status(404).json({ success: false, message: 'Wallet not found' });
    }

    // Check if wallet has any expenses
    const Expense = require('../models/Expense');
    const expenseCount = await Expense.countDocuments({ walletId: id });
    
    if (expenseCount > 0) {
      // Soft delete - just mark as inactive
      wallet.isActive = false;
      await wallet.save();
    } else {
      // Hard delete if no expenses
      await Wallet.findByIdAndDelete(id);
    }

    res.json({
      success: true,
      message: 'Wallet deleted successfully'
    });
  } catch (error) {
    console.error('Delete wallet error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/wallets/transfer - Transfer money between wallets
router.post('/api/wallets/transfer', [
  body('fromWalletId').isMongoId(),
  body('toWalletId').isMongoId(),
  body('amount').isFloat({ min: 0.01 }),
  body('description').optional().trim().isLength({ max: 200 })
], isAuthenticated, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Invalid input data', errors: errors.array() });
    }

    const { fromWalletId, toWalletId, amount, description } = req.body;
    const userId = req.session.user.id;

    if (fromWalletId === toWalletId) {
      return res.status(400).json({ success: false, message: 'Cannot transfer to the same wallet' });
    }

    // Verify both wallets belong to user
    const fromWallet = await Wallet.findOne({ _id: fromWalletId, userId, isActive: true });
    const toWallet = await Wallet.findOne({ _id: toWalletId, userId, isActive: true });

    if (!fromWallet || !toWallet) {
      return res.status(404).json({ success: false, message: 'Wallet not found' });
    }

    // Check sufficient balance (except for credit cards)
    if (fromWallet.type !== 'credit_card' && fromWallet.balance < amount) {
      return res.status(400).json({ success: false, message: 'Insufficient balance' });
    }

    // Perform transfer
    fromWallet.balance -= amount;
    toWallet.balance += amount;

    await fromWallet.save();
    await toWallet.save();

    // Create transaction record
    const transaction = new Transaction({
      userId,
      type: 'transfer',
      amount,
      description: description || `Transfer from ${fromWallet.name} to ${toWallet.name}`,
      fromWalletId,
      toWalletId
    });

    await transaction.save();

    res.json({
      success: true,
      message: 'Transfer completed successfully',
      transaction
    });
  } catch (error) {
    console.error('Transfer error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Helper function to get default icon based on wallet type
function getDefaultIcon(type) {
  const icons = {
    credit_card: '💳',
    debit_card: '💳',
    savings: '🏦',
    checking: '🏦',
    cash: '💵',
    investment: '📈',
    other: '👛'
  };
  return icons[type] || '👛';
}

module.exports = router;