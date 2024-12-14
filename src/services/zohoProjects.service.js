// src/services/zohoProjects.service.js
const axios = require('axios');
const Log = require('../utils/logger');

class ZohoProjectsService {
    constructor() {
        this.baseUrl = 'https://projectsapi.zoho.in/restapi';
    }

    async getPortals(accessToken) {
        try {
            const response = await axios.get(`${this.baseUrl}/portals/`, {
                headers: {
                    'Authorization': `Zoho-oauthtoken ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            return response.data;
        } catch (error) {
            Log.error('Failed to fetch portals from Zoho API', error, {
                errorCode: error.response?.status,
                errorResponse: error.response?.data
            });

            throw new Error(error.response?.data?.message || 'Failed to fetch portals');
        }
    }

    async getAllProjects(portalId, accessToken) {
        try {
            const response = await axios.get(`${this.baseUrl}/portal/${portalId}/projects/`, {
                headers: {
                    'Authorization': `Zoho-oauthtoken ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            return response.data;
        } catch (error) {
            Log.error('Failed to fetch projects', error, {
                portalId,
                errorCode: error.response?.status,
                errorResponse: error.response?.data
            });

            throw new Error(error.response?.data?.message || 'Failed to fetch projects');
        }
    }

    async getProjectDetails(portalId, projectId, accessToken) {
        try {
            const response = await axios.get(`${this.baseUrl}/portal/${portalId}/projects/${projectId}/`, {
                headers: {
                    'Authorization': `Zoho-oauthtoken ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            
            return response.data;
        } catch (error) {
            Log.error('Error fetching project details', error, {
                portalId,
                message: error.message
            });

            throw new Error(error.response?.data?.message || 'Failed to fetch project details');
        }
    }
}

module.exports = new ZohoProjectsService();