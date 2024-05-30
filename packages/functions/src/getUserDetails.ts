import { APIGatewayProxyHandler } from 'aws-lambda';
import { CognitoIdentityProviderClient, GetUserCommand } from '@aws-sdk/client-cognito-identity-provider';

const client = new CognitoIdentityProviderClient({});

export const handler: APIGatewayProxyHandler = async (event) => {
  const accessToken = event.headers.Authorization?.split(' ')[1];

  if (!accessToken) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Access token is missing' }),
    };
  }

  try {
    const command = new GetUserCommand({ AccessToken: accessToken });
    const response = await client.send(command);

    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to get user details', error }),
    };
  }
};
