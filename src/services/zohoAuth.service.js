// src/services/zohoAuth.service.js
const axios = require('axios');
const zohoConfig = require('../config/zoho.config');
const oauthTokenService = require('./oauthToken.service');
const Log = require('../utils/logger');
class ZohoAuthService {
    constructor() {
        this.config = zohoConfig;
        this.provider = 'zoho';
    }

    getAuthorizationUrl() {
        const params = new URLSearchParams({
            client_id: this.config.client_id,
            response_type: 'code',
            scope: this.config.scope,
            redirect_uri: this.config.redirect_uri,
            access_type: 'offline',
            prompt: 'consent'
        });

        return `${this.config.auth_url}?${params.toString()}`;
    }

    async getAccessToken(code) {
        try {
            const params = new URLSearchParams({
                code: code,
                client_id: this.config.client_id,
                client_secret: this.config.client_secret,
                redirect_uri: this.config.redirect_uri,
                grant_type: 'authorization_code'
            });

            const response = await axios.post(this.config.token_url, params);

            // Add scope to token data if not provided by Zoho
            const tokenData = {
                ...response.data,
                scope: response.data.scope || this.config.scope
            };

            // Save token using generic service
            await oauthTokenService.saveToken(this.provider, tokenData);

            return tokenData;
        } catch (error) {
            Log.error('Error getting access token', error);
            throw new Error(error.response?.data?.message || 'Failed to get access token');
        }
    }

    async refreshAccessToken(refreshToken) {
        try {
            const params = new URLSearchParams({
                refresh_token: refreshToken,
                client_id: this.config.client_id,
                client_secret: this.config.client_secret,
                grant_type: 'refresh_token'
            });

            const response = await axios.post(this.config.refresh_url, params);

            // Add scope to token data if not provided by Zoho
            const tokenData = {
                ...response.data,
                scope: response.data.scope || this.config.scope
            };

            return tokenData;
        } catch (error) {
            Log.error('Error refreshing token', error);
            throw new Error(error.response?.data?.message || 'Failed to refresh token');
        }
    }

    async getCurrentToken() {
        try {
            const tokenDoc = await oauthTokenService.getToken(this.provider);
            return tokenDoc.accessToken;
        } catch (error) {
            Log.error('No active Zoho token found', error);
            throw new Error('No active Zoho token found');
        }
    }
}

module.exports = new ZohoAuthService();