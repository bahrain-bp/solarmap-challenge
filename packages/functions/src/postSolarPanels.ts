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
            .insertInto('solar_panels')
            .values({
                owner_name: ownerName,
                installation_address: installationAddress,
                installation_coord: installationCoord,
                number_of_panel: numberOfPanels,
                installation_date: installationDate
            })
            .execute();

        return {
            statusCode: 201,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'Solar panel data added successfully' }),
        };
    } catch (error) {
        console.error('Error during database operation:', error);
        const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to insert solar panel data', error: errorMessage }),
        };
    }
};
