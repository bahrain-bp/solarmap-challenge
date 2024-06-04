import { APIGatewayProxyHandler } from 'aws-lambda';
import { SQL } from "./dbConfig";

export const handler: APIGatewayProxyHandler = async (event) => {
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'No body provided' }),
    };
  }

  const { consultant_id, name, level, crep_num, fax, contact_info } = JSON.parse(event.body);

  // Validate required fields
  if (!consultant_id || !name || !level || !crep_num || !contact_info) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Consultant ID, name, level, CREP number, and contact information are required' }),
    };
  }

  try {
    console.log('Updating consultant in database...');
    await SQL.DB
      .updateTable('consultant')
      .set({
        name: name,
        level: level,
        crep_num: crep_num,
        fax: fax,
        contact_info: contact_info
      })
      .where('consultant_id', '=', consultant_id)
      .execute();

    console.log('Consultant update successful');

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Consultant updated successfully' }),
    };
  } catch (error) {
    console.error('Error during database operation:', error);
    const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to update consultant', error: errorMessage }),
    };
  }
};
