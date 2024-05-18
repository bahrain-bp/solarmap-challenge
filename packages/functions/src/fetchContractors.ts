import { APIGatewayProxyHandler } from 'aws-lambda';
import { SQL } from "./dbConfig";

export const handler: APIGatewayProxyHandler = async (event) => {
    try {
        // Retrieve the level from the query string parameters
        const level = event.queryStringParameters?.level;

        let query = SQL.DB
            .selectFrom("contractor")
            .select([
                'contractor.contractor_id',
                'contractor.name',
                'contractor.level',
                'contractor.license_num',
                'contractor.fax',
                'contractor.contact_info'
            ]);

        if (level) { // Add a where clause if the level parameter is present
            query = query.where('contractor.level', '=', level);
        }

        const rows = await query.execute();

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
