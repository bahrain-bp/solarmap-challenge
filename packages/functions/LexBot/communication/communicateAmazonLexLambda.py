import boto3
client = boto3.client('lexv2-runtime', region_name='us-east-1')


def lambda_handler(event, context):

    # https://docs.aws.amazon.com/lexv2/latest/dg/how-languages.html
    botId = "AP6ZAAHNGU"
    botAliasId = "A8UQTPZH8V"
    localeId = "en_US"
    sessionId = "100"

    response = client.recognize_text(
        botId=botId,
        botAliasId=botAliasId,
        localeId=localeId,
        sessionId=sessionId,
        text='Hello')
    
    print("Intent:", response['sessionState']['intent']['name'])
    print("Next Action:", response['sessionState']['dialogAction']['type'])
    print("Next Slot:", response['sessionState']['dialogAction']['slotToElicit'])
    print("Prompt or Msg:", response['messages'][0]['content'])  
    
    


