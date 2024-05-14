import { Bucket, EventBus, Function, Queue, StackContext } from "sst/constructs";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Duration } from "aws-cdk-lib";

export function ImgDetectionStack({ stack }: StackContext) {

    const rooftopFunction = new Function(stack, "rooftopFunction", {
        handler: "packages/functions/src/rooftopDetection.handler",
        timeout: "120 seconds",
        memorySize: 2048,
        retryAttempts: 0,
        // runtime: "python3.11",
    });


    // Create a FIFO SQS Queue
    const queue = new Queue(stack, "rooftopQueue", {
        consumer: rooftopFunction,
        cdk: {
            queue: {
                queueName: stack.stage+ 'rooftopQueue',
                visibilityTimeout: Duration.seconds(120),
            }
        }
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
            resources: [bucket.bucketArn, bucket.bucketArn + '/*'],
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


        // Output Results 

        stack.addOutputs({
            Bucket: bucket.bucketName,
        });

    return {
        queue,
        bucket
    }
}