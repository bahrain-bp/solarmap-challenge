import { S3 } from 'aws-sdk';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

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
            const imageBase64 = imageData.Body?.toString('base64');

            // Make the POST request with the image data
            const response = await axios({
                method: "POST",
                url: "https://detect.roboflow.com/satellite-map/5",
                params: {
                    api_key: "3xmlZCsWRDCXapBb4Ydx"
                },
                data: imageBase64,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });

            // Assuming the response body is the modified image you want to save
            const modifiedImageData = Buffer.from(response.data, 'base64');

            // Prepare parameters to upload the processed image back to S3
            const uploadParams = {
                Bucket: bucketName, // You might want to choose a different bucket or path
                Key: `segmented/processed-${objectKey}`,
                Body: modifiedImageData,
                ContentType: 'image/jpeg', // Adjust the content type if necessary
            };

            // Upload the processed image to S3
            await s3.putObject(uploadParams).promise();
            console.log('Processed image has been saved to S3.');

            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: "Image processed and saved successfully",
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