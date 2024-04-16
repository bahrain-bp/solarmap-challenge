import { SQL } from "./sql";

// Define a TypeScript type for the function response
interface GetEduResponse {
  statusCode: number;
  headers: {
    [key: string]: string;
  };
  body: string;
}

export async function handler(): Promise<GetEduResponse> {
  try {
    // Fetch the data without converting the image
    const rows = await SQL.DB
      .selectFrom('educational_resource')
      .select([
        'resource_id',
        'title',
        'body',
        'resource_url',
        'resource_img'  // Retrieve the binary image data directly
      ])
      .execute();

    // Convert binary image data to Base64 string if it exists
    const convertedRows = rows.map(row => ({
      ...row,
      resource_img: row.resource_img ? Buffer.from(row.resource_img).toString('base64') : null
    }));

    console.log('Query successful', convertedRows);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Adjust the origin according to your CORS policy
      },
      body: JSON.stringify(convertedRows),
    };
  } catch (error) {
    console.error('Error during database operation:', error);

    const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: 'Failed to fetch educational resources', error: errorMessage }),
    };
  }
}
