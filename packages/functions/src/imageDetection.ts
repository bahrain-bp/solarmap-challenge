import { S3 } from 'aws-sdk';

// Create an S3 service object
const s3 = new S3();

export const handler = async (event: any): Promise<any> => {
    try {
        console.log("Received event:", event);
        const records = event.Records;

        if (records && records.length > 0) {
            const firstRecord = records[0];
            const body = JSON.parse(firstRecord.body);
            const bucketName = body.Records[0].s3.bucket.name;
            const objectKey = body.Records[0].s3.object.key;

            console.log(`Bucket Name: ${bucketName}`);
            console.log(`Object Key: ${objectKey}`);

            // Download the image from S3
            const params = {
                Bucket: bucketName,
                Key: objectKey,
            };

            const imageData = await s3.getObject(params).promise();

            // imageData.Body contains the image data as a buffer
            console.log('Image has been downloaded.');

            // You can process the image as needed here

            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: "Image processed successfully",
                }),
            };
        }

        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "No records found in the event",
            }),
        };
    } catch (error) {
        console.error("Error processing event:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Error processing your request",
            }),
        };
    }
}
