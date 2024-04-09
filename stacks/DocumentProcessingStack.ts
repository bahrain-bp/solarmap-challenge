import { Function, Bucket, Queue, StackContext } from "sst/constructs";
import * as iam from 'aws-cdk-lib/aws-iam';


export function DocumentProcessingStack({ stack }: StackContext) {

    const documentsFunction = new Function(stack, "Function", { handler: "packages/functions/src/process-pdf-lambda.handler" });
    const uploadFunction = new Function(stack, "Function", { handler: "packages/functions/src/document-upload.handler" });

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
        actions: ['textract:AnalyzeDocument'],
        resources: ['*'] // Adjust resource pattern as needed
    }));
    // Add the IAM policy to grant permission for calling Comprehend's DetectEntities action
    documentsFunction.addToRolePolicy(new iam.PolicyStatement({
        actions: ['comprehend:DetectEntities'],
        resources: ['*'] // Adjust resource pattern as needed
    }));



    // Creating S3 Bucket

    const artificatsBucket = new Bucket(stack, "Artifacts-Bucket", {
        name: stack.stage + '-s3-for-artifacts',
        blockPublicACLs: true,
        notifications: {
            myNotification: {
                type: "queue",
                queue: documentsQueue,
                events: ["object_created"],
                filters: [/*{ prefix: "imports/" },*/ { suffix: ".pdf" }],
            },
        },
    });

    // Define an IAM policy statement to allow PutObject action on the bucket
    const s3PolicyStatement = new iam.PolicyStatement({
        actions: ['s3:PutObject'],
        resources: [artificatsBucket.bucketArn + '/*'], // Allow PutObject action on all objects in the bucket
    });

    // Add the IAM policy statement to the Lambda function's execution role
    uploadFunction.addToRolePolicy(s3PolicyStatement);

    // Output Results 

    stack.addOutputs({
        QueueARN: documentsQueue.queueArn,
        Bucket: artificatsBucket.bucketName,
    });

    return { artificatsBucket };
}