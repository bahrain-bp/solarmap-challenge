import { APIGatewayProxyHandler } from 'aws-lambda';
import { S3 } from 'aws-sdk';
import { SQL } from "./sql";

const s3 = new S3();

export const handler: APIGatewayProxyHandler = async (event) => {
    if (!event.body) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'No resource data provided' }),
        };
    }
    
    const { title, body, resource_url, resource_img } = JSON.parse(event.body as string);

    const bucketName = 'educational-resources-image';
    let imageUrl = null;

    try {
        // Only process the image if it's provided
        if (resource_img) {
            const buffer = Buffer.from(resource_img, 'base64');
            const imageKey = `images/${Date.now()}-resource.jpg`;
        
            // Upload the image to S3
            await s3.putObject({
                Bucket: bucketName,
                Key: imageKey,
                Body: buffer,
                ContentType: 'image/jpeg', 
            }).promise();

            imageUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${imageKey}`;
        }

        await SQL.DB
            .insertInto('educational_resource')
            .values({
                title: title,
                body: body,
                resource_url: resource_url,
                resource_img: imageUrl 
            })
            .execute();

        console.log('Insert successful');
        return {
            statusCode: 201,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'Resource added successfully', imageUrl: imageUrl }),
        };
    } catch (error) {
        console.error('Error during operation:', error);
        const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to insert educational resource', error: errorMessage }),
        };
    }
};
