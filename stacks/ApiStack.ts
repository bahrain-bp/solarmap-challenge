import { Api, StackContext, use, Function, FunctionDefinition } from "sst/constructs";
import { DBStack } from "./DBStack";
import { CacheHeaderBehavior, CachePolicy } from "aws-cdk-lib/aws-cloudfront";
import { Duration } from "aws-cdk-lib/core";
import { DocumentProcessingStack } from "./DocumentProcessingStack";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { aws_lambda as lambda } from 'aws-cdk-lib';

export function ApiStack({ stack }: StackContext) {


    // const { table } = use(DBStack);
    const documentProcessingStack = use(DocumentProcessingStack);
    const artificatsBucket = documentProcessingStack.artificatsBucket;

    const samgeoLayer = new lambda.LayerVersion(stack, 'samgeoLayer', {
        layerVersionName: stack.stage + '-segment-geospatial',
        code: lambda.Code.fromAsset("packages/functions/map-instance-segmentation/python.zip"), // Assuming python.zip is in this directory
        compatibleRuntimes: [lambda.Runtime.PYTHON_3_11], // Specify compatible runtimes
        description: 'Samgeo Python Wheel Package', // Optional: Add a description for the layer
    });

    // Inside your ApiStack function
    const samgeoFunction = new lambda.Function(stack, 'SamgeoFunction', {
        runtime: lambda.Runtime.PYTHON_3_11, // Specify the Python 3.8 runtime
        code: lambda.Code.fromAsset("packages/functions/map-instance-segmentation"), // Assuming the Lambda handler code is in this directory
        handler: "samgeoAnalyze.lambda_handler", // Adjust the handler path as necessary
        memorySize: 1024,
        timeout: Duration.seconds(60),
        layers: [samgeoLayer],
    });

    // const samgeoFunction2 = new Function(stack, 'SamgeoFunction2', {
    //     runtime: "python3.12",
    //     handler: "packages/functions/map-instance-segmentation/samgeoAnalyze.lambda_handler",
    //     memorySize: 1024,
    //     timeout: "60 seconds",
    //     layers: [samgeoLayer],
    // });

    // const samgeoAnalyzeRoute = {
    //     function: samgeoFunction,
    // };

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

            // Add the new route here
            "POST /samgeoAnalyze": {
                cdk: {
                    function: samgeoFunction,
                } 
            },

                        
        }
    });

    // api.addRoute('POST', '/samgeoAnalyze', {
    //     function: samgeoFunction,
    // });

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
