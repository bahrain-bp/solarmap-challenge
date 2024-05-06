import { RDSData } from "@aws-sdk/client-rds-data";
import { RDS } from "sst/node/rds";
import { Kysely, Selectable } from "kysely";
import { DataApiDialect } from "kysely-data-api";
import type { Database } from "./sql.generated";

export const DB = new Kysely<Database>({
  dialect: new DataApiDialect({
    mode: "mysql",
    driver: {
      secretArn: RDS.ExistingDatabase.secretArn,
      resourceArn: RDS.ExistingDatabase.clusterArn,
      database: RDS.ExistingDatabase.defaultDatabaseName,
      client: new RDSData({}),
    },
  }),
});

export type Row = {
  [Key in keyof Database]: Selectable<Database[Key]>;
};

export * as SQL from "./sql";
