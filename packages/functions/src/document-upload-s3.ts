import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DocumentProcessingStack } from '../../../stacks/DocumentProcessingStack.js';
import { use } from "sst/constructs";
import * as AWS from 'aws-sdk';

const s3 = new AWS.S3();
const documentProcessingStack = use(DocumentProcessingStack);

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const bucketName = documentProcessingStack.artificatsBucket.bucketName; // bucket name

  try {
    const body = JSON.parse(event.body || '');
    const { fileName, fileData, fileType } = body;

    const s3Params: AWS.S3.PutObjectRequest = {
      Bucket: bucketName,
      Key: `${Date.now().toString()}-${fileName}`, // Use a unique key for each file
      Body: Buffer.from(fileData, 'base64'), // File data in base64 format
      ContentType: fileType
    };

    const uploadResult = await s3.upload(s3Params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'File uploaded successfully',
        location: uploadResult.Location
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error uploading file',
        error: error.message
      })
    };
  }
}