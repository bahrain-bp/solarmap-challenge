// Returns full files

// const AWS = require('aws-sdk');
// const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

// const bucketName = 'aws-groundstation-s3dd-husain';
// const folderPath = 'data/JPSS1/viirs/level2/';

// export async function handler(event: any, context: any) {
//     const params = {
//         Bucket: bucketName,
//         Prefix: folderPath
//     };

//     try {
//         // List objects in the specified folder
//         const data = await s3.listObjectsV2(params).promise();

//         // Filter the objects to only include .tif files
//         const tifFiles = data.Contents.filter((item: { Key: string; }) => item.Key.endsWith('.tif'));

//         // If you need to read the contents of each .tif file, you can loop through them
//         for (const file of tifFiles) {
//             const getObjectParams = {
//                 Bucket: bucketName,
//                 Key: file.Key
//             };

//             const s3Object = await s3.getObject(getObjectParams).promise();
//             console.log(`Content of ${file.Key}:`, s3Object.Body.toString());

//             // You can perform further processing on the file content here
//         }

//         // Return the list of .tif files
//         return {
//             statusCode: 200,
//             body: JSON.stringify({
//                 message: 'Successfully retrieved .tif files',
//                 files: tifFiles.map((file: { Key: any; }) => file.Key)
//             })
//         };
//     } catch (err) {
//         console.log(err);
//         return {
//             statusCode: 500,
//             body: JSON.stringify({
//                 message: 'Error retrieving .tif files',
//                 error: err
//             })
//         };
//     }
// }

// Returns meta data

// const AWS = require('aws-sdk');
// const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

// const bucketName = 'aws-groundstation-s3dd-husain';
// const folderPath = 'data/JPSS1/viirs/level2/';

// export async function handler(event: any, context: any) {
//     const params = {
//         Bucket: bucketName,
//         Prefix: folderPath
//     };

//     try {
//         // List objects in the specified folder
//         const data = await s3.listObjectsV2(params).promise();

//         // Filter the objects to only include .tif files
//         const tifFiles = data.Contents.filter((item: { Key: string; }) => item.Key.endsWith('.tif'));

//         // Extract metadata for each .tif file
//         const fileMetadata = tifFiles.map((file: { Key: string; Size: number; }) => ({
//             key: file.Key,
//             size: file.Size
//         }));

//         // Return the list of .tif files metadata
//         return {
//             statusCode: 200,
//             body: JSON.stringify({
//                 message: 'Successfully retrieved .tif files',
//                 files: fileMetadata
//             })
//         };
//     } catch (err) {
//         console.log(err);
//         return {
//             statusCode: 500,
//             body: JSON.stringify({
//                 message: 'Error retrieving .tif files',
//                 error: err
//             })
//         };
//     }
// }

// Returns files as presigned urls

const AWS = require('aws-sdk');
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

const bucketName = 'aws-groundstation-s3dd-husain';
const folderPath = 'data/JPSS1/viirs/level2/';

export async function handler(event: any, context: any) {
    const params = {
        Bucket: bucketName,
        Prefix: folderPath
    };

    try {
        // List objects in the specified folder
        const data = await s3.listObjectsV2(params).promise();

        // Filter the objects to only include .tif files
        const tifFiles = data.Contents.filter((item: { Key: string; }) => item.Key.endsWith('.tif'));

        // Generate pre-signed URLs for each .tif file
        const presignedUrls = await Promise.all(tifFiles.map(async (file: { Key: string; }) => {
            const url = await s3.getSignedUrlPromise('getObject', {
                Bucket: bucketName,
                Key: file.Key,
                Expires: 3600 // URL expiration time in seconds (1 hour)
            });
            return {
                key: file.Key,
                url: url
            };
        }));

        // Return the list of pre-signed URLs
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Successfully retrieved .tif files',
                files: presignedUrls
            })
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error retrieving .tif files',
                error: err
            })
        };
    }
}