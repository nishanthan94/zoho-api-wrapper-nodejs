// src/routes/zohoProjects.routes.js
const express = require('express');
const router = express.Router();
const zohoProjectsController = require('../controllers/zohoProjects.controller');
const createTokenVerifier = require('../middleware/verifyOAuthToken');

const verifyZohoToken = createTokenVerifier('zoho');

// Get all portals
router.get('/portals', verifyZohoToken, zohoProjectsController.getPortals);

// Get all projects in a portal
router.get('/portals/:portalId/projects', verifyZohoToken, zohoProjectsController.getAllProjects);

// Get specific project details
router.get('/portals/:portalId/projects/:projectId', verifyZohoToken, zohoProjectsController.getProjectDetails);

module.exports = router;