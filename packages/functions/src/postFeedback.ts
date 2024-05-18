import { APIGatewayProxyHandler } from 'aws-lambda';
import { SQL } from "./dbConfig";

interface FeedbackData {
    feedback_content: string;
}

export const handler: APIGatewayProxyHandler = async (event) => {
    if (!event.body) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'No data provided' }),
        };
    }

    // Parse the body to get feedback data
    const { feedback_content }: FeedbackData = JSON.parse(event.body);

    try {
        await SQL.DB
            .insertInto('feedback')
            .values({
                feedback_content: feedback_content
            })
            .execute();

        return {
            statusCode: 201,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'Feedback added successfully' }),
        };
    } catch (error) {
        console.error('Error during database operation:', error);
        const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to insert feedback data', error: errorMessage }),
        };
    }
};
