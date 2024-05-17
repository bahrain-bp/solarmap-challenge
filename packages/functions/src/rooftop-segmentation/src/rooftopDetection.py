import boto3
import json
import base64
import inference

# Create an S3 client
s3 = boto3.client('s3')

def lambda_handler(event, context):
    if 'Records' in event and len(event['Records']) > 0:
        payload = json.loads(event['Records'][0]['body'])
        records = payload.get('Records')
        if records and len(records) > 0:
            s3_record = records[0]
            bucket_name = s3_record['s3']['bucket'].get('name')
            object_key = s3_record['s3']['object'].get('key')

            print("Bucket Name: ", bucket_name)
            print("Object Key: ", object_key)

        # Download the image from S3
        image_data = s3.get_object(Bucket=bucket_name, Key=object_key)
        image_body = image_data['Body'].read()
        image_base64 = base64.b64encode(image_body).decode('utf-8')

 
 

    #     # Check if the response contains predictions
    #     if response_data and 'predictions' in response_data:
    #         predictions = response_data['predictions']
    #         processed_data = {
    #             'originalImageKey': object_key,
    #             'predictions': predictions
    #         }

    #         # Convert the processed data to JSON string
    #         processed_data_json = json.dumps(processed_data)

    #         # Prepare parameters to upload the processed data back to S3
    #         upload_params = {
    #             'Bucket': bucket_name,
    #             'Key': f"segmentations/processed-{object_key.replace('.png', '.json')}",
    #             'Body': processed_data_json,
    #             'ContentType': 'application/json'
    #         }

    #         # Upload the processed data to S3
    #         s3.put_object(**upload_params)
    #         print('Processed data has been saved to S3.')

    #         return {
    #             'statusCode': 200,
    #             'body': json.dumps({
    #                 'message': "Image processed and saved successfully"
    #             })
    #         }


    # return {
    #     'statusCode': 400,
    #     'body': json.dumps({'message': "No records found in the event"})
    # }
