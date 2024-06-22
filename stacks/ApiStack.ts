// Import necessary constructs and stacks
import { CacheHeaderBehavior, CachePolicy } from "aws-cdk-lib/aws-cloudfront";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Duration } from "aws-cdk-lib/core";
import { Api, StackContext, use } from "sst/constructs";
import { AmazonLexSolarMapFulfillment } from "./AmazonLexSolarMapFulfillment";
import { DBStack } from "./DBStack";
import { DocumentProcessingStack } from "./DocumentProcessingStack";
import { EmailAPIStack } from "./EmailAPIStack";
import { ImgDetection } from "./ImgDetection";
import { AuthStack } from "./AuthStack";
import { WebSocketStack } from "./WebSocketStack";

// Define the ApiStack function
export function ApiStack(context: StackContext) {
    // Destructure the stack from the context parameter
    const { app, stack } = context;
    const { table } = use(WebSocketStack);

    // Retrieve resources from other stacks
    const documentProcessingStack = use(DocumentProcessingStack);
    const artifactsBucket = documentProcessingStack.artificatsBucket;

    const imgDetection = use(ImgDetection);
    const mapsBucket = imgDetection.bucket;


    const amazonLexSolarMapFulfillment = use(AmazonLexSolarMapFulfillment);
    const communicationFunction = amazonLexSolarMapFulfillment.communicationFunction;


    // Call the EmailAPIStack function to get the email API
    const { api: emailApi } = EmailAPIStack({ app, stack });
    
    // Call the AuthStack function to get the Auth API
    const {userPoolId, userPoolClientId} = use(AuthStack);

    // Retrieve the DB stack
    const { db } = use(DBStack);

    // Create the HTTP API
    const api = new Api(stack, "Api", {
        defaults: {
            function: {
                bind: [db, table],
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
            "POST /inquiry": "packages/functions/src/postInquiry.handler",
            "GET /inquiry": "packages/functions/src/fetchInquiry.handler",

            "GET /satelliteData": {
              function: {
                  handler: "packages/functions/src/getSatelliteData.handler",
                  permissions: [new PolicyStatement({
                    actions: ['s3:*'],
                    resources: ['arn:aws:s3:::aws-groundstation-s3dd-husain/*'],
                  })],
              }
          },
          

            "GET /testWebSocket": "packages/functions/src/testWebSocket.handler",
                      "POST /segmentedRooftop": "packages/functions/src/segmentedRooftop.handler",
              "PUT /consultants/{consultant_id}": "packages/functions/src/updateConsultant.handler",
                      "PUT /contractors/{contractor_id}": "packages/functions/src/updateContractor.handler",


          "PUT /resources/{resource_id}": "packages/functions/src/updateEduResources.handler",
            // Lambda function to send SNS SMS messages to subscribed users
            "POST /subscribe": "packages/functions/src/postSubscription.handler",
            "DELETE /unsubscribe": "packages/functions/src/deleteSubscription.handler",

            "POST /inquirycustomer": "packages/functions/src/postCustomerInquiry.handler",
            "GET /inquirycustomer": "packages/functions/src/fetchCustomerInquiry.handler",
            "POST /solarpanel": "packages/functions/src/postSolarPanels.handler",
            "GET /solarpanel": "packages/functions/src/fetchSolarPanels.handler",
            "DELETE /solarpanel/{solarpanel_id}": "packages/functions/src/deleteSolarPanels.handler",
            "PUT /solarpanel/{solarpanel_id}": "packages/functions/src/updateSolarPanels.handler",
            "POST /feedback": "packages/functions/src/postFeedback.handler",
            "GET /feedback": "packages/functions/src/fetchFeedback.handler",
            // TypeScript lambda function for MEWA bill document processing 
            // "POST /process-pdf": "packages/functions/src/process-pdf-lambda.handler",
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
            "POST /communicate": {
                cdk: {
                    function: communicationFunction,
                },
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
            "GET /calculatorUsage": {
                function: {
                    handler: "packages/functions/src/calcUsageStats.handler",
                    permissions: [new PolicyStatement({
                        actions: ['quicksight:*'],
                        resources: ['arn:aws:quicksight:*:*:namespace/default', 'arn:aws:quicksight:*:*:dashboard/60731b32-1883-450f-99e9-19af71b09054',
                            'arn:aws:quicksight:us-east-1:211125369004:topic/xonhtgcNUZJP5UsUTL6RtKQPgpQmPIV5'
                        ],

                    })],
                }
            },
            // Cognito functions for User Management
            "GET /users": {
                function: {
                  handler: "packages/functions/src/fetchAdmin.handler",
                  environment: {
                    USER_POOL_ID: userPoolId,
                    USER_POOL_CLIENT_ID: userPoolClientId,
                  },
                  permissions: [
                    new PolicyStatement({
                      actions: ["cognito-idp:ListUsers"],
                      resources: [`arn:aws:cognito-idp:${stack.region}:*:userpool/${userPoolId}`],
                    }),
                  ],
                },
              },
              "POST /users": {
                function: {
                  handler: "packages/functions/src/postAdmin.handler",
                  environment: {
                    USER_POOL_ID: userPoolId,
                  },
                  permissions: [
                    new PolicyStatement({
                      actions: ["cognito-idp:AdminCreateUser"],
                      resources: [`arn:aws:cognito-idp:${stack.region}:*:userpool/${userPoolId}`],
                    }),
                  ],
                },
              },
              "PUT /users": {
                function: {
                  handler: "packages/functions/src/updateAdmin.handler",
                  environment: {
                    USER_POOL_ID: userPoolId,
                  },
                  permissions: [
                    new PolicyStatement({
                      actions: ["cognito-idp:AdminUpdateUserAttributes"],
                      resources: [`arn:aws:cognito-idp:${stack.region}:*:userpool/${userPoolId}`],
                    }),
                  ],
                },
              },
              "DELETE /users": {
                function: {
                  handler: "packages/functions/src/deleteAdmin.handler",
                  environment: {
                    USER_POOL_ID: userPoolId,
                  },
                  permissions: [
                    new PolicyStatement({
                      actions: ["cognito-idp:AdminDeleteUser"],
                      resources: [`arn:aws:cognito-idp:${stack.region}:*:userpool/${userPoolId}`],
                    }),
                  ],
                },
              },
              "GET /getuser": {
                function: {
                  handler: "packages/functions/src/getUserDetails.handler",
                  environment: {
                    USER_POOL_ID: userPoolId,
                  },
                  permissions: [
                    new PolicyStatement({
                      actions: ["cognito-idp:GetUser"],
                      resources: [`arn:aws:cognito-idp:${stack.region}:*:userpool/${userPoolId}`],
                    }),
                  ],
                },
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
            //Add dashboardID and topicID in the resources
            "GET /statisticsSearchBar": {
                function: {
                    handler: "packages/functions/src/statisticsSearchBar.handler",
                    permissions: [new PolicyStatement({
                        actions: ['quicksight:*'],
                        resources: ['arn:aws:quicksight:*:*:namespace/default',
                            'arn:aws:quicksight:*:*:dashboard/60731b32-1883-450f-99e9-19af71b09054',
                            'arn:aws:quicksight:us-east-1:211125369004:topic/xonhtgcNUZJP5UsUTL6RtKQPgpQmPIV5',
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
