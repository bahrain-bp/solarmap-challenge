import { APIGatewayProxyHandler } from 'aws-lambda';
import { SQL } from "./dbConfig";

interface CustomerData {
    first_name: string;
    last_name: string;
    email: string;
    phone: number; 
}

export const handler: APIGatewayProxyHandler = async (event) => {
    if (!event.body) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'No data provided' }),
        };
    }
    
    // Parse the body to get customer data
    const { first_name, last_name, email, phone }: CustomerData = JSON.parse(event.body);

    try {
        await SQL.DB
            .insertInto('customer')
            .values({
                first_name: first_name,
                last_name: last_name,
                email: email,
                phone: phone
            })
            .execute();

        return {
            statusCode: 201,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'Customer added successfully' }),
        };
    } catch (error) {
        console.error('Error during database operation:', error);
        const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to insert customer data', error: errorMessage }),
        };
    }
};
