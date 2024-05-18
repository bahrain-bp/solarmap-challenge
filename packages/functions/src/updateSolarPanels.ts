import { APIGatewayProxyHandler } from 'aws-lambda';
import { SQL } from "./dbConfig";

interface SolarPanelData {
    owner_name: string;
    installation_address: string;
    latitude: number;
    longitude: number;
    number_of_panel: number;
    installation_date: string;
}

export const handler: APIGatewayProxyHandler = async (event) => {
    const solarPanelId = event.pathParameters ? event.pathParameters.solarpanel_id : null;

    if (!solarPanelId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Solar panel ID is required' }),
        };
    }

    if (!event.body) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'No data provided' }),
        };
    }

    const {
        owner_name,
        installation_address,
        latitude,
        longitude,
        number_of_panel,
        installation_date
    }: SolarPanelData = JSON.parse(event.body);

    try {
        await SQL.DB
            .updateTable('solar_panels')
            .set({
                owner_name,
                installation_address,
                latitude,
                longitude,
                number_of_panel,
                installation_date
            })
            .where('solarpanel_id', '=', solarPanelId)
            .execute();

        console.log('Update successful');
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'Solar panel updated successfully' }),
        };
    } catch (error) {
        console.error('Error during database operation:', error);
        const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to update solar panel', error: errorMessage }),
        };
    }
};
