import { APIGatewayProxyHandler } from 'aws-lambda';
import { CognitoIdentityProviderClient, AdminCreateUserCommand } from '@aws-sdk/client-cognito-identity-provider';

const client = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });

interface CreateUserEvent {
  username: string;
  email: string;
  temporaryPassword: string;
  firstName: string;
  lastName: string;
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
    const body: CreateUserEvent = JSON.parse(event.body || '{}');

    const { username, email, temporaryPassword, firstName, lastName } = body;

    const command = new AdminCreateUserCommand({
      UserPoolId: userPoolId,
      Username: username,
      TemporaryPassword: temporaryPassword,
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'given_name', Value: firstName },
        { Name: 'family_name', Value: lastName },
        { Name: 'email_verified', Value: 'true' }
      ],
      MessageAction: 'SUPPRESS', // Suppress the sending of the welcome email
    });

    const response = await client.send(command);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'User created successfully', response }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to create user', error}),
    };
  }
};
