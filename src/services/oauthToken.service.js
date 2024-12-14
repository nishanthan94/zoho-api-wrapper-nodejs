// src/services/oauthToken.service.js
const OAuthToken = require('../model/oauthToken.model');
const Log = require('../utils/logger');
class OAuthTokenService {
    async saveToken(provider, tokenData) {
        try {
            const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000);

            // Deactivate any existing tokens for this provider
            await OAuthToken.updateMany(
                { provider, isActive: true },
                { isActive: false }
            );

            // Create new token
            const tokenDoc = await OAuthToken.create({
                provider,
                accessToken: tokenData.access_token,
                refreshToken: tokenData.refresh_token,
                tokenType: tokenData.token_type || 'Bearer',
                scope: tokenData.scope,
                expiresAt,
                additionalData: tokenData.additional_data || {},
                isActive: true
            });

            return tokenDoc;
        } catch (error) {
            Log.error(`Error saving ${provider} token:`, error);
            throw error;
        }
    }

    async getToken(provider) {
        try {
            const tokenDoc = await OAuthToken.findOne({
                provider,
                isActive: true
            });

            if (!tokenDoc) {
                throw new Error(`No active token found for ${provider}`);
            }

            return tokenDoc;
        } catch (error) {
            Log.error(`Error getting ${provider} token:`, error);
            throw error;
        }
    }

    async updateAccessToken(provider, tokenData) {
        try {
            const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000);

            const tokenDoc = await OAuthToken.findOneAndUpdate(
                { provider, isActive: true },
                {
                    accessToken: tokenData.access_token,
                    expiresAt,
                    ...(tokenData.additional_data && { additionalData: tokenData.additional_data })
                },
                { new: true }
            );

            if (!tokenDoc) {
                throw new Error(`No active token found for ${provider}`);
            }

            return tokenDoc;
        } catch (error) {
            Log.error(`Error updating ${provider} token:`, error);
            throw error;
        }
    }

    async deactivateToken(provider) {
        try {
            await OAuthToken.updateMany(
                { provider, isActive: true },
                { isActive: false }
            );
        } catch (error) {
            Log.error(`Error deactivating ${provider} token:`, error);
            throw error;
        }
    }

    async isTokenExpired(tokenDoc, bufferMinutes = 5) {
        const bufferMs = bufferMinutes * 60 * 1000;
        return new Date() >= new Date(tokenDoc.expiresAt - bufferMs);
    }
}

module.exports = new OAuthTokenService();