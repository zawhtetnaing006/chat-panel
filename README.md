# Chat Service Reusable for Different Projects

## Installation

You can choose to install the chat service either via Docker or manually.

### Docker Installation

#### Local Development

1. Ensure you have Docker and Docker Compose installed.
2. Use the `docker-compose-local.yml` file to set up the local development environment:
   docker-compose -f docker-compose-local.yml up

#### Production Deployment

1. Ensure you have Docker and Docker Compose installed.
2. Use the `docker-compose-production.yml` file to set up the production environment:
   docker-compose -f docker-compose-production.yml up -d

### Manual Installation

1. Ensure you have Node.js and npm installed.
2. Install the dependencies:
   npm install
3. Start the service:

   - For local development:
     npm run start:dev
   - For production:
     npm run start:prod

## API Documentation

You can find the API documentation at: {host}/docs.

## Authentication

Authentication in the Chat Panel is managed through two tokens:

1. **API Token**
2. **JWT Token**

### Obtaining a JWT Token

To obtain a JWT token, the backend system integrating with the chat panel needs to make a POST request to the following API endpoint, including the header `clientKey: {api_token}`:

POST auth/{user_id}

The API will respond with a JWT token. This JWT token should be included as a Bearer token in the Authorization header for subsequent API calls.

Alternatively, if you prefer to use only the API token instead of JWT for API calls originating from your backend system, you can utilize the following format for the `clientKey` header:

clientKey: api_token.user_id

