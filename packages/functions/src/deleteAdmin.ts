import { APIGatewayProxyHandler } from 'aws-lambda';
import { CognitoIdentityProviderClient, AdminDeleteUserCommand } from '@aws-sdk/client-cognito-identity-provider';

const client = new CognitoIdentityProviderClient({});

interface DeleteUserEvent {
  email: string;
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const userPoolId = process.env.USER_POOL_ID;

  if (!userPoolId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'User Pool ID is not configured' }),
    };
  }

  try {
    const body: DeleteUserEvent = JSON.parse(event.body || '{}');
    const { email } = body;

    const command = new AdminDeleteUserCommand({
      UserPoolId: userPoolId,
      Username: email,
    });

    await client.send(command);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'User deleted successfully' }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to delete user', error}),
    };
  }
};
