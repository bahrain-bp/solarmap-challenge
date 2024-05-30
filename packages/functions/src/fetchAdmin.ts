import { APIGatewayProxyHandler } from 'aws-lambda';
import { CognitoIdentityProviderClient, ListUsersCommand } from '@aws-sdk/client-cognito-identity-provider';

const client = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });

export const handler: APIGatewayProxyHandler = async (event) => {
  const userPoolId = process.env.USER_POOL_ID;

  if (!userPoolId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'User Pool ID is not configured' }),
    };
  }

  try {
    const command = new ListUsersCommand({ UserPoolId: userPoolId });
    const response = await client.send(command);
    const users = response.Users || [];

    return {
      statusCode: 200,
      body: JSON.stringify(users),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to list users', error }),
    };
  }
};
