require('dotenv').config();

const zohoConfig = {
    client_id: process.env.ZOHO_CLIENT_ID,
    client_secret: process.env.ZOHO_SECRET_ID,
    redirect_uri: process.env.ZOHO_REDIRECT_URI,
    auth_url: 'https://accounts.zoho.com/oauth/v2/auth',
    token_url: 'https://accounts.zoho.in/oauth/v2/token',
    refresh_url: 'https://accounts.zoho.in/oauth/v2/token',
    scope: 'ZohoProjects.portals.ALL,ZohoProjects.projects.ALL,ZohoProjects.activities.ALL',
};

module.exports = zohoConfig;