import { SQL } from "./dbConfig";

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
    // Fetch the data including the image URL
    const rows = await SQL.DB
      .selectFrom('educational_resource')
      .select([
        'resource_id',
        'title',
        'body',
        'resource_url',
        'resource_img',  // Retrieve the image URL directly
        'created_at', 
        'editted_at'
      ])
      .execute();

    console.log('Query successful', rows);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Adjust the origin according to your CORS policy
      },
      body: JSON.stringify(rows),
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
