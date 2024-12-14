# Zoho Projects API Integration

A Node.js/Express application that provides a seamless integration with Zoho Projects API. This service handles OAuth authentication and provides REST endpoints for managing Zoho Projects portals and projects.

Live Demo: [https://zoho-project-integration.vercel.app/](https://zoho-project-integration.vercel.app/)

## Features

- 🔐 OAuth 2.0 Authentication with Zoho
- 🔄 Automatic token refresh handling
- 📂 Portal management
- 📊 Project management
- 🔒 Secure token storage with encryption
- ✨ Easy-to-use REST API endpoints

## Tech Stack

- Node.js
- Express.js
- MongoDB (with Mongoose)
- Zoho Projects API
- Vercel (Deployment)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB database
- Zoho Developer Account
- Registered Zoho application with OAuth credentials

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
ZOHO_CLIENT_ID=your_zoho_client_id
ZOHO_CLIENT_SECRET=your_zoho_client_secret
ZOHO_REDIRECT_URI=your_redirect_uri
ENCRYPTION_KEY=your_encryption_key
```

## Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/zoho-projects-api-nodejs.git
cd zoho-projects-api-nodejs
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

## Deployment

This project is deployed on Vercel. To deploy your own instance:

1. Fork this repository
2. Create a new project on Vercel
3. Connect your forked repository
4. Configure environment variables in Vercel dashboard
5. Deploy

## Local Development

1. Setup MongoDB locally or use MongoDB Atlas
2. Configure environment variables
3. Run the development server:
```bash
npm run dev
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Support

For support, email your-email@example.com or create an issue in this repository.
