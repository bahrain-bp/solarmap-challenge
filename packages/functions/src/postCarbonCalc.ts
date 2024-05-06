import { APIGatewayProxyHandler } from 'aws-lambda';
import { SQL } from "./sql";

interface CarbonFootprintData {
    ecologicalFootprint: number;
}

export const handler: APIGatewayProxyHandler = async (event) => {
    if (!event.body) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'No data provided' }),
        };
    }
    
    const { ecologicalFootprint }: CarbonFootprintData = JSON.parse(event.body);

    try {
        await SQL.DB
            .insertInto('carbon_footprint_calculator')
            .values({
                ecological_footprint: ecologicalFootprint
            })
            .execute();

        return {
            statusCode: 201,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'Carbon footprint added successfully' }),
        };
    } catch (error) {
        console.error('Error during database operation:', error);
        const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to insert carbon footprint data', error: errorMessage }),
        };
    }
};
