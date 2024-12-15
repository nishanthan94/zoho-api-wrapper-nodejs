
const oauthTokenService = require('../services/oauthToken.service');
const zohoAuthService = require('../services/zohoAuth.service');

const providerServices = {
    zoho: zohoAuthService,
};

const createTokenVerifier = (provider) => {
    return async (req, res, next) => {
        try {
            const tokenDoc = await oauthTokenService.getToken(provider);
            const isExpired = await oauthTokenService.isTokenExpired(tokenDoc);

            if (isExpired) {
                // Get the appropriate service for this provider
                const authService = providerServices[provider];
                if (!authService) {
                    throw new Error(`Auth service not found for provider: ${provider}`);
                }

                // Refresh the token
                const newTokenData = await authService.refreshAccessToken(tokenDoc.refreshToken, tokenDoc);
                const updatedToken = await oauthTokenService.updateAccessToken(provider, newTokenData);

                // Add the fresh token to request
                req.oauthToken = updatedToken.accessToken;
            } else {
                // Token is still valid
                req.oauthToken = tokenDoc.accessToken;
            }

            // Add provider info to request
            req.provider = provider;
            next();
        } catch (error) {
            console.error(`Token verification failed for ${provider}:`, error);
            res.status(401).json({ error: 'Authentication failed' });
        }
    };
};

module.exports = createTokenVerifier;