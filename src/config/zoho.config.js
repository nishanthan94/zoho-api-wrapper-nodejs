
require('dotenv').config();

const zohoConfig = {
    client_id: process.env.ZOHO_CLIENT_ID,
    client_secret: process.env.ZOHO_SECRET_ID,
    redirect_uri: process.env.ZOHO_REDIRECT_URI,
    defaultRegion: 'com',
    services: {
        accounts: {
            com: 'https://accounts.zoho.com',
            eu: 'https://accounts.zoho.eu',
            au: 'https://accounts.zoho.com.au',
            in: 'https://accounts.zoho.in',
            jp: 'https://accounts.zoho.jp',
            uk: 'https://accounts.zoho.uk',
            ca: 'https://accounts.zohocloud.ca',
            sa: 'https://accounts.zoho.sa'
        },
        projects: {
            com: 'https://projectsapi.zoho.com',
            eu: 'https://projectsapi.zoho.eu',
            au: 'https://projectsapi.zoho.com.au',
            in: 'https://projectsapi.zoho.in',
            jp: 'https://projectsapi.zoho.jp',
            uk: 'https://projectsapi.zoho.uk',
            ca: 'https://projectsapi.zohocloud.ca',
            sa: 'https://projectsapi.zoho.sa'
        }
    },
    paths: {
        auth: '/oauth/v2/auth',
        token: '/oauth/v2/token',
        projects: {
            base: '/restapi',
            portals: '/portals',
            projects: '/projects',
        }
    },
    versions: {
        projects: 'v1',
    },
    scope: 'ZohoProjects.portals.ALL,ZohoProjects.projects.ALL,ZohoProjects.activities.ALL',

    requestConfig: {
        headers: {
            'Content-Type': 'application/json'
        }
    }
};

module.exports = zohoConfig;