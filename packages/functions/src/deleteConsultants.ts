import { APIGatewayProxyHandler } from 'aws-lambda';
import { SQL } from "./sql";

export const handler: APIGatewayProxyHandler = async (event) => {
    const consultantId = event.pathParameters ? event.pathParameters.consultant_id : null;

    if (!consultantId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Consultant ID is required' }),
        };
    }
    
    try {
        await SQL.DB
            .deleteFrom('consultant')
            .where('consultant_id', '=', consultantId)
            .execute();

        console.log('Delete successful');
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'Consultant deleted successfully' }),
        };
    } catch (error) {
        console.error('Error during database operation:', error);
        const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to delete Consultant', error: errorMessage }),
        };
    }
};
