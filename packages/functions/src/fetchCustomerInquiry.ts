import { APIGatewayProxyHandler } from 'aws-lambda';
import { SQL } from "./sql";

export const handler: APIGatewayProxyHandler = async (event) => {
    try {
        const inquiries = await SQL.DB
            .selectFrom('inquiry')
            .innerJoin('customer', 'customer.customer_id', 'inquiry.customer_id')
            .select([
                'customer.first_name',
                'customer.last_name',
                'customer.email',
                'customer.phone',
                'inquiry.inquiry_content'
            ])
            .execute();

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(inquiries),
        };
    } catch (error) {
        console.error('Error during database operation:', error);
        const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to fetch inquiries', error: errorMessage }),
        };
    }
};
