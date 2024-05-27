import { APIGatewayProxyHandler } from 'aws-lambda';
import { SQL } from "./dbConfig";

export const handler: APIGatewayProxyHandler = async (event) => {
    try {
        // Retrieve the level from the query string parameters
        const level = event.queryStringParameters?.level;

        let query = SQL.DB
            .selectFrom("consultant")
            .select([
                'consultant.consultant_id',
                'consultant.name',
                'consultant.level',
                'consultant.crep_num',
                'consultant.fax',
                'consultant.contact_info'
            ]);

        if (level) { // Add a where clause if the level parameter is present
            query = query.where('consultant.level', '=', level);
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
            body: JSON.stringify({ message: 'Failed to fetch consultants', error: errorMessage }),
        };
    }
}; 
