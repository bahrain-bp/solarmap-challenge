import { Function, Bucket, Queue, StackContext } from "sst/constructs";
import * as iam from 'aws-cdk-lib/aws-iam';


export function DocumentProcessingStack({ stack }: StackContext) {

    const documentsFunction = new Function(stack, "Function", { handler: "packages/functions/src/process-pdf-lambda.handler",
   /* timeout: "120 seconds",*/ memorySize: 256, retryAttempts: 1, /*runtime: "python3.11"*/});

    // Creating Queue Service

    const documentsQueue = new Queue(stack, "Document-Queue", {
        consumer: documentsFunction,
        cdk: {
            queue: {
                // fifo: true,
                // contentBasedDeduplication: true,
                queueName: stack.stage + '-queue-for-documents'/*.fifo*/,
                //visibilityTimeout: Duration.seconds(5),
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