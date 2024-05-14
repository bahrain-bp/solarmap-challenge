import json
import boto3
import base64
import requests

s3 = boto3.client('s3')

def lambda_handler(event, context):
    try:
        print("Received event:", event)
        records = event.get('Records', [])

        if records:
            first_record = records[0]
            body = json.loads(first_record['body'])
            bucket_name = body['Records'][0]['s3']['bucket']['name']
            object_key = body['Records'][0]['s3']['object']['key']

            print(f"Bucket Name: {bucket_name}")
            print(f"Object Key: {object_key}")

            # Download the image from S3
            image_data = s3.get_object(Bucket=bucket_name, Key=object_key)
            image_base64 = base64.b64encode(image_data['Body'].read()).decode('utf-8')

            # Make the POST request with the image data
            response = requests.post(
                url="https://detect.roboflow.com/satellite-map/5",
                params={
                    "api_key": "3xmlZCsWRDCXapBb4Ydx"
                },
                data=image_base64,
                headers={
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            )

            # Assuming the response body is the modified image you want to save
            modified_image_data = base64.b64decode(response.text)

            # Prepare parameters to upload the processed image back to S3
            upload_params = {
                'Bucket': bucket_name,  # You might want to choose a different bucket or path
                'Key': f'segmented/processed-{object_key}',
                'Body': modified_image_data,
                'ContentType': 'image/jpeg',  # Adjust the content type if necessary
            }

            # Upload the processed image to S3
            s3.put_object(**upload_params)
            print('Processed image has been saved to S3.')

            return {
                'statusCode': 200,
                'body': json.dumps({
                    'message': "Image processed and saved successfully",
                }),
            }

        return {
            'statusCode': 400,
            'body': json.dumps({
                'message': "No records found in the event",
            }),
        }
    except Exception as error:
        print("Error processing event:", error)
        return {
            'statusCode': 500,
            'body': json.dumps({
                'message': "Error processing your request",
            }),
        }
