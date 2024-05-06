import { APIGatewayProxyHandler } from 'aws-lambda';
import { SQL } from "./sql";


export const handler: APIGatewayProxyHandler = async (event) => {
    try {

        const rows = await SQL.DB
            .selectFrom("contractor")
            .select([
                'contractor.contractor_id',
                'contractor.name',
                'contractor.level',
                'contractor.license_num',
                'contractor.fax',
                'contractor.contact_info'
            ])
            .execute();

        console.log('Query successful');

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(rows),
        };
    } catch (error) {
        console.error('Error during database operation:', error);
        
        const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
        
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to fetch contractors', error: errorMessage }),
        };
    }
}; 