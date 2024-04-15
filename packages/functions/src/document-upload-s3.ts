import aws from 'aws-sdk';

const bucketName = process.env.BUCKET_NAME;

const s3 = new aws.S3({
  signatureVersion: 'v4'
});

export async function handler(event: { body: string; }) {
  const { contentType } = JSON.parse(event.body); // Assuming fileType is sent in the request body

  const randomMultiplier = Math.floor(Math.random() * 1000); // Random multiplier
  let fileName = `uploads/uploaded-file-${new Date().toISOString().slice(0,10).replace(/-/g,"")}-${Date.now() * randomMultiplier}`;

  // Add appropriate file extension based on the fileType
  if (contentType === 'application/pdf') {
    fileName += '.pdf';
  } else if (contentType === 'image/png') {
    fileName += '.png';
  } else if (contentType === 'image/jpeg') {
    fileName += '.jpeg';
  } // Add more else if conditions for other file types if needed

  const params = {
    Bucket: bucketName,
    Key: fileName,
    Expires: 60
  };
  
  const uploadURL = await s3.getSignedUrlPromise('putObject', params);
  
  return {
    statusCode: 200,
    body: JSON.stringify({ url: uploadURL })
  };
}
