import { APIGatewayProxyHandler } from 'aws-lambda';
import { SQL } from "./dbConfig";

export const handler: APIGatewayProxyHandler = async (event) => {
    const contractorId = event.pathParameters ? event.pathParameters.contractor_id : null;

    if (!contractorId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Contractor ID is required' }),
        };
    }
    
    try {
        await SQL.DB
            .deleteFrom('contractor')
            .where('contractor_id', '=', contractorId)
            .execute();

        console.log('Delete successful');
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'Contractor deleted successfully' }),
        };
    } catch (error) {
        console.error('Error during database operation:', error);
        const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to delete Contractor', error: errorMessage }),
        };
    }
};
