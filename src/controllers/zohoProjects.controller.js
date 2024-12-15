/**
 * @fileoverview Controller for handling Zoho Projects API endpoints
 * Manages requests related to portals, projects, and project details
 */

const zohoProjectsService = require('../services/zohoProjects.service');
const Log = require('../utils/logger');

class ZohoProjectsController {
    /**
     * Retrieves all portals accessible to the authenticated user
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    async getPortals(req, res) {
        try {
            Log.info('Fetching Zoho portals', { userId: req.user?.id });
            const portalsData = await zohoProjectsService.getPortals(req.oauthToken, req.tokenMetadata);

            Log.info('Successfully fetched Zoho portals', {
                portalCount: portalsData.length,
                userId: req.user?.id
            });

            res.json({
                success: true,
                data: portalsData
            });
        } catch (error) {
            Log.error('Failed to fetch Zoho portals', error, {
                userId: req.user?.id,
                endpoint: 'getPortals'
            });

            const statusCode = error.message.includes('Unauthorized') ? 401 : 500;
            res.status(statusCode).json({
                success: false,
                error: 'Failed to fetch portals',
                details: error.message
            });
        }
    }

    /**
     * Retrieves all projects for a specific portal
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    async getAllProjects(req, res) {
        try {
            const { portalId } = req.params;

            if (!portalId) {
                Log.error('Missing portal ID in request', new Error('Portal ID is required'), {
                    userId: req.user?.id,
                    endpoint: 'getAllProjects'
                });

                return res.status(400).json({
                    success: false,
                    error: 'Portal ID is required'
                });
            }

            Log.info('Fetching projects for portal', {
                portalId,
                userId: req.user?.id
            });

            const projectsData = await zohoProjectsService.getAllProjects(
                portalId,
                req.oauthToken,
                req.tokenMetadata
            );
            Log.info('Successfully fetched projects', {
                portalId,
                projectCount: projectsData.length,
                userId: req.user?.id
            });

            res.json({
                success: true,
                data: projectsData
            });
        } catch (error) {
            Log.error('Failed to fetch projects', error, {
                portalId: req.params.portalId,
                userId: req.user?.id,
                endpoint: 'getAllProjects'
            });

            const statusCode = error.message.includes('Unauthorized') ? 401 : 500;
            res.status(statusCode).json({
                success: false,
                error: 'Failed to fetch projects',
                details: error.message
            });
        }
    }

    /**
     * Retrieves detailed information for a specific project
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    async getProjectDetails(req, res) {
        try {
            const { portalId, projectId } = req.params;

            if (!portalId || !projectId) {
                Log.error('Missing required parameters', new Error('Portal ID and Project ID are required'), {
                    portalId,
                    projectId,
                    userId: req.user?.id,
                    endpoint: 'getProjectDetails'
                });

                return res.status(400).json({
                    success: false,
                    error: 'Portal ID and Project ID are required'
                });
            }

            Log.info('Fetching project details', {
                portalId,
                projectId,
                userId: req.user?.id
            });

            const projectData = await zohoProjectsService.getProjectDetails(
                portalId,
                projectId,
                req.oauthToken,
                req.tokenMetadata
            );

            Log.info('Successfully fetched project details', {
                portalId,
                projectId,
                userId: req.user?.id
            });

            res.json({
                success: true,
                data: projectData
            });
        } catch (error) {
            Log.error('Failed to fetch project details', error, {
                portalId: req.params.portalId,
                projectId: req.params.projectId,
                userId: req.user?.id,
                endpoint: 'getProjectDetails'
            });

            res.status(500).json({
                success: false,
                error: 'Failed to fetch project details',
                details: error.message
            });
        }
    }
}

module.exports = new ZohoProjectsController();