import { APIGatewayProxyHandler } from 'aws-lambda';
import { SQL } from "./sql";

interface CombinedData {
    first_name: string;
    last_name: string;
    email: string;
    phone: number;
    inquiry_content: string;
}

export const handler: APIGatewayProxyHandler = async (event) => {
    if (!event.body) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'No data provided' }),
        };
    }
    
    // Parse the body to get combined data
    const { first_name, last_name, email, phone, inquiry_content }: CombinedData = JSON.parse(event.body);

    try {
        // Insert into the customer table
        await SQL.DB
            .insertInto('customer')
            .values({
                first_name: first_name,
                last_name: last_name,
                email: email,
                phone: phone
            })
            .execute();

        // Get the last inserted ID
        const result = await SQL.DB
            .selectFrom('customer')
            .select('customer_id')
            .orderBy('customer_id', 'desc')
            .limit(1)
            .execute();

        const customer_id = result[0].customer_id;

        // Insert into the inquiry table using the retrieved customer_id
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
            body: JSON.stringify({ message: 'Customer and inquiry added successfully' }),
        };
    } catch (error) {
        console.error('Error during database operation:', error);
        const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to insert data', error: errorMessage }),
        };
    }
};
