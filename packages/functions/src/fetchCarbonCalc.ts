import { APIGatewayProxyHandler } from 'aws-lambda';
import { SQL } from "./sql";

export const handler: APIGatewayProxyHandler = async (event) => {
    try {
        const rows = await SQL.DB
            .selectFrom("carbon_footprint_calculator")
            .select([
                'carbon_footprint_calculator.carbon_footprint_id',
                'carbon_footprint_calculator.ecological_footprint',

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
            body: JSON.stringify({ message: 'Failed to fetch ecological footprints', error: errorMessage }),
        };
    }
}; 
