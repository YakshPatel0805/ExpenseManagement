const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    googleId: {
        type: String,
        sparse: true
    },
    avatar: {
        type: String
    },
    provider: {
        type: String,
        default: 'local'
    }
}, {
    timestamps: true 
})

module.exports = mongoose.model('User', userSchema)
