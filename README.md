# Auth

Authentication in the Chat Panel is managed through two tokens:

1. **API Token**
2. **JWT Token**

Initially, the backend system integrating with the chat panel needs to request a JWT token by making a call to the following API endpoint with the header "clientKey: {api_token}":

```plaintext
POST auth/{user_id}
```

This API will respond with a JWT token, which should be included as the "Bearer {jwt_token}" header in subsequent API calls for authentication.

Alternatively, if you prefer to use only the API token instead of JWT for API calls originating from your backend system, you can utilize the following format for the `clientKey` header:

```plaintext
clientKey: api_token.user_id
```
