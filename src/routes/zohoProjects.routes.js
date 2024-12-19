// src/routes/zohoProjects.routes.js
const express = require('express');
const router = express.Router();
const zohoProjectsController = require('../controllers/zohoProjects.controller');
const createTokenVerifier = require('../middleware/verifyOAuthToken');
const validateRequest = require('../middleware/validateRequest');
const { bodySchema, projectSchema, } = require('../validations/zohoProjects.validation');

const verifyZohoToken = createTokenVerifier('zoho');

// Get all portals
router.get('/portals', verifyZohoToken, zohoProjectsController.getPortals);

// Get all projects in a portal
router.get('/portals/:portalId/projects', verifyZohoToken, zohoProjectsController.getAllProjects);
// create project
router.post('/portals/:portalId/projects', validateRequest(bodySchema, 'body'), verifyZohoToken, zohoProjectsController.createProject);

router.post('/portals/:portalId/projects/:projectId', validateRequest(bodySchema, 'body'), verifyZohoToken, zohoProjectsController.updateProject);

router.delete('/portals/:portalId/projects/:projectId', validateRequest(projectSchema, 'params'), verifyZohoToken, zohoProjectsController.deleteProject);

// Get specific project details
router.get('/portals/:portalId/projects/:projectId', verifyZohoToken, zohoProjectsController.getProjectDetails);

module.exports = router;