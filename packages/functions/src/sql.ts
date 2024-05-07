import { RDSData } from "@aws-sdk/client-rds-data";
import { Kysely, Selectable } from "kysely";
import { DataApiDialect } from "kysely-data-api";
import fetchStackOutputs from './fetchStackOutputs'; // Import the helper function
// @ts-ignore
import type { Database } from "./sql.generated";

// Define a global variable or use a better state management approach depending on your application architecture
let DB: Kysely<Database>;

const initializeDatabase = async () => {
    const stackName = "YourStackName"; // Replace with your actual stack name
    const outputs = await fetchStackOutputs(stackName);
    const secretArn = outputs["DBSecretArn"];
    const clusterArn = outputs["DBClusterIdentifier"];

    DB = new Kysely<Database>({
        dialect: new DataApiDialect({
            mode: "mysql",
            driver: {
                secretArn,
                resourceArn: clusterArn,
                database: "maindb", // Ensure this is correctly set up in your stack or fetched similarly
                client: new RDSData({}),
            },
        }),
    });
};

initializeDatabase();

export { DB };

export type Row = {
  [Key in keyof Database]: Selectable<Database[Key]>;
};

export * as SQL from "./sql";