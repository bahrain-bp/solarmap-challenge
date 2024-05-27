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
        let imageBlob = null;

        // Only process the image if it's provided
        if (resource_img) {
            // Convert base64 string to binary data
            imageBlob = Buffer.from(resource_img, 'base64');
        }

        // Get current date and time in Bahrain timezone
        const editedAt = moment().tz('Asia/Bahrain').format('YYYY-MM-DD HH:mm:ss');

        console.log('Updating educational resource in database...');
        const updateQuery = SQL.DB
            .updateTable('educational_resource')
            .set({
                title: title,
                body: body,
                resource_url: resource_url,
                editted_at: editedAt, // Storing the current date and time as edited_at
            })
            .where('resource_id', '=', resource_id);

        // Only update the image if it's provided
        if (imageBlob) {
            updateQuery.set({ resource_img: imageBlob });
        }

        await updateQuery.execute();
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
