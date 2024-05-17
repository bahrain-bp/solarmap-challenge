import aws from 'aws-sdk';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

// Create an S3 service object
const s3 = new aws.S3({
    signatureVersion: 'v4',
    region: 'us-east-1'
});

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
            const imageData = await s3.getObject({
                Bucket: String(bucketName),
                Key: objectKey, // Adjust the key as needed
            }).promise();

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

            // Log the response data to inspect its format
            console.log("Response data:", response.data);

            // Check if the response contains predictions
            if (response.data && response.data.predictions) {
                const predictions = response.data.predictions;
                const processedData = {
                    originalImageKey: objectKey,
                    predictions: predictions
                };

                // Convert the processed data to JSON string
                const processedDataJson = JSON.stringify(processedData);

                // Prepare parameters to upload the processed data back to S3
                const uploadParams = {
                    Bucket: bucketName, // You might want to choose a different bucket or path
                    Key: `segmentations/processed-${objectKey.replace('.png', '.json')}`,
                    Body: processedDataJson,
                    ContentType: 'application/json', // Adjust the content type if necessary
                };

                // Upload the processed data to S3
                await s3.putObject(uploadParams).promise();
                console.log('Processed data has been saved to S3.');

                return {
                    statusCode: 200,
                    body: JSON.stringify({
                        message: "Image processed and saved successfully",
                    }),
                };
            } else {
                console.error("Unexpected response data format:", response.data);
                throw new Error("Unexpected response data format");
            }
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
