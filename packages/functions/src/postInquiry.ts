import { APIGatewayProxyHandler } from 'aws-lambda';
import { SQL } from "./sql";

interface InquiryData {
    customer_id: number;
    inquiry_content: string;
}

export const handler: APIGatewayProxyHandler = async (event) => {
    if (!event.body) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'No data provided' }),
        };
    }
    
    // Parse the body to get inquiry data
    const { customer_id, inquiry_content }: InquiryData = JSON.parse(event.body);

    try {
        await SQL.DB
            .insertInto('inquiry')
            .values({
                customer_id: customer_id,
                inquiry_content: inquiry_content
            })
            .execute();

        return {
            statusCode: 201,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'Inquiry added successfully' }),
        };
    } catch (error) {
        console.error('Error during database operation:', error);
        const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to insert inquiry data', error: errorMessage }),
        };
    }
};
