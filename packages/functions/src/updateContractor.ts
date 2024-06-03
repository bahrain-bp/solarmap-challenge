import { APIGatewayProxyHandler } from 'aws-lambda';
import { SQL } from "./dbConfig";

export const handler: APIGatewayProxyHandler = async (event) => {
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'No body provided' }),
    };
  }

  const { contractor_id, name, level, license_num, fax, contact_info } = JSON.parse(event.body);

  // Validate required fields
  if (!contractor_id || !name || !level || !license_num || !contact_info) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Contractor ID, name, level, license number, and contact information are required' }),
    };
  }

  try {
    console.log('Updating contractor in database...');
    await SQL.DB
      .updateTable('contractor')
      .set({
        name: name,
        level: level,
        license_num: license_num,
        fax: fax,
        contact_info: contact_info
      })
      .where('contractor_id', '=', contractor_id)
      .execute();

    console.log('Contractor update successful');

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Contractor updated successfully' }),
    };
  } catch (error) {
    console.error('Error during database operation:', error);
    const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to update contractor', error: errorMessage }),
    };
  }
};
