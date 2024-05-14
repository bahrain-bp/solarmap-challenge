import { APIGatewayProxyHandler } from 'aws-lambda';
import { SQL } from "./dbConfig";

interface SolarPanelData {
    ownerName: string;
    installationAddress: string;
    installationCoord: string;
    numberOfPanels: number;
    installationDate: string;
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
        ownerName,
        installationAddress,
        installationCoord,
        numberOfPanels,
        installationDate
    }: SolarPanelData = JSON.parse(event.body);

    try {
        await SQL.DB
            .updateTable('solar_panels')
            .set({
                owner_name: ownerName,
                installation_address: installationAddress,
                installation_coord: installationCoord,
                number_of_panel: numberOfPanels,
                installation_date: installationDate
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
