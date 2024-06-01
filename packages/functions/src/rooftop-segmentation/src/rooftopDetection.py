import boto3
import json
import base64
import inference
import numpy as np
from PIL import Image, ImageDraw, ImageColor
import io

# Create an S3 client
s3 = boto3.client('s3')

def lambda_handler(event, context):
    print(event)
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

            # Decode image to binary and convert to RGBA
            image = Image.open(io.BytesIO(image_body)).convert("RGBA")

            # Create a transparent overlay
            overlay = Image.new("RGBA", image.size, (0, 0, 0, 0))
            draw = ImageDraw.Draw(overlay)

            model = inference.get_model("satellite-map/5")
            response = model.infer(image=base64.b64encode(image_body).decode('utf-8'))

            print("Model Response: ", response)

            try:
                for res in response:
                    if res.predictions:
                        for prediction in res.predictions:
                            points = [(point.x, point.y) for point in prediction.points]
                            # Draw the mask with transparency
                            draw.polygon(points, outline=(255, 0, 0, 255), fill=(0, 0, 255, 128))  # Fill with semi-transparent blue

                # Combine the original image with the overlay
                combined = Image.alpha_composite(image, overlay).convert("RGB")

                # Save the annotated image
                annotated_image_binary = io.BytesIO()
                combined.save(annotated_image_binary, format='JPEG')
                annotated_image_binary.seek(0)

                s3.upload_fileobj(annotated_image_binary, bucket_name, "annotated_frames/" + object_key.split("/")[-1])

                return {
                    'statusCode': 200,
                    'body': json.dumps({'message': "Image processed and saved successfully"})
                }
            except Exception as e:
                print("Error processing response: ", str(e))
                return {
                    'statusCode': 500,
                    'body': json.dumps({'message': "Error processing response"})
                }

    return {
        'statusCode': 400,
        'body': json.dumps({'message': "No records found in the event"})
    }

