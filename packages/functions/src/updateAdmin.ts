import { APIGatewayProxyHandler } from 'aws-lambda';
import { CognitoIdentityProviderClient, AdminUpdateUserAttributesCommand } from '@aws-sdk/client-cognito-identity-provider';

const client = new CognitoIdentityProviderClient({});

interface EditUserEvent {
  email: string;
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
    const body: EditUserEvent = JSON.parse(event.body || '{}');

    const { email, firstName, lastName } = body;

    const command = new AdminUpdateUserAttributesCommand({
      UserPoolId: userPoolId,
      Username: email,
      UserAttributes: [
        { Name: 'given_name', Value: firstName },
        { Name: 'family_name', Value: lastName },
      ],
    });

    const response = await client.send(command);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'User updated successfully', response }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to update user', error}),
    };
  }
};
