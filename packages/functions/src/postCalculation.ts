import { APIGatewayProxyHandler } from 'aws-lambda';
import { SQL } from "./dbConfig";

interface SolarPanelData {
    numberOfPanels: number;
    totalCost: number;
    roiPercentage: number;
    paybackPeriod: number;
}

export const handler: APIGatewayProxyHandler = async (event) => {
    if (!event.body) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'No data provided' }),
        };
    }
    
    const {
        numberOfPanels,
        totalCost,
        roiPercentage,
        paybackPeriod
    }: SolarPanelData = JSON.parse(event.body);

    try {
        await SQL.DB
            .insertInto('solarpanelcalculation')
            .values({
                number_of_panels: numberOfPanels,
                total_cost: totalCost,
                roi_percentage: roiPercentage,
                payback_period: paybackPeriod
            })
            .execute();

        return {
            statusCode: 201,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'Solar panel calculation added successfully' }),
        };
    } catch (error) {
        console.error('Error during database operation:', error);
        const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to insert solar panel calculation data', error: errorMessage }),
        };
    }
};
