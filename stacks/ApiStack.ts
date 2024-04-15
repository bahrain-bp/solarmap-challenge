import { Api, StackContext, use, Function } from "sst/constructs";
import { DBStack } from "./DBStack";
import { CacheHeaderBehavior, CachePolicy } from "aws-cdk-lib/aws-cloudfront";
import { Duration } from "aws-cdk-lib/core";
import { DocumentProcessingStack } from "./DocumentProcessingStack";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";

export function ApiStack({ stack }: StackContext) {
   

    const { table } = use(DBStack);
    const documentProcessingStack = use(DocumentProcessingStack);
    const artificatsBucket = documentProcessingStack.artificatsBucket;


    const { db } = use(DBStack);
    // Create the HTTP API
    const api = new Api(stack, "Api", {
        defaults: {
            function: {
                bind: [db],
                
            },
        },
        routes: {
            // Sample TypeScript lambda function
            "POST /": "packages/functions/src/lambda.main",
            "GET /consultants": "packages/functions/src/fetchConsultants.handler",
            "GET /contractors": "packages/functions/src/fetchContractors.handler",
            // TypeScript lambda function for MEWA bill document processing 
            // "POST /process-pdf": "packages/functions/src/process-pdf-lambda.handler",
            "POST /upload": {
                function: {
                    handler: "packages/functions/src/document-upload-s3.handler",
                    permissions: [new PolicyStatement({
                        actions: ['s3:*'],
                        resources: [artificatsBucket.bucketArn + '/*'],
                    })],
                    environment: {
                        BUCKET_NAME: artificatsBucket.bucketName,
                    }
                }
            },
            // Sample Pyhton lambda function
            "GET /": {
                function: {
                    handler: "packages/functions/src/sample-python-lambda/lambda.main",
                    runtime: "python3.11",
                    timeout: "60 seconds",
                }
            },
        }
    });


    // cache policy to use with cloudfront as reverse proxy to avoid cors
    // https://dev.to/larswww/real-world-serverless-part-3-cloudfront-reverse-proxy-no-cors-cgj
    const apiCachePolicy = new CachePolicy(stack, "CachePolicy", {
        minTtl: Duration.seconds(0), // no cache by default unless backend decides otherwise
        defaultTtl: Duration.seconds(0),
        headerBehavior: CacheHeaderBehavior.allowList(
            "Accept",
            "Authorization",
            "Content-Type",
            "Referer"
        ),
    });

    return { api, apiCachePolicy }
}
