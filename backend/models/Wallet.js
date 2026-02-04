const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['credit_card', 'debit_card', 'savings', 'checking', 'cash', 'investment', 'other']
    },
    balance: {
        type: Number,
        default: 0
    },
    currency: {
        type: String,
        default: 'USD'
    },
    color: {
        type: String,
        default: '#3498db'
    },
    icon: {
        type: String,
        default: '💳'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    // For credit cards
    creditLimit: {
        type: Number,
        default: null
    },
    // For bank accounts
    accountNumber: {
        type: String,
        sparse: true
    },
    bankName: {
        type: String
    }
}, {
    timestamps: true
});

// Index for efficient queries
walletSchema.index({ userId: 1, isActive: 1 });

module.exports = mongoose.model('Wallet', walletSchema);