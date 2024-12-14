// src/models/oauthToken.model.js
const mongoose = require('mongoose');
const encryption = require('../utils/encryption');

const oauthTokenSchema = new mongoose.Schema({
    provider: {
        type: String,
        required: true,
        enum: ['zoho', 'google', 'microsoft', 'slack'], // Add more providers as needed
        index: true
    },
    accessToken: {
        type: String,
        required: true,
        set: encryption.encrypt,
        get: encryption.decrypt
    },
    refreshToken: {
        type: String,
        required: true,
        set: encryption.encrypt,
        get: encryption.decrypt
    },
    tokenType: {
        type: String,
        default: 'Bearer'
    },
    scope: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true }
});

// Compound index for provider queries
oauthTokenSchema.index({ provider: 1, isActive: 1 });

const OAuthToken = mongoose.model('OAuthToken', oauthTokenSchema);

module.exports = OAuthToken;