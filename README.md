# Chat Service Reusable for Different Projects

## Table of Contents
- [Installation](#installation)
  - [Docker Installation](#docker-installation)
    - [Local Development](#local-development)
    - [Production Deployment](#production-deployment)
  - [Manual Installation](#manual-installation)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
  - [Obtaining a JWT Token](#obtaining-a-jwt-token)
- [How to Use](#how-to-use)
  - [User](#user)
  - [Room](#room)
  - [Send Message](#send-message)
  - [Receive Message](#receive-message)

## Installation

You can choose to install the chat service either via Docker or manually.

### Docker Installation

#### Local Development

1. Ensure you have Docker and Docker Compose installed.
2. Use the `docker-compose-local.yml` file to set up the local development environment:
   ```bash
   docker-compose -f docker-compose-local.yml up
   ```

#### Production Deployment

1. Ensure you have Docker and Docker Compose installed.
2. Use the `docker-compose-production.yml` file to set up the production environment:
   ```bash
   docker-compose -f docker-compose-production.yml up -d
   ```

### Manual Installation

1. Ensure you have Node.js and npm installed.
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the service:

   - For local development:
     ```bash
     npm run start:dev
     ```
   - For production:
     ```bash
     npm run start:prod
     ```

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

## How to Use

### User

To use this chat service, the system integrating with the chat panel will have to link users with the chat panel. To create a user in the chat panel, you can call the POST `{host}/user` API. After creating a user, you'll receive a UUID as a user token. You will need to save this token in your system. You can use this token for [Authentication](#authentication)

### Room

There's an API to create a room. After creating a room, your system will need to save the UUID in your system. This UUID can be used to join rooms or send messages to rooms.

### Send Message

To send a new message, there are both API (`{host}/room/{room_id}/message/send`) and WebSocket gateway options. You can use the 'send_message' event for the WebSocket gateway. In the message body, send a JSON object like this:

```json
{
    "room_id": "76afed16-7e57-42a9-a9d8-520fbbb68a87",
    "text_message": "r1"
}
```

### Receive Message

To receive new messages, there are two steps:
1. Join the room.
2. Listen to the 'new_message' event from the WebSocket.

You will know when there are new messages in the rooms you joined. To join the room, you will need to send a message to the 'join_room' event. In the message body, send a JSON object like this: 

```json
{
    "room_id":"76afed16-7e57-42a9-a9d8-520fbbb68a87",
    "text_message":"r1"
}
```




