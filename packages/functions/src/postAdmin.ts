import { APIGatewayProxyHandler } from 'aws-lambda';
import { CognitoIdentityProviderClient, AdminCreateUserCommand, AdminUpdateUserAttributesCommand } from '@aws-sdk/client-cognito-identity-provider';

const client = new CognitoIdentityProviderClient({});

interface CreateUserEvent {
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
    const { email, temporaryPassword, firstName, lastName } = body;

    // Create user and send welcome email with temporary password
    const createUserCommand = new AdminCreateUserCommand({
      UserPoolId: userPoolId,
      Username: email,
      TemporaryPassword: temporaryPassword,
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'given_name', Value: firstName },
        { Name: 'family_name', Value: lastName },
        { Name: 'email_verified', Value: 'false' }, // Ensure email verification is required
      ],
    });

    await client.send(createUserCommand);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'User created successfully, verification email sent' }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to create user', error }),
    };
  }
};
