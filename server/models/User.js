const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    provider: {
        type: String,
        default: "Groq"
    },
    apiKey: {
        type: String,
        default: null
    },
    resumeUrl: {
        type: String,
        default: null
    },
    resumeText: {
        type: String,
        default: null
    },
    resumeFileName: {
        type: String,
        default: null
    },
    resumeUploadedAt: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const User = mongoose.model('User', userSchema);
module.exports = User;