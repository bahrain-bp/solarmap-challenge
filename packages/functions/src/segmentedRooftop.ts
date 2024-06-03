// Segmented Rooftop Lambda function
import { APIGatewayProxyEvent } from 'aws-lambda';

export const sendEmail = async (event: APIGatewayProxyEvent) => {

  try {
    console.log(event);
  } catch (error) {
    console.error('Invalid JSON payload:', event.body);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON payload' }),
    };
  }
};
