import { APIGatewayProxyHandler } from 'aws-lambda';
import { SQL } from "./dbConfig";

export const handler: APIGatewayProxyHandler = async (event) => {
    try {
        // Use 'calculation_id' as it is the auto-increment primary key
        const rows = await SQL.DB
            .selectFrom("solarpanelcalculation")
            .select([
                'solarpanelcalculation.calculation_id',
                'solarpanelcalculation.number_of_panels',
                'solarpanelcalculation.total_cost',
                'solarpanelcalculation.roi_percentage',
                'solarpanelcalculation.payback_period'
            ])
            .orderBy('solarpanelcalculation.calculation_id', 'desc') // Corrected to use 'calculation_id'
            .limit(1) // Limit to only the most recent record
            .execute();

        console.log('Query successful');

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(rows[0]), // Return the first (and only) item in the array
        };
    } catch (error) {
        console.error('Error during database operation:', error);

        const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';

        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to fetch solar panel calculations', error: errorMessage }),
        };
    }
};
