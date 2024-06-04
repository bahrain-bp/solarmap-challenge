import { APIGatewayProxyHandler } from 'aws-lambda';
import { SQL } from './dbConfig';
import AWS from 'aws-sdk';

const sns = new AWS.SNS();

export const handler: APIGatewayProxyHandler = async (event) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    
    if (!event.body) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'No body provided' }),
        };
    }

    let phone;
    try {
        ({ phone } = JSON.parse(event.body));
    } catch (error) {
        console.error('Invalid JSON in the request body:', error);
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Invalid JSON' }),
        };
    }

    if (!phone) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Phone is required' }),
        };
    }

    // Validate phone number format (+973 followed by 8 digits)
    if (!/^\+973\d{8}$/.test(phone)) {
        console.error('Invalid phone number format:', phone);
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Phone number must be in the format +973 followed by 8 digits' }),
        };
    }

    try {
        // Check if the phone number exists
        const result = await SQL.DB
            .selectFrom('subscription')
            .selectAll()
            .where('phone', '=', phone)
            .execute();

        if (result.length === 0) {
            console.warn('Phone number does not exist:', phone);
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'Phone number does not exist' }),
            };
        }

        // Delete the phone number if it exists
        await SQL.DB
            .deleteFrom('subscription')
            .where('phone', '=', phone)
            .execute();

        console.log('Deleted subscription for phone number:', phone);

        // Send SMS notification
        const params = {
            Message: 'You have been unsubscribed from the newsletter.',
            PhoneNumber: phone,
        };

        await sns.publish(params).promise();

        console.log('SMS sent to phone number:', phone);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Unsubscribed successfully' }),
        };
    } catch (error) {
        console.error('Error during unsubscribe operation:', error);

        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to unsubscribe', error }),
        };
    }
};
