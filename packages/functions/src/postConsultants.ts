import { APIGatewayProxyHandler } from 'aws-lambda';
import { SQL } from "./sql";

interface ConsultantData {
    name: string;
    level: string;
    crepNum: string;
    fax?: number; 
    contactInfo?: string; 
}

export const handler: APIGatewayProxyHandler = async (event) => {
    if (!event.body) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'No data provided' }),
        };
    }
    
    // Parse the body to get consultant data
    const { name, level, crepNum, fax, contactInfo }: ConsultantData = JSON.parse(event.body);

    try {
        await SQL.DB
            .insertInto('consultant')
            .values({
                name: name,
                level: level,
                crep_num: crepNum,
                fax: fax,
                contact_info: contactInfo
            })
            .execute();

        return {
            statusCode: 201,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'Consultant added successfully' }),
        };
    } catch (error) {
        console.error('Error during database operation:', error);
        const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to insert consultant data', error: errorMessage }),
        };
    }
};
