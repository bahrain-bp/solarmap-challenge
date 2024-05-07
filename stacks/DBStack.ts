import { Table, StackContext, RDS } from "sst/constructs";
import * as rds from "aws-cdk-lib/aws-rds";
import * as secretsManager from "aws-cdk-lib/aws-secretsmanager";
import * as path from 'path';
import { Fn } from "aws-cdk-lib";

export function DBStack({ stack, app }: StackContext) {
    // Create a DynamoDB table
    const table = new Table(stack, "Counter", {
        fields: {
            counter: "string",
        },
        primaryIndex: { partitionKey: "counter" },
    });

    const mainDBLogicalName = "MainDatabase";
    const dbSecretArnOutputName = "DBSecretArn";
    const dbClusterIdentifierOutputName = "DBClusterIdentifier";

    let db: RDS;

    if (app.stage == "prod") {
        db = new RDS(stack, mainDBLogicalName, {
            engine: "mysql5.7",
            defaultDatabaseName: "maindb",
            migrations: [".", "packages", "db-migrations"].join(path.sep),
        });
            // Export db secret arn and cluster identifier to be used by other stages
    stack.addOutputs({
        [dbSecretArnOutputName]: {
            value: db.secretArn,
            exportName: dbSecretArnOutputName,
        },
        [dbClusterIdentifierOutputName]: {
            value: db.clusterIdentifier,
            exportName: dbClusterIdentifierOutputName,
        },
    });
    } else {
        const existing_secret = secretsManager.Secret.fromSecretCompleteArn(stack, "ExistingSecret", Fn.importValue(dbSecretArnOutputName));
        db = new RDS(stack, "ExistingDatabase", {
            engine: "mysql5.7",
            defaultDatabaseName: "maindb",
            migrations: [".", "packages", "db-migrations"].join(path.sep),
            cdk: {
                cluster: rds.ServerlessCluster.fromServerlessClusterAttributes(stack, "ExistingCluster", {
                    clusterIdentifier: Fn.importValue(dbClusterIdentifierOutputName),
                    secret: existing_secret,
                }),
                secret: existing_secret,
            },
        });
    }



    return { db };
}
