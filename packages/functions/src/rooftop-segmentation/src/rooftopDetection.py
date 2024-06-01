import boto3
import json
import base64
import inference
import numpy as np
from PIL import Image, ImageDraw, ImageColor
import io

# Create an S3 client
s3 = boto3.client('s3')

def calculate_polygon_area(points):
    """
    Calculate the area of a polygon using the Shoelace formula.
    """
    if len(points) < 3:  # Not a polygon
        return 0

    x = np.array([p[0] for p in points])
    y = np.array([p[1] for p in points])

    # Shoelace formula
    area = 0.5 * np.abs(np.dot(x, np.roll(y, 1)) - np.dot(y, np.roll(x, 1)))
    return area

def convert_pixel_area_to_m2(pixel_area, image_size, real_world_area):
    """
    Convert the area in pixels to the area in square meters.
    image_size: (width, height) of the image in pixels
    real_world_area: (width, height) of the real-world area corresponding to the image
    """
    image_width, image_height = image_size
    real_width, real_height = real_world_area

    # Calculate the area of the image in square meters
    real_image_area_m2 = real_width * real_height

    # Calculate the area of a single pixel in square meters
    pixel_area_m2 = real_image_area_m2 / (image_width * image_height)

    # Convert the pixel area to square meters
    area_m2 = pixel_area * pixel_area_m2
    return area_m2

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
            
            # Resize the image to 640x640 pixels
            # image = image.resize((640, 640))

            # Create a transparent overlay
            overlay = Image.new("RGBA", image.size, (0, 0, 0, 0))
            draw = ImageDraw.Draw(overlay)

            model = inference.get_model("satellite-map/5")
            response = model.infer(image=base64.b64encode(image_body).decode('utf-8'), confidence=0.0, iou_threshold=0.0)

            print("Model Response: ", response)

            try:
                for res in response:
                    if res.predictions:
                        for prediction in res.predictions:
                            if len(prediction.points) >= 2:  # Ensure there are enough points to form a polygon
                                points = [(point.x, point.y) for point in prediction.points]
                                # Draw the mask with very light transparency
                                draw.polygon(points, outline=(255, 0, 0, 255), fill=(0, 0, 255, 50))  # Reduced alpha to 50 for more transparency

                                # Calculate the area of the polygon
                                pixel_area = calculate_polygon_area(points)
                                # Assuming real_world_area is known (for example, 100m x 100m)
                                real_world_area = (100, 100)
                                area_m2 = convert_pixel_area_to_m2(pixel_area, image.size, real_world_area)
                                print(f"Area of shaded segmentation: {area_m2:.2f} square meters")

                # Combine the original image with the overlay
                combined = Image.alpha_composite(image, overlay).convert("RGB")

                # Save the annotated image
                annotated_image_binary = io.BytesIO()
                combined.save(annotated_image_binary, format='JPEG')
                annotated_image_binary.seek(0)

                # Upload the image to S3 after processing is complete
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
