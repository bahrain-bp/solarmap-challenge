import dotenv from 'dotenv'
import aws from 'aws-sdk'
import crypto from 'crypto'
import { promisify } from "util"
const randomBytes = promisify(crypto.randomBytes)

const bucketName = process.env.BUCKET_NAME;

const s3 = new aws.S3({
  signatureVersion: 'v4'
})

export async function handler() {
  const rawBytes = await randomBytes(16)
  const imageName = rawBytes.toString('hex')

  const params = ({
    Bucket: bucketName,
    Key: imageName,
    Expires: 60
  })
  
  const uploadURL = await s3.getSignedUrlPromise('putObject', params)
  
  return {
    statusCode: 200,
    body: JSON.stringify({ url: uploadURL })
  };
  
}