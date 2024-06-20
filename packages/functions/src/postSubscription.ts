import { APIGatewayProxyHandler } from 'aws-lambda';
import { SQL } from "./dbConfig";
import AWS from 'aws-sdk';

interface SubscriptionData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

const sns = new AWS.SNS();

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  if (!event.body) {
    console.error('No data provided in the event body');
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'No subscription data provided' }),
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
    // Check if the email already exists
    const existingEmail = await SQL.DB
      .selectFrom('subscription')
      .select('*')
      .where('email', '=', email)
      .execute();

    if (existingEmail.length > 0) {
      console.error('Email already exists');
      return {
        statusCode: 409, // Conflict status code
        body: JSON.stringify({ message: 'Email already exists' }),
      };
    }

    // Check if the phone number already exists
    const existingPhone = await SQL.DB
      .selectFrom('subscription')
      .select('*')
      .where('phone', '=', phone)
      .execute();

    if (existingPhone.length > 0) {
      console.error('Phone number already exists');
      return {
        statusCode: 409, // Conflict status code
        body: JSON.stringify({ message: 'Phone number already exists' }),
      };
    }

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

    // Send SMS message to the new subscriber
    const snsParams = {
      Message: `Welcome, ${first_name} ${last_name}! Thank you for subscribing to our educational resources.`,
      PhoneNumber: phone,
    };

    console.log('Sending SMS message...');
    await sns.publish(snsParams).promise();
    console.log('SMS message sent successfully');

    return {
      statusCode: 201,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Subscription data added and SMS sent successfully' }),
    };
  } catch (error) {
    console.error('Error during operation:', error);
    const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to insert subscription data or send SMS', error: errorMessage }),
    };
  }
};