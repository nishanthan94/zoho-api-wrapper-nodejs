const zohoConfig = {
    client_id: process.env.ZOHO_CLIENT_ID,
    client_secret: process.env.ZOHO_SECRET_ID,
    redirect_uri: process.env.ZOHO_REDIRECT_URI,
    defaultRegion: 'com',
    endpoints: {
        "com": "https://accounts.zoho.com",
        "eu": "https://accounts.zoho.eu",
        "au": "https://accounts.zoho.com.au",
        "in": "https://accounts.zoho.in",
        "jp": "https://accounts.zoho.jp",
        "uk": "https://accounts.zoho.uk",
        "us": "https://accounts.zoho.com",
        "ca": "https://accounts.zohocloud.ca",
        "sa": "https://accounts.zoho.sa"
    },
    paths: {
        auth: '/oauth/v2/auth',
        token: '/oauth/v2/token'
    },
    scope: 'ZohoProjects.portals.ALL,ZohoProjects.projects.ALL,ZohoProjects.activities.ALL'
};

module.exports = zohoConfig;