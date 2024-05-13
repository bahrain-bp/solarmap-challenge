import { APIGatewayProxyHandler } from 'aws-lambda';
import { SQL } from "./dbConfig";

export const handler: APIGatewayProxyHandler = async (event) => {
    const customerId = event.pathParameters ? event.pathParameters.customer_id : null;

    if (!customerId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'customer ID is required' }),
        };
    }
    
    try {
        await SQL.DB
            .deleteFrom('customer')
            .where('customer_id', '=', customerId)
            .execute();

        console.log('Delete successful');
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'customer deleted successfully' }),
        };
    } catch (error) {
        console.error('Error during database operation:', error);
        const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to delete customer', error: errorMessage }),
        };
    }
};
