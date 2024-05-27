import { APIGatewayProxyHandler } from 'aws-lambda';
import { SQL } from "./dbConfig";

interface SubscriptionData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
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

 // Validate phone number format (+973 followed by 8 digits)
 if (!/^\+973\d{8}$/.test(phone)) {
  console.error('Invalid phone number format');
  return {
    statusCode: 400,
    body: JSON.stringify({ message: 'Phone number must be in the format +973 followed by 8 digits' }),
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