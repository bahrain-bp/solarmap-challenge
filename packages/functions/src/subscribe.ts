import { APIGatewayProxyHandler } from 'aws-lambda';
import { SQL } from "./dbConfig";
import AWS from 'aws-sdk';

// Initialize the SNS service
const sns = new AWS.SNS();

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

  const { title, body: resourceBody, resource_url, resource_img, first_name, last_name, email, phone }: SubscriptionData & { title: string; body: string; resource_url: string; resource_img: string | null } = JSON.parse(event.body);

  // Validate required fields
  if (!title || !resourceBody || !resource_url || !first_name || !last_name || !email || !phone) {
    console.error('Missing required fields');
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Title, body, resource URL, first name, last name, email, and phone number are required' }),
    };
  }

  try {
    let imageBlob = null;

    // Only process the image if it's provided
    if (resource_img) {
      // Convert base64 string to binary data
      imageBlob = Buffer.from(resource_img, 'base64');
    }

    console.log('Inserting educational resource into database...');
    await SQL.DB
      .insertInto('educational_resource')
      .values({
        title: title,
        body: resourceBody,
        resource_url: resource_url,
        resource_img: imageBlob,  // Storing the BLOB directly in the database
      })
      .execute();
    console.log('Educational resource insert successful');

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

    console.log('Sending SNS message...');
    const snsParams = {
      Message: `A new educational resource titled "${title}" has been posted. Check it out here: ${resource_url}`,
      PhoneNumber: phone,
    };
    console.log('SNS params:', snsParams);

    const publishResponse = await sns.publish(snsParams).promise();
    console.log('SNS message sent successfully:', publishResponse);

    return {
      statusCode: 201,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Resource and subscription data added, SMS notification sent successfully' }),
    };
  } catch (error) {
    console.error('Error during operation:', error);
    const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to insert data or send SMS', error: errorMessage }),
    };
  }
};
