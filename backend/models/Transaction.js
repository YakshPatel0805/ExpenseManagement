const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['expense', 'income', 'transfer']
    },
    amount: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: function() { return this.type === 'expense'; }
    },
    source: {
        type: String,
        enum: ['salary', 'freelance', 'investment', 'bonus', 'gift', 'other'],
        required: function() { return this.type === 'income'; }
    },
    fromWalletId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wallet',
        required: function() { return this.type === 'expense' || this.type === 'transfer'; }
    },
    toWalletId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wallet',
        required: function() { return this.type === 'income' || this.type === 'transfer'; }
    },
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'completed'
    },
    // Reference to expense if this transaction is from an expense
    expenseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Expense'
    }
}, {
    timestamps: true
});

// Index for efficient queries
transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, type: 1 });
transactionSchema.index({ fromWalletId: 1 });
transactionSchema.index({ toWalletId: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);