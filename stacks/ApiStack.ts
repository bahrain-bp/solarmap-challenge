import { Api, StackContext, use, Function } from "sst/constructs";
import { DBStack } from "./DBStack";
import { CacheHeaderBehavior, CachePolicy } from "aws-cdk-lib/aws-cloudfront";
import { Duration } from "aws-cdk-lib/core";
import { DocumentProcessingStack } from "./DocumentProcessingStack";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { ImgDetection } from "./ImgDetection";

export function ApiStack({ stack }: StackContext) {


    // const { table } = use(DBStack);
    const documentProcessingStack = use(DocumentProcessingStack);
    const artificatsBucket = documentProcessingStack.artificatsBucket;

    const imgDetection = use(ImgDetection);
    const mapsBucket = imgDetection.bucket;



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
            "GET /resources": "packages/functions/src/fetchEduResources.handler",
            "POST /resources": "packages/functions/src/postEduResources.handler",
            "DELETE /resources/{resource_id}": "packages/functions/src/deleteEduResources.handler",
            "GET /documents": "packages/functions/src/getDocumentsDetails.handler",

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
            "POST /detectionUpload": {
                function: {
                    handler: "packages/functions/src/imageDetectionUpload.handler",
                    permissions: [new PolicyStatement({
                        actions: ['s3:*'],
                        resources: [mapsBucket.bucketArn + '/*'],
                    })],
                    environment: {
                        BUCKET_NAME: mapsBucket.bucketName,
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
            "GET /BusinessDashboard": {
                function: {
                    handler: "packages/functions/src/AnonymousEmbedDashboardFunction.handler",
                    permissions: [new PolicyStatement({
                        actions: ['quicksight:*'],
                        resources: ['arn:aws:quicksight:*:*:namespace/default', 'arn:aws:quicksight:*:*:dashboard/8260f2dc-bd4e-4c32-b8ce-0b6568c824cf',
                            'arn:aws:quicksight:us-east-1:211125369004:topic/XUb6hHYJsspOO27IIwHYM2eEKi6bWL1n', 'arn:aws:quicksight:us-east-1:211125369004:topic/9z9ugAtwlWsNWdWDEJBU73Mtbo3j7RBF'
                        ],

                    })],
                }
            },
            "GET /BusinessQSearchBar": {
                function: {
                    handler: "packages/functions/src/AnonymousEmbedQSearchBarFunction.handler",
                    permissions: [new PolicyStatement({
                        actions: ['quicksight:*'],
                        resources: ['arn:aws:quicksight:*:*:namespace/default',
                            'arn:aws:quicksight:*:*:dashboard/8260f2dc-bd4e-4c32-b8ce-0b6568c824cf',
                            'arn:aws:quicksight:us-east-1:211125369004:topic/XUb6hHYJsspOO27IIwHYM2eEKi6bWL1n',
                            'arn:aws:quicksight:us-east-1:211125369004:topic/9z9ugAtwlWsNWdWDEJBU73Mtbo3j7RBF'
                        ],

                    })],
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
