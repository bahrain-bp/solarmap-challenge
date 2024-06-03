import { CognitoIdentityProviderClient, AdminGetUserCommand, AdminUpdateUserAttributesCommand, GetUserCommand } from '@aws-sdk/client-cognito-identity-provider';
import { APIGatewayProxyHandler } from 'aws-lambda';

const client = new CognitoIdentityProviderClient({});

export const handler: APIGatewayProxyHandler = async (event) => {
  const userPoolId = process.env.USER_POOL_ID;

  if (!userPoolId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'User Pool ID is not configured' }),
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { email } = body;

    // Get user to check current email_verified status
    const getUserCommand = new AdminGetUserCommand({
      UserPoolId: userPoolId,
      Username: email,
    });

    const userResponse = await client.send(getUserCommand);
    const emailVerified = userResponse.UserAttributes?.find(attr => attr.Name === 'email_verified')?.Value;

    if (emailVerified === 'true') {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Email is already verified' }),
      };
    }

    // Update user attributes to trigger email verification
    const updateUserCommand = new AdminUpdateUserAttributesCommand({
      UserPoolId: userPoolId,
      Username: email,
      UserAttributes: [
        { Name: 'email_verified', Value: 'false' },
      ],
    });

    await client.send(updateUserCommand);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Verification email sent' }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to send verification email', error }),
    };
  }
};
