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
    if (!event.body) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'No data provided' }),
        };
    }
    
    try {
        const { owner_name, installation_address, latitude, longitude, number_of_panel, installation_date }: SolarPanelData = JSON.parse(event.body);

        await SQL.DB
            .insertInto('solar_panels')
            .values({
                owner_name,
                installation_address,
                latitude,
                longitude,
                number_of_panel,
                installation_date
            })
            .execute();

        return {
            statusCode: 201,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'Solar panel added successfully' }),
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
