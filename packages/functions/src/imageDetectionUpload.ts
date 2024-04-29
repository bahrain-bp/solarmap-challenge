import { S3 } from 'aws-sdk';
import { parse } from 'aws-lambda-multipart-parser'; // This library helps parse FormData

const s3 = new S3();

export async function handler(event: any) {
    // Parse the incoming FormData
    const parsed = parse(event, true); // `true` ensures that binary data is also parsed correctly

    try {
        const file = parsed.file;  // Your FormData should have a 'file' field
        const bucketName = process.env.BUCKET_NAME;

        // Upload the object directly to S3
        const result = await s3.putObject({
            Bucket: String(bucketName),
            Key: `uploads/${file.filename}`, // Adjust the key as needed
            Body: file.content, // Directly using the parsed file content
            ContentType: file.contentType, // Using the content type from the parsed file
        }).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Object uploaded successfully',
                data: result
            }),
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
