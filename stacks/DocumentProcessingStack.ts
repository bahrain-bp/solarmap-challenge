import { Function, Bucket, Queue, StackContext, use } from "sst/constructs";
import * as iam from 'aws-cdk-lib/aws-iam';
import { DBStack } from "./DBStack";
import { Duration } from "aws-cdk-lib";
import { WebSocketStack } from "./WebSocketStack";
import { filter } from "lodash";


export function DocumentProcessingStack({ stack }: StackContext) {
    
    const { table } = use(WebSocketStack);
    const { db } = use(DBStack);
    
    const filterFunction = new Function(stack, "filterFunction", { handler: "packages/functions/src/filter-pdf-lambda.handler",
    timeout: "120 seconds", memorySize: 256, retryAttempts: 0, /*runtime: "python3.11"*/});

    filterFunction.bind([db, table]);
    
    const filterQueue = new Queue(stack, "Filter-Queue", {
        consumer: filterFunction,
        cdk: {
            queue: {
                 fifo: true,
                 contentBasedDeduplication: true,
                queueName: stack.stage + '-queue-for-filter.fifo',
                visibilityTimeout: Duration.seconds(120),
            },
        },
    });

    filterFunction.attachPermissions("*");
    

    const documentsFunction = new Function(stack, "documentsFunction", { handler: "packages/functions/src/process-pdf-lambda.handler",
    timeout: "120 seconds", memorySize: 256, retryAttempts: 0, environment: { QUEUE_URL: filterQueue.queueUrl,} /*runtime: "python3.11"*/});


    // Creating Queue Service

    const documentsQueue = new Queue(stack, "Document-Queue", {
        consumer: documentsFunction,
        cdk: {
            queue: {
                // fifo: true,
                // contentBasedDeduplication: true,
                queueName: stack.stage + '-queue-for-documents'/*.fifo*/,
                visibilityTimeout: Duration.seconds(120),
            }
        }
    });


    documentsFunction.attachPermissions(["s3", "dynamodb", "sqs"]);
    // Allow Lambda function to call Textract analyzeDocument
    documentsFunction.addToRolePolicy(new iam.PolicyStatement({
        actions: ['textract:*'],
        resources: ['*'] // Adjust resource pattern as needed
    }));
    // Add the IAM policy to grant permission for calling Comprehend's DetectEntities action
    documentsFunction.addToRolePolicy(new iam.PolicyStatement({
        actions: ['comprehend:*'],
        resources: ['*'] // Adjust resource pattern as needed
    }));


    // Creating S3 Bucket

    const artificatsBucket = new Bucket(stack, "Artifacts-Bucket", {
        name: stack.stage + '-s3-for-artifacts',
        blockPublicACLs: true,
        notifications: {
            pdfNotification: {
                type: "queue",
                queue: documentsQueue,
                events: ["object_created"],
                filters: [{ prefix: "uploads/" }, { suffix: ".pdf" }],
            },
            pngNotification: {
                type: "queue",
                queue: documentsQueue,
                events: ["object_created"],
                filters: [{ prefix: "uploads/" }, { suffix: ".png" }],
            },
            jpegNotification: {
                type: "queue",
                queue: documentsQueue,
                events: ["object_created"],
                filters: [{ prefix: "uploads/" }, { suffix: ".jpeg" }],
            },
        },
    });


 


    // Output Results 

    stack.addOutputs({
        QueueARN: documentsQueue.queueArn,
        Bucket: artificatsBucket.bucketName,
    });

    return { artificatsBucket };
}