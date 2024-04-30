import { S3 } from 'aws-sdk';
import { parse, MultipartRequest } from 'lambda-multipart-parser'; // Import MultipartRequest type

const s3 = new S3();

export async function handler(event: any) {
    try {
        // Parse the incoming FormData
        const parsed: MultipartRequest = await parse(event); // `true` ensures that binary data is also parsed correctly

        const file = parsed.files[0]; // Access the files array

        if (!file) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: 'No file uploaded'
                })
            };
        }

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
