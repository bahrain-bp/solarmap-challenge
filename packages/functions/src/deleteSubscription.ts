import { APIGatewayProxyHandler } from 'aws-lambda';
import { SQL } from './dbConfig';

export const handler: APIGatewayProxyHandler = async (event) => {
    if (!event.body) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'No body provided' }),
        };
    }

    const { phone } = JSON.parse(event.body);

    if (!phone) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Phone is required' }),
        };
    }

    try {
        // Check if the phone number exists
        const result = await SQL.DB
            .selectFrom('subscription')
            .selectAll()
            .where('phone', '=', phone)
            .execute();

        if (result.length === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'Phone number does not exist' }),
            };
        }

        // Delete the phone number if it exists
        await SQL.DB
            .deleteFrom('subscription')
            .where('phone', '=', phone)
            .execute();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Unsubscribed successfully' }),
        };
    } catch (error) {
        console.error('Error during database operation:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to unsubscribe', error }),
        };
    }
};
