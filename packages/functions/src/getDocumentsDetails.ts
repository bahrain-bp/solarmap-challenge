import { SQL } from "./sql";

export async function handler(event: any) {
    try {
        const rows = await SQL.DB
            .selectFrom("ewabill")
            .select([
                'ewabill.bill_id',
                'ewabill.issue_date',
                'ewabill.electricity_supply',
                'ewabill.rate',
                'ewabill.usage',
                'ewabill.bill_address',
                'ewabill.subsidised'
            ])
            .execute();

        console.log('Query successful');

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify(rows),
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