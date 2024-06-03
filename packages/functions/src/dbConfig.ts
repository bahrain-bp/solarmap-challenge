import { RDSData } from "@aws-sdk/client-rds-data";
import { Kysely, Selectable } from "kysely";
import { DataApiDialect } from "kysely-data-api";
import { RDS } from "sst/node/rds";
// @ts-ignore
import type { Database } from "./sql.generated";


export const DB = new Kysely<Database>({
  dialect: new DataApiDialect({
    mode: "mysql",
    driver: {
      // @ts-ignore
      secretArn: RDS.ExistingDatabase.secretArn,
      // @ts-ignore
      resourceArn: RDS.ExistingDatabase.clusterArn,
      // @ts-ignore
      database: RDS.ExistingDatabase.defaultDatabaseName,
      client: new RDSData({}),
    },
  }),
});

export type Row = {
  [Key in keyof Database]: Selectable<Database[Key]>;
};

export * as SQL from "./dbConfig";

