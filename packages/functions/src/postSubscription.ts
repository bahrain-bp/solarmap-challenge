import { APIGatewayProxyHandler } from 'aws-lambda';
import { SQL } from "./dbConfig";

interface SubscriptionData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string; // Changed to string to handle various phone number formats
}

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  if (!event.body) {
    console.error('No data provided in the event body');
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'No data provided' }),
    };
  }

  const { first_name, last_name, email, phone }: SubscriptionData = JSON.parse(event.body);

  // Validate required fields
  if (!first_name || !last_name || !email || !phone) {
    console.error('Missing required fields');
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'First name, last name, email, and phone number are required' }),
    };
  }

  try {
    console.log('Inserting subscription data into database...');
    await SQL.DB
      .insertInto('subscription')
      .values({
        first_name: first_name,
        last_name: last_name,
        email: email,
        phone: phone,
      })
      .execute();
    console.log('Subscription data insert successful');

    return {
      statusCode: 201,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Subscription data added successfully' }),
    };
  } catch (error) {
    console.error('Error during operation:', error);
    const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to insert subscription data', error: errorMessage }),
    };
  }
};
