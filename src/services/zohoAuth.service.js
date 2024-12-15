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
        const baseUrl = this.config.endpoints[this.config.defaultRegion];
        return `${baseUrl}${this.config.paths.auth}?${params.toString()}`;
    }

    async getAccessToken(code, metadata = {}) {
        try {
            const params = new URLSearchParams({
                code: code,
                client_id: this.config.client_id,
                client_secret: this.config.client_secret,
                redirect_uri: this.config.redirect_uri,
                grant_type: 'authorization_code'
            });
            const baseUrl = metadata.accountsServer || this.config.endpoints[metadata.location] || this.config.endpoints[this.config.defaultRegion];
            const tokenUrl = `${baseUrl}${this.config.paths.token}`;

            const response = await axios.post(tokenUrl, params);

            const tokenData = {
                ...response.data,
                scope: response.data.scope || this.config.scope,
                providerMetadata: metadata
            };

            await oauthTokenService.saveToken(this.provider, tokenData);

            return tokenData;
        } catch (error) {
            Log.error('Error getting access token', error);
            throw new Error(error.response?.data?.message || 'Failed to get access token');
        }
    }


    async refreshAccessToken(refreshToken, existingTokenData = null) {
        try {
            let metadata = {};
            if (existingTokenData) {
                metadata = existingTokenData.providerMetadata || {};
            } else {
                const currentToken = await oauthTokenService.getToken(this.provider);
                metadata = currentToken.providerMetadata || {};
            }

            const baseUrl = metadata.accountsServer ||
                this.config.endpoints[metadata.location] ||
                this.config.endpoints[this.config.defaultRegion];

            const refreshUrl = `${baseUrl}${this.config.paths.token}`;

            const params = new URLSearchParams({
                refresh_token: refreshToken,
                client_id: this.config.client_id,
                client_secret: this.config.client_secret,
                grant_type: 'refresh_token'
            });

            const response = await axios.post(refreshUrl, params);

            return {
                ...response.data,
                scope: response.data.scope || this.config.scope,
                providerMetadata: metadata // Preserve existing metadata
            };
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