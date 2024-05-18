import { APIGatewayProxyHandler } from 'aws-lambda';
import { SQL } from "./dbConfig";

export const handler: APIGatewayProxyHandler = async (event) => {
    const solarPanelId = event.pathParameters ? event.pathParameters.solarpanel_id : null;

    if (!solarPanelId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Solar panel ID is required' }),
        };
    }
    
    try {
        await SQL.DB
            .deleteFrom('solar_panels')
            .where('solarpanel_id', '=', solarPanelId)
            .execute();

        console.log('Delete successful');
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'Solar panel deleted successfully' }),
        };
    } catch (error) {
        console.error('Error during database operation:', error);
        const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to delete solar panel', error: errorMessage }),
        };
    }
};
