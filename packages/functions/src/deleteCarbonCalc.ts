import { APIGatewayProxyHandler } from 'aws-lambda';
import { SQL } from "./dbConfig";

export const handler: APIGatewayProxyHandler = async (event) => {
    const carbonFootprintId = event.pathParameters ? event.pathParameters.carbon_footprint_id : null;

    if (!carbonFootprintId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Carbon footprint calculation ID is required' }),
        };
    }
    
    try {
        await SQL.DB
            .deleteFrom('carbon_footprint_calculator')
            .where('carbon_footprint_id', '=', carbonFootprintId)
            .execute();

        console.log('Delete successful');
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'Carbon footprint deleted successfully' }),
        };
    } catch (error) {
        console.error('Error during database operation:', error);
        const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to delete Carbon footprint', error: errorMessage }),
        };
    }
};
