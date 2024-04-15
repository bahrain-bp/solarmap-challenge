import { APIGatewayProxyHandler } from 'aws-lambda';
import { SQL } from "./sql";

export const handler: APIGatewayProxyHandler = async (event) => {
    const resourceId = event.pathParameters ? event.pathParameters.resource_id : null;

    if (!resourceId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Resource ID is required' }),
        };
    }
    
    try {
        await SQL.DB
            .deleteFrom('educational_resource')
            .where('resource_id', '=', resourceId)
            .execute();

        console.log('Delete successful');
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'Resource deleted successfully' }),
        };
    } catch (error) {
        console.error('Error during database operation:', error);
        const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to delete educational resource', error: errorMessage }),
        };
    }
};
