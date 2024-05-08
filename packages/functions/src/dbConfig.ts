import { RDSData } from "@aws-sdk/client-rds-data";
import { RDS } from "sst/node/rds";
import { StackContext, use } from "sst/constructs";
import { Kysely, Selectable } from "kysely";
import { DataApiDialect } from "kysely-data-api";
import { DBStack } from "../../../stacks/DBStack"
// @ts-ignore
import type { Database } from "./sql.generated";

const stage = use(DBStack).state;

const isProd = stage === 'prod'; // Check if the stage is 'prod'

export const DB = new Kysely<Database>({
  dialect: new DataApiDialect({
    mode: "mysql",
    driver: {
      // @ts-ignore
      secretArn: isProd ? RDS.MainDatabase.secretArn : RDS.ExistingDatabase.secretArn,
      // @ts-ignore
      resourceArn: isProd ? RDS.MainDatabase.clusterArn : RDS.ExistingDatabase.clusterArn,
      // @ts-ignore
      database: isProd ? RDS.MainDatabase.defaultDatabaseName : RDS.ExistingDatabase.defaultDatabaseName,
      client: new RDSData({}),
    },
  }),
});

export type Row = {
  [Key in keyof Database]: Selectable<Database[Key]>;
};

export * as SQL from "./dbConfig";