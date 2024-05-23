import { APIGatewayProxyHandler } from 'aws-lambda';
import { SQL } from "./dbConfig";
import AWS from 'aws-sdk';

// Initialize the SNS service
const sns = new AWS.SNS();

const truncateText = (text: string, wordLimit: number) => {
  const words = text.split(' ');
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(' ') + '...';
  }
  return text;
};

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  if (!event.body) {
    console.error('No data provided in the event body');
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'No resource data provided' }),
    };
  }

  const { title, body, resource_url, resource_img } = JSON.parse(event.body as string);

  // Validate required fields
  if (!title || !body || !resource_url) {
    console.error('Missing required fields');
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Title, body, and resource URL are required' }),
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
        body: body,
        resource_url: resource_url,
        resource_img: imageBlob,  // Storing the BLOB directly in the database
      })
      .execute();
    console.log('Educational resource insert successful');

    console.log('Fetching phone numbers and names from subscription table...');
    const subscriptions = await SQL.DB
      .selectFrom('subscription')
      .select(['phone', 'first_name', 'last_name'])
      .execute();

    if (subscriptions.length === 0) {
      console.log('No phone numbers found in subscription table');
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Resource added successfully, but no subscriptions found' }),
      };
    }

    const truncatedBody = truncateText(body, 20); // Truncate body to 20 words

    console.log(`Sending SNS messages to ${subscriptions.length} subscribers...`);
    const snsPromises = subscriptions.map(({ phone, first_name, last_name }) => {
      const snsParams = {
        Message: `Hi ${first_name} ${last_name}!\n\nA new educational resource titled "${title}" has been posted: ${truncatedBody}\n\nFor more information: ${resource_url}`,
        PhoneNumber: phone,
      };

      return sns.publish(snsParams).promise();
    });

    await Promise.all(snsPromises);
    console.log('SNS messages sent successfully');

    return {
      statusCode: 201,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Resource added and notifications sent successfully' }),
    };
  } catch (error) {
    console.error('Error during operation:', error);
    const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to insert resource or send notifications', error: errorMessage }),
    };
  }
};
