import { APIGatewayProxyHandler } from 'aws-lambda';
import { SQL } from "./dbConfig";
import moment from 'moment-timezone';

export const handler: APIGatewayProxyHandler = async (event) => {
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'No body provided' }),
    };
  }

  const { resource_id, title, body, resource_url, resource_img } = JSON.parse(event.body);

  // Validate required fields
  if (!resource_id || !title || !body || !resource_url) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Resource ID, title, body, and resource URL are required' }),
    };
  }

  try {
    // Get current date and time in Bahrain timezone
    const editedAt = moment().tz('Asia/Bahrain').format('YYYY-MM-DD HH:mm:ss');

    console.log('Updating educational resource in database...');
    await SQL.DB
      .updateTable('educational_resource')
      .set({
        title: title,
        body: body,
        resource_url: resource_url,
        resource_img: resource_img, // Update with the image URL
        editted_at: editedAt, // Storing the current date and time as edited_at
      })
      .where('resource_id', '=', resource_id)
      .execute();

    console.log('Educational resource update successful');

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Resource updated successfully' }),
    };
  } catch (error) {
    console.error('Error during database operation:', error);
    const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to update educational resource', error: errorMessage }),
    };
  }
};
