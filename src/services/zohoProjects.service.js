const axios = require('axios');
const Log = require('../utils/logger');
const zohoConfig = require('../config/zoho.config');

class ZohoProjectsService {
    constructor() {
        this.config = zohoConfig;
        this.defaultRegion = this.config.defaultRegion;
    }

    getBaseUrl(metadata = {}) {
        const location = metadata?.location || this.defaultRegion;
        const baseUrl = this.config.services.projects[location] || this.config.services.projects[this.defaultRegion];
        return `${baseUrl}${this.config.paths.projects.base}`;
    }

    getRequestConfig(accessToken) {
        return {
            headers: {
                ...this.config.requestConfig.headers,
                'Authorization': `Zoho-oauthtoken ${accessToken}`
            }
        };
    }

    async makeRequest(method, url, accessToken, data = null) {
        try {
            const config = this.getRequestConfig(accessToken);
            const response = await axios({ method, url, ...config, data });
            return response.data;
        } catch (error) {
            Log.error(`Failed to make ${method} request to ${url}`, error, {
                errorCode: error.response?.status,
                errorResponse: error.response?.data
            });
            throw new Error(error.response?.data?.message || `Failed to make ${method} request`);
        }
    }

    async getPortals(accessToken, tokenMetadata) {
        const baseUrl = this.getBaseUrl(tokenMetadata);
        const url = `${baseUrl}${this.config.paths.projects.portals}/`;
        return this.makeRequest('GET', url, accessToken);
    }

    async getAllProjects(portalId, accessToken, tokenMetadata) {
        try {
            const baseUrl = this.getBaseUrl(tokenMetadata);
            const url = `${baseUrl}/portal/${portalId}${this.config.paths.projects.projects}/`;
            return await this.makeRequest('GET', url, accessToken);
        } catch (error) {
            Log.error('Failed to fetch projects', error, { portalId });
            throw error;
        }
    }

    async getProjectDetails(portalId, projectId, accessToken, tokenMetadata) {
        try {
            const baseUrl = this.getBaseUrl(tokenMetadata);
            const url = `${baseUrl}/portal/${portalId}${this.config.paths.projects.projects}/${projectId}/`;
            return await this.makeRequest('GET', url, accessToken);
        } catch (error) {
            Log.error('Failed to fetch project details', error, { portalId, projectId });
            throw error;
        }
    }
}

module.exports = new ZohoProjectsService();