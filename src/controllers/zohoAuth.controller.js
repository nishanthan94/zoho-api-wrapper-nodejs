/**
 * @fileoverview Controller for managing Zoho OAuth authentication flows
 * Handles authentication initiation, callback processing, token refresh, and status checks
 */

const zohoAuthService = require('../services/zohoAuth.service');
const oauthTokenService = require('../services/oauthToken.service');
const Log = require('../utils/logger');

class ZohoAuthController {
    /**
     * Initiates the OAuth authentication flow by redirecting to Zoho's auth page
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    async initiateAuth(req, res) {
        try {
            Log.info('Initiating Zoho OAuth flow', {
                userId: req.user?.id,
                ip: req.ip
            });

            const authUrl = zohoAuthService.getAuthorizationUrl();

            Log.info('Redirecting to Zoho auth page', {
                authUrl,
                userId: req.user?.id
            });

            res.redirect(authUrl);
        } catch (error) {
            Log.error('Failed to initiate Zoho OAuth flow', error, {
                userId: req.user?.id,
                ip: req.ip
            });

            res.status(500).json({
                error: 'Failed to initiate authentication',
                details: error.message
            });
        }
    }

    /**
     * Handles the OAuth callback from Zoho, processes the authorization code
     * and retrieves access tokens
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    async handleCallback(req, res) {
        try {
            const { code, error: authError, error_description: errorDesc } = req.query;

            Log.info('Received OAuth callback', {
                hasCode: !!code,
                hasError: !!authError,
                ip: req.ip
            });

            // Handle OAuth error response
            if (authError) {
                Log.error('OAuth callback returned error', new Error(errorDesc || authError), {
                    error: authError,
                    description: errorDesc
                });
                throw new Error(errorDesc || authError);
            }

            if (!code) {
                Log.error('Missing authorization code in callback', null, {
                    query: req.query
                });
                return res.status(400).json({ error: 'Authorization code is missing' });
            }

            Log.info('Exchanging authorization code for tokens', {
                code: `${code.substring(0, 4)}...` // Log only first 4 chars for security
            });

            // Get tokens from Zoho
            const tokenData = await zohoAuthService.getAccessToken(code);

            Log.info('Successfully obtained access token', {
                scope: tokenData.scope,
                expiresIn: tokenData.expires_in
            });

            res.json({
                message: 'Authentication successful',
                provider: 'zoho',
                scope: tokenData.scope
            });
        } catch (error) {
            Log.error('OAuth callback processing failed', error, {
                ip: req.ip
            });

            res.status(500).json({
                error: 'Failed to complete authentication',
                details: error.message
            });
        }
    }

    /**
     * Refreshes an expired access token using the refresh token
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    async refreshToken(req, res) {
        try {
            Log.info('Attempting to refresh token');

            const tokenDoc = await oauthTokenService.getToken('zoho');

            if (!tokenDoc) {
                Log.warn('No token found for refresh attempt');
                return res.status(404).json({ error: 'No active token found' });
            }

            Log.info('Refreshing access token', {
                tokenId: tokenDoc._id,
                expiresAt: tokenDoc.expiresAt
            });

            const newTokenData = await zohoAuthService.refreshAccessToken(tokenDoc.refreshToken);
            const updatedToken = await oauthTokenService.updateAccessToken('zoho', newTokenData);

            Log.info('Successfully refreshed access token', {
                tokenId: updatedToken._id,
                newExpiresAt: updatedToken.expiresAt
            });

            res.json({
                message: 'Token refreshed successfully',
                expiresAt: updatedToken.expiresAt
            });
        } catch (error) {
            Log.error('Token refresh failed', error);
            res.status(500).json({
                error: 'Failed to refresh token',
                details: error.message
            });
        }
    }

    /**
     * Retrieves the current status of the OAuth token
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    async getTokenStatus(req, res) {
        try {
            Log.info('Checking token status');

            const tokenDoc = await oauthTokenService.getToken('zoho');

            if (!tokenDoc) {
                Log.warn('No token found during status check');
                return res.status(404).json({ error: 'No active token found' });
            }

            const isExpired = await oauthTokenService.isTokenExpired(tokenDoc);

            Log.info('Token status retrieved', {
                tokenId: tokenDoc._id,
                isExpired,
                expiresAt: tokenDoc.expiresAt
            });

            res.json({
                active: true,
                expired: isExpired,
                expiresAt: tokenDoc.expiresAt,
                scope: tokenDoc.scope,
                lastUpdated: tokenDoc.updatedAt
            });
        } catch (error) {
            Log.error('Token status check failed', error);
            res.status(404).json({
                error: 'Token status check failed',
                details: error.message
            });
        }
    }

    /**
     * Retrieves the current access token
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    async getToken(req, res) {
        try {
            Log.info('Retrieving access token');

            const tokenDoc = await oauthTokenService.getToken('zoho');

            if (!tokenDoc) {
                Log.warn('No token found during retrieval');
                return res.status(404).json({ error: 'No active token found' });
            }

            Log.info('Access token retrieved successfully', {
                tokenId: tokenDoc._id,
                expiresAt: tokenDoc.expiresAt
            });

            res.json({ token: tokenDoc.accessToken });
        } catch (error) {
            Log.error('Token retrieval failed', error);
            res.status(404).json({
                error: 'Token retrieval failed',
                details: error.message
            });
        }
    }
}

module.exports = new ZohoAuthController();