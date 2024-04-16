import { APIGatewayProxyHandler } from 'aws-lambda';
import { SQL } from "./sql";

export const handler: APIGatewayProxyHandler = async (event) => {
    try {
        const rows = await SQL.DB
            .selectFrom("educational_resource")
            .select([
                'educational_resource.resource_id',
                'educational_resource.title',
                'educational_resource.body',
                'educational_resource.resource_url',
                'educational_resource.resource_img' 
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
            body: JSON.stringify({ message: 'Failed to fetch educational resources', error: errorMessage }),
        };
    }
};
