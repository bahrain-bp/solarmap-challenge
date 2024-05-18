import { APIGatewayProxyHandler } from 'aws-lambda';
import { SQL } from "./dbConfig";

export const handler: APIGatewayProxyHandler = async (event) => {
    const adminId = event.pathParameters ? event.pathParameters.adminId : null;
    
    if (!adminId) {
        return {
            statusCode: 400,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: "AdminID is required" }),
        };
    }

    try {
        const result = await SQL.DB
        .deleteFrom("admin")
        .where("admin.admin_id", "=", adminId)
        .execute();

        console.log('Delete operation successful', result);

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: "Admin deleted successfully" }),
        };
    } catch (error) {
        console.error('Error during database operation:', error);
        
        const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
        
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'Failed to delete admin', error: errorMessage }),
        };
    }
};
