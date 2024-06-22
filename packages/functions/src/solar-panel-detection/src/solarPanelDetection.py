import json
import base64
import inference
import numpy as np
from PIL import Image, ImageDraw, ImageColor
import io

def lambda_handler(event, context):
    print(event)
    if 'body' in event:
        # The image data is expected to be in the body of the POST request
        body = json.loads(event['body'])
        
        if 'image' in body:
            # Read the image directly from the request body
            image_data_base64 = body['image']
            image_body = base64.b64decode(image_data_base64)
            
            # Convert to RGBA
            image = Image.open(io.BytesIO(image_body)).convert("RGBA")
            
            # Create a transparent overlay
            overlay = Image.new("RGBA", image.size, (0, 0, 0, 0))
            draw = ImageDraw.Draw(overlay)
            
            # Get the model and infer
            model = inference.get_model("solar-panel-detection-a5bec/3")
            response = model.infer(image=base64.b64encode(image_body).decode('utf-8'), confidence=0.07, iou_threshold=0.5)

            print("Model Response: ", response)

            # Draw bounding boxes on the overlay
            for detection in response['detections']:
                box = detection['box']
                draw.rectangle([box['xmin'], box['ymin'], box['xmax'], box['ymax']], outline=ImageColor.getrgb("red"), width=3)
                
            # Combine the original image with the overlay
            combined = Image.alpha_composite(image, overlay).convert("RGB")
            
            # Save the annotated image
            annotated_image_binary = io.BytesIO()
            combined.save(annotated_image_binary, format='JPEG')
            annotated_image_binary.seek(0)
            
            # Convert image to base64
            annotated_image_base64 = base64.b64encode(annotated_image_binary.getvalue()).decode('utf-8')
            
            return {
                'statusCode': 200,
                'body': json.dumps({'message': "Image processed and saved successfully", 'image': annotated_image_base64})
            }

    return {
        'statusCode': 400,
        'body': json.dumps({'message': "No valid image found in the request body"})
    }
