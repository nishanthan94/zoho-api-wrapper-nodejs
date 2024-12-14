const express = require('express');
const router = express.Router();
const zohoAuthController = require('../controllers/zohoAuth.controller');
const createTokenVerifier = require('../middleware/verifyOAuthToken');
const verifyZohoToken = createTokenVerifier('zoho');


// Route to start OAuth flow
router.get('/initiate-auth', zohoAuthController.initiateAuth);

// OAuth callback route
router.get('/callback', zohoAuthController.handleCallback);

router.get('/token/status', verifyZohoToken, zohoAuthController.getTokenStatus);
router.post('/token/refresh', verifyZohoToken, zohoAuthController.refreshToken);
router.get('/token', verifyZohoToken, zohoAuthController.getToken);

module.exports = router;