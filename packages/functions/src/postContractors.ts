import { APIGatewayProxyHandler } from 'aws-lambda';
import { SQL } from "./dbConfig";

interface ContractorData {
    name: string;
    level: string;
    license_num: string;
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
    
    // Parse the body to get contractor data
    const { name, level, license_num, fax, contactInfo }: ContractorData = JSON.parse(event.body);

    try {
        await SQL.DB
            .insertInto('contractor')
            .values({
                name: name,
                level: level,
                license_num: license_num,
                fax: fax,
                contact_info: contactInfo
            })
            .execute();

        return {
            statusCode: 201,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'Contractor added successfully' }),
        };
    } catch (error) {
        console.error('Error during database operation:', error);
        const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to insert contractor data', error: errorMessage }),
        };
    }
};
