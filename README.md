# Cognito-client-credentials-tokenmanager
A lightweight Tokenmanager for AWS Cognito - Client Credentials flow. Using the Tokenmanager will make system to system auth with AWS Cognito quick and easy. 

## Features

Instantiate the Tokenmanager with the following parameters:
- clientId: The client id of the client you want to use to get the token
- clientSecret: The client secret of the client you want to use to get the token
- tokenEndpoint: The token endpoint of the AWS Cognito user pool
- scope: The scope of the token you want to get

When instantiating, the Tokenmanager will immediately get a token from AWS Cognito and will cache it. The token will be refreshed automatically when it expires. Every time you call `getToken()` the cached token will be returned, unless it is expired. In that case a new token will be requested from AWS Cognito. 

Instantiating the Tokenmanager invokes a fetchToken method in the constructor, which is asynchronous and returns a promise, which means that it doesn't block the execution of the constructor. This means that it's possible to create an instance of the TokenManager class before the initial token is fetched. However, because the `getToken()` method checks if the token is available and not expired before returning it, and fetches a new token if necessary, this should not be a problem in practice, and it will the other code execute until the token is really needed. In this way the instantiation of the Tokenmanager is fast and not blocking the execution of the code.

## Installation

```bash
npm i aws-cognito-client-credentials-tokenmanager
```


## Usage

```ts
import TokenManager from "aws-cognito-client-credentials-tokenmanager";

const tokenManager = new TokenManager(clientId, clientSecret, tokenEndpoint, scope);

async function lambdaHandler() {
    try {
        const jwtToken = await tokenManager.getToken();
        // use jwtToken to call your API with the AWS Cognito JWT token
    } catch (error) {
        console.error('Sad things happened', error);
    }
}
```
