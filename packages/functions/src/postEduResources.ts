import { APIGatewayProxyHandler } from 'aws-lambda';
import { SQL } from "./dbConfig";

let hasRun = false; // Flag variable to ensure the code runs only once

export const handler: APIGatewayProxyHandler = async (event) => {
    
    if (!event.body) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'No resource data provided' }),
        };
    }
    
    const { title, body, resource_url, resource_img } = JSON.parse(event.body as string);

    try {
        let imageBlob = null;

        // Only process the image if it's provided
        if (resource_img) {
            // Convert base64 string to binary data
            imageBlob = Buffer.from(resource_img, 'base64');
        }

        // Assuming SQL.DB is configured and connected
        await SQL.DB
            .insertInto('educational_resource')
            .values({
                title: title,
                body: body,
                resource_url: resource_url,
                resource_img: imageBlob  // Storing the BLOB directly in the database
            })
            .execute();

        console.log('Insert successful');
        return {
            statusCode: 201,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'Resource added successfully' }),
        };
    } catch (error) {
        console.error('Error during operation:', error);
        const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to insert educational resource', error: errorMessage }),
        };
    }
};
