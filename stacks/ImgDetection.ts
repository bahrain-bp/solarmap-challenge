import { Bucket, EventBus, Function, Queue, StackContext } from "sst/constructs";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";

export function ImgDetection({ stack }: StackContext) {

    const rooftopFunction = new Function(stack, "rooftopFunction", {
        handler: "packages/functions/src/imageDetection.handler",
        timeout: "120 seconds",
        memorySize: 2048,
        retryAttempts: 0,
        // runtime: "python3.11",
    });


    // Create a FIFO SQS Queue
    const queue = new Queue(stack, "myQueue", {
        consumer: "packages/functions/src/imageDetection.handler",
    });


    // Create an S3 bucket and configure it to send notifications to an EventBus
    const bucket = new Bucket(stack, "myBucket", {
        notifications: {
            myNotification: {
                type: "queue",
                queue: queue,
                events: ["object_created"],
            }
        }
    });

    // Grant permissions to the Lambda function to access the S3 bucket
    rooftopFunction.attachPermissions([
        new PolicyStatement({
            actions: ['s3:*'],
            resources: [bucket.bucketArn + '/*'],
        })
    ]);



    /*
    // Create an EventBus
    const bus = new EventBus(stack, "Bus", {
        rules: {
            myRule: {
                pattern: {
                    source: [bucket.bucketName] // Assuming the event source you want is S3
                },
                targets: {
                    myTarget1: queue
                }
            }
        }
    });
    */
    return {
        queue,
        bucket
    }
}