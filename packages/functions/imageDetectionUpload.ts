import aws from 'aws-sdk';

const bucketName = process.env.BUCKET_NAME;

const s3 = new aws.S3({
  signatureVersion: 'v4'
});

export async function handler(event: { body: string; }) {
    const body = JSON.parse(event.body);
    const key = body.key;
    const contentType = 'image/jpeg'; // Set the content type according to your object type

    // Retrieve the object data from the request body
    const objectData = Buffer.from(body.data, 'base64'); // Assuming the data is base64 encoded

    try {
        // Upload the object directly to S3
        await s3.putObject({
            Bucket: 'bucketName',
            Key: key,
            Body: objectData,
            ContentType: contentType
        }).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Object uploaded successfully'
            })
        };
    } catch (error) {
        console.error('Error uploading object:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Internal Server Error'
            })
        };
    }
}
