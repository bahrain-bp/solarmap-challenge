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
                'solar_panels.latitude',
                'solar_panels.longitude',
                'solar_panels.number_of_panel',
                'solar_panels.installation_date'
            ])
            .execute();

        console.log('Query successful');

        // Format the response
        const formattedRows = rows.map(row => ({
            solarpanel_id: row.solarpanel_id,
            owner_name: row.owner_name,
            installation_address: row.installation_address,
            latitude: parseFloat(row.latitude),
            longitude: parseFloat(row.longitude),
            number_of_panel: row.number_of_panel,
            installation_date: row.installation_date
        }));

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formattedRows),
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
