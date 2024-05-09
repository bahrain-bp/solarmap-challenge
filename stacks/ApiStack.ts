// Import necessary constructs and stacks
import { Api, StackContext, use } from "sst/constructs";
import { DBStack } from "./DBStack";
import { CacheHeaderBehavior, CachePolicy } from "aws-cdk-lib/aws-cloudfront";
import { Duration } from "aws-cdk-lib/core";
import { DocumentProcessingStack } from "./DocumentProcessingStack";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { ImgDetection } from "./ImgDetection";
import { EmailAPIStack } from "./EmailAPIStack";

// Define the ApiStack function
export function ApiStack(context: StackContext) {
    // Destructure the stack from the context parameter
    const { app, stack } = context;

    // Retrieve resources from other stacks
    const documentProcessingStack = use(DocumentProcessingStack);
    const artifactsBucket = documentProcessingStack.artificatsBucket;

    const imgDetection = use(ImgDetection);
    const mapsBucket = imgDetection.bucket;

    // Call the EmailAPIStack function to get the email API
    const { api: emailApi } = EmailAPIStack({ app, stack });

    // Retrieve the DB stack
    const { db } = use(DBStack);

    // Create the HTTP API
    const api = new Api(stack, "Api", {
        defaults: {
            function: {
                bind: [db],
            },
        },
        routes: {
            // Define API routes
            "POST /": "packages/functions/src/lambda.main",
            "GET /consultants": "packages/functions/src/fetchConsultants.handler",
            "GET /contractors": "packages/functions/src/fetchContractors.handler",
            "GET /resources": "packages/functions/src/fetchEduResources.handler",
            "GET /carboncalculator": "packages/functions/src/fetchCarbonCalc.handler",
            "POST /resources": "packages/functions/src/postEduResources.handler",
            "POST /carboncalculator": "packages/functions/src/postCarbonCalc.handler",
            "POST /consultants": "packages/functions/src/postConsultants.handler",
            "POST /contractors": "packages/functions/src/postContractors.handler",
            "DELETE /resources/{resource_id}": "packages/functions/src/deleteEduResources.handler",
            "DELETE /carboncalculator/{carbon_footprint_id}": "packages/functions/src/deleteCarbonCalc.handler",
            "DELETE /consultants/{consultant_id}": "packages/functions/src/deleteConsultants.handler",
            "DELETE /contractors/{contractor_id}": "packages/functions/src/deleteContractor.handler",
            "GET /documents": "packages/functions/src/getDocumentsDetails.handler",
            "POST /postcalculation": "packages/functions/src/postCalculation.handler",
            "GET /postcalculation": "packages/functions/src/fetchCalculations.handler",
            "GET /customer": "packages/functions/src/fetchCustomer.handler",
            "POST /customer": "packages/functions/src/postCustomer.handler",
            "DELETE /customer/{customer_id}": "packages/functions/src/deleteCustomer.handler",
            "POST /inquiry": "packages/functions/src/postInquiry.handler",
            "GET /inquiry": "packages/functions/src/fetchInquiry.handler",

            "POST /inquirycustomer": "packages/functions/src/postCustomerInquiry.handler",
            "GET /inquirycustomer": "packages/functions/src/fetchCustomerInquiry.handler",
            // Adjusted route for sending emails

            "POST /send-email": {
                function: {
                    handler: "packages/functions/src/send-email.sendEmail",
                    permissions: [new PolicyStatement({
                        actions: ['ses:SendEmail'], // Add the necessary SES action here
                        resources: ['*'], // You may need to specify the resource ARN if you want to restrict it
                    })],
                }
            },
            

            // Define routes for document upload and image detection
            "POST /upload": {
                function: {
                    handler: "packages/functions/src/document-upload-s3.handler",
                    permissions: [new PolicyStatement({
                        actions: ['s3:*'],
                        resources: [artifactsBucket.bucketArn + '/*'],
                    })],
                    environment: {
                        BUCKET_NAME: artifactsBucket.bucketName,
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
            // Define routes for QuickSight integration
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

    // Define cache policy for API

    api.attachPermissions("*");


    // cache policy to use with cloudfront as reverse proxy to avoid cors
    // https://dev.to/larswww/real-world-serverless-part-3-cloudfront-reverse-proxy-no-cors-cgj
    const apiCachePolicy = new CachePolicy(stack, "CachePolicy", {
        minTtl: Duration.seconds(0),
        defaultTtl: Duration.seconds(0),
        headerBehavior: CacheHeaderBehavior.allowList(
            "Accept",
            "Authorization",
            "Content-Type",
            "Referer"
        ),
    });

    // Return the API, cache policy, and email API
    return { api, apiCachePolicy, emailApi };
}
