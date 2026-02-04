const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
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
    category: {
        type: String,
        required: true,
        enum: ['food', 'shopping', 'housing', 'transportation', 'entertainment', 'healthcare', 'utilities', 'other', 'total']
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    period: {
        type: String,
        required: true,
        enum: ['weekly', 'monthly', 'yearly']
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    spent: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    alertThreshold: {
        type: Number,
        default: 80, // Alert when 80% of budget is used
        min: 0,
        max: 100
    }
}, {
    timestamps: true
});

// Index for efficient queries
budgetSchema.index({ userId: 1, isActive: 1 });
budgetSchema.index({ userId: 1, category: 1 });

module.exports = mongoose.model('Budget', budgetSchema);