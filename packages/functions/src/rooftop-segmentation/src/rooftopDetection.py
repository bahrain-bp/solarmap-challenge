import boto3
import json
import base64
import inference
import numpy as np
import supervision as sv
from PIL import Image
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
            image_base64 = base64.b64encode(image_body).decode('utf-8')

            model = inference.get_model("satellite-map/5")
            response = model.infer(image=image_base64)

            print("Model Response: ", response)

            try:
                detections_list = []
                for res in response:
                    if res.predictions:
                        for prediction in res.predictions:
                            # Extract necessary information from each prediction
                            xyxy = [
                                prediction.x, 
                                prediction.y, 
                                prediction.x + prediction.width, 
                                prediction.y + prediction.height
                            ]
                            confidence = prediction.confidence
                            class_id = prediction.class_id
                            detections_list.append((xyxy, confidence, class_id))

                if detections_list:
                    xyxy, confidences, class_ids = zip(*detections_list)
                    xyxy = np.array(xyxy)
                    confidences = np.array(confidences)
                    class_ids = np.array(class_ids)
                    detections = sv.Detections(xyxy=xyxy, confidence=confidences, class_id=class_ids)
                else:
                    detections = sv.Detections(xyxy=np.empty((0, 4)), confidence=np.empty((0,)), class_id=np.empty((0,)))

                # Annotate the image with bounding boxes and labels
                label_annotator = sv.LabelAnnotator(text_position=sv.Position.CENTER)
                annotated_frame = label_annotator.annotate(scene=image_base64, detections=detections)

                mask_annotator = sv.MaskAnnotator()
                annotated_frame = mask_annotator.annotate(scene=image_base64, detections=detections)

                # Convert annotated frame back to binary image format
                annotated_image = Image.open(io.BytesIO(base64.b64decode(annotated_frame)))
                annotated_image_binary = io.BytesIO()
                annotated_image.save(annotated_image_binary, format='JPEG')
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



        
    # bounding_box_annotator = sv.BoundingBoxAnnotator()
    # label_annotator = sv.LabelAnnotator()

    # annotated_image = bounding_box_annotator.annotate(scene=image_base64, detections=detections)
    # annotated_image = label_annotator.annotate(scene=annotated_image, detections=detections)
    
    # https://supervision.roboflow.com/annotators/#supervision.annotators.core.MaskAnnotator

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
