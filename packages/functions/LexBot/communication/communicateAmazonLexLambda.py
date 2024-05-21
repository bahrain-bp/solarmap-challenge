import boto3
import json

client = boto3.client('lexv2-runtime', region_name='us-east-1')

def lambda_handler(event, context):

    # Extract user's input text from the event
    user_input_text = event.get('text', 'Hello')  # Default to 'Hello' if no text found

    botId = "6XI9MHNGUC"
    botAliasId = "38NFYTMVBR"
    localeId = "en_US"
    sessionId = "100"

    response = client.recognize_text(
        botId=botId,
        botAliasId=botAliasId,
        localeId=localeId,
        sessionId=sessionId,
        text=user_input_text)
    
    print("Intent:", response['sessionState']['intent']['name'])
    print("Next Action:", response['sessionState']['dialogAction']['type'])
    print("Next Slot:", response['sessionState']['dialogAction']['slotToElicit'])
    print("Prompt or Msg:", response['messages'][0]['content'])

    # Prepare the response message
    prompt_message = response['messages'][0]['content']
    return {
        "statusCode": 200,
        "body": json.dumps({"message": prompt_message})
    }