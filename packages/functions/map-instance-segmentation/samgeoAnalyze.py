import json
import leafmap
from samgeo import tms_to_geotiff

def lambda_handler(event, context):
    # Parse input event (if applicable)
    input_data = json.loads(event['body']) if 'body' in event else {}

    # Extract bounding box coordinates from input data or use default
    bbox = input_data.get('bbox', [-51.2565, -22.1777, -51.2512, -22.175])

    # Perform image processing tasks
    image = "Image.tif"
    tms_to_geotiff(output=image, bbox=bbox, zoom=19, source="Satellite", overwrite=True)

    # Return output (if applicable)
    return {
        'statusCode': 200,
        'body': json.dumps({'message': 'Image processing completed successfully', 'image_path': image})
    }
