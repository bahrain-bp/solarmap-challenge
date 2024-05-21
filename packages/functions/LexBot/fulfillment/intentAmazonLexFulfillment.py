import json
import random
import decimal 

def random_num():
    return(decimal.Decimal(random.randrange(1000, 50000))/100)

def get_slots(intent_request):
    return intent_request['sessionState']['intent']['slots']
    
def get_slot(intent_request, slotName):
    slots = get_slots(intent_request)
    if slots is not None and slotName in slots and slots[slotName] is not None:
        return slots[slotName]['value']['interpretedValue']
    else:
        return None    

def get_session_attributes(intent_request):
    sessionState = intent_request['sessionState']
    if 'sessionAttributes' in sessionState:
        return sessionState['sessionAttributes']

    return {}

def elicit_intent(intent_request, session_attributes, message):
    return {
        'sessionState': {
            'dialogAction': {
                'type': 'ElicitIntent'
            },
            'sessionAttributes': session_attributes
        },
        'messages': [ message ] if message != None else None,
        'requestAttributes': intent_request['requestAttributes'] if 'requestAttributes' in intent_request else None
    }


def close(intent_request, session_attributes, fulfillment_state, message):
    intent_request['sessionState']['intent']['state'] = fulfillment_state
    return {
        'sessionState': {
            'sessionAttributes': session_attributes,
            'dialogAction': {
                'type': 'Close'
            },
            'intent': intent_request['sessionState']['intent']
        },
        'messages': [message],
        'sessionId': intent_request['sessionId'],
        'requestAttributes': intent_request['requestAttributes'] if 'requestAttributes' in intent_request else None
    }

def GetSolarPanelInstallationEstimateIntent(intent_request):
    
    session_attributes = get_session_attributes(intent_request)
    
    # Extracting slot values from the event
    slots = get_slots(intent_request)
    print(slots)
    
    property_size = get_slot(intent_request, 'PropertySizeSlot')
    location = get_slot(intent_request, 'LocationSlot')
    electricity_consumption = get_slot(intent_request, 'ElectricityConsumptionSlot')
    roof_orientation = get_slot(intent_request, 'RoofOrientationSlot')
    roof_type = get_slot(intent_request, 'RoofTypeSlot')
    shading = get_slot(intent_request, 'ShadingSlot')
    budget = get_slot(intent_request, 'BudgetSlot')
    installation_timeline = get_slot(intent_request, 'InstallationTimelineSlot')
    
    # Calculaton to be added here
    
    text = "ROI: 6 months, Cost: 750 BD, Solar Panels: 8."

    message = {
        'contentType': 'PlainText',
        'content': text
    }

    fulfillment_State ="Fulfilled"
    # Return the calculated estimate
    return close(intent_request, session_attributes, fulfillment_State, message)

def WelcomeIntent(intent_request):
    # Retrieve session attributes
    session_attributes = get_session_attributes(intent_request)

    # Extracting slot values from the event
    slots = get_slots(intent_request)
    print(slots)
    
    # Get specific slot for SolarMap
    category = get_slot(intent_request, 'SolarMapSlot')

    text = "Recieved Category is not valid. Please choose another category from the provided list."
    # Initialize text variable based on category
    if category == 'About':
        text = "SolarMap is a revolutionary platform that utilizes AI and AWS Ground Station to map and manage solar panel installations across Bahrain, supporting efficient energy policies and sustainable development."
    elif category == 'Contractors':
        text = "Contractors can utilize SolarMap to access real-time data and analytics for the precise placement and management of solar installations, ensuring optimal performance and efficiency."
    elif category == 'Consultants':
        text = "Consultants benefit from SolarMap by getting detailed insights and analytics that aid in strategic planning and advising on solar energy projects."
    elif category == 'Calculation':
        text = "SolarMap calculates the optimal number of solar panels and cost estimates based on real-time satellite data, size of the property, and energy consumption details from EWA bills. You can start your calculation process in chat right away using the 'Calculate' or by using the Document or Map Calculator."
    elif category == 'Process':
        text = "The process involves homeowners signing up, submitting EWA bills and house coordinates, and receiving estimates for solar panels. MEWA supervisors review and approve applications on the platform."
    elif category == 'More':
        text = "For more information or to dive deeper into how SolarMap is transforming Bahrain's approach to solar energy, please visit the MEWA website or contact our Renewable Energy Department or reach out to mewa.solarmap@gmail.com for additional inquiries."
    elif category == 'Data & Privacy':
        text = "SolarMap ensures strict adherence to data privacy standards, securely processing and storing all user data and energy consumption details with robust protection measures."

    # Construct the response message
    message = {
        'contentType': 'PlainText',
        'content': text
    }

    fulfillment_State = "Fulfilled"
    
    # Return the calculated estimate
    return close(intent_request, session_attributes, fulfillment_State, message)


def dispatch(intent_request):
    intent_name = intent_request['sessionState']['intent']['name']
    response = None
    # Dispatch to your bot's intent handlers
    if intent_name == 'WelcomeIntent':
        return WelcomeIntent(intent_request)
    elif intent_name == 'GetSolarPanelInstallationEstimateIntent':
        return GetSolarPanelInstallationEstimateIntent(intent_request)
    # elif intent_name == 'FollowupCheckBalance':
    #     return FollowupCheckBalance(intent_request)
    else:
        raise Exception('Intent with name ' + intent_name + ' not supported')

def lambda_handler(event, context):
    response = dispatch(event)
    return response