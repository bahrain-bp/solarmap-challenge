import { Bucket, Queue, StackContext } from "sst/constructs";

export function DocumentProcessingStack({ stack }: StackContext) {

    // Creating Queue Service

    const documentsQueue = new Queue(stack, "Document-Queue", {
        // consumer: "...",
        cdk: {
            queue: {
                // fifo: true,
                // contentBasedDeduplication: true,
                queueName: stack.stage + '-queue-for-documents'/*.fifo*/,
                //visibilityTimeout: Duration.seconds(5),
            }
        }
    });

    // Creating S3 Bucket

    const artificatsBucket = new Bucket(stack, "Artificats-Bucket", {
        name: stack.stage + '-s3-for-artificats',
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

    // Output Results 

    stack.addOutputs({
        QueueARN: documentsQueue.queueArn,
        Bucket: artificatsBucket.bucketName,
      });

}