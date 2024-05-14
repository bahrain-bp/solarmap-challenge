import { APIGatewayProxyHandler } from 'aws-lambda';
import { SQL } from "./dbConfig";

export const handler: APIGatewayProxyHandler = async (event) => {
    try {
        const rows = await SQL.DB
            .selectFrom("solar_panels")
            .select([
                'solar_panels.solarpanel_id',
                'solar_panels.owner_name',
                'solar_panels.installation_address',
                'solar_panels.installation_coord',
                'solar_panels.number_of_panel',
                'solar_panels.installation_date'
            ])
            .execute();

        console.log('Query successful');

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(rows),
        };
    } catch (error) {
        console.error('Error during database operation:', error);
        
        const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
        
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to fetch solar panel data', error: errorMessage }),
        };
    }
}; 
