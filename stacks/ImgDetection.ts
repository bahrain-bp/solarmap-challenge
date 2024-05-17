import { Bucket, EventBus, Function, Queue, StackContext } from "sst/constructs";
import { aws_lambda as lambda } from 'aws-cdk-lib';
import { Duration } from "aws-cdk-lib/core";
import * as iam from "aws-cdk-lib/aws-iam";

export function ImgDetection({ stack }: StackContext) {

    /*

    const rooftopFunction = new Function(stack, "rooftopFunction", {
        handler: "packages/functions/src/rooftopDetection.handler",
        timeout: "120 seconds",
        memorySize: 2048,
        retryAttempts: 0,
        // runtime: "python3.11",
    });

    */

    // Inside your ApiStack function
    const rooftopInferenceFunction = new lambda.Function(stack, 'rooftopInferenceFunction', {
        runtime: lambda.Runtime.PYTHON_3_11, // Specify the Python 3.8 runtime
        code: lambda.Code.fromAsset("packages/functions/src/rooftop-segmentation/"), // Assuming the Lambda handler code is in this directory
        handler: "rooftopDetection.lambda_handler", // Adjust the handler path as necessary
        memorySize: 2048,
        timeout: Duration.seconds(120),
        layers: [
            new lambda.LayerVersion(stack, "firstLayer", {
                layerVersionName: stack.stage + '-inference-and-requests-layer',
                code: lambda.Code.fromAsset("packages/functions/src/rooftop-segmentation/inference-requests/python.zip")
            }),
            new lambda.LayerVersion(stack, "secondLayer", {
                layerVersionName: stack.stage + '-charset-and-idna-layer',
                code: lambda.Code.fromAsset("packages/functions/src/rooftop-segmentation/charset/python.zip")
            }),

        ],
    });

    // Create a FIFO SQS Queue
    const queue = new Queue(stack, "rooftopQueue", {
        consumer: {
            cdk: {
                function: lambda.Function.fromFunctionAttributes(stack, "IFunction", {
                    functionArn: rooftopInferenceFunction.functionArn,
                    role: rooftopInferenceFunction.role,
                }),

            },
        },
        cdk: {
            queue: {
                queueName: stack.stage + 'rooftopQueue',
                visibilityTimeout: Duration.seconds(120),
            },
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
    rooftopInferenceFunction.addToRolePolicy(new iam.PolicyStatement({
        actions: ['s3:*'],
        resources: [bucket.bucketArn, `${bucket.bucketArn}/*`],
    }));



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