import { APIGatewayProxyHandler } from 'aws-lambda';
import { use } from "sst/constructs"
import { DB } from "./sql";

export async function handler() {
    try {

        const rows = await DB
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