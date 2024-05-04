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

    property_size = get_slots[intent_request, 'PropertySizeSlot']
    location = get_slots[intent_request, 'LocationSlot']
    electricity_consumption = get_slots[intent_request, 'ElectricityConsumptionSlot']
    roof_orientation = get_slots[intent_request, 'RoofOrientationSlot']
    roof_type = get_slots[intent_request, 'RoofTypeSlot']
    shading = get_slots[intent_request, 'ShadingSlot']
    budget = get_slots[intent_request, 'BudgetSlot']
    installation_timeline = get_slots[intent_request, 'InstallationTimelineSlot']
    
    # Placeholder values for cost estimation (replace with actual calculation)
    panel_cost_per_unit = 500  # Cost per solar panel unit
    installation_cost_factor = 1.2  # Installation cost factor
    
    # Placeholder values for panel capacity estimation (replace with actual calculation)
    panel_capacity_per_unit = 250  # Capacity of each solar panel unit (in watts)
    average_daily_sunlight_hours = 5  # Average daily sunlight hours
    
    # Convert electricity consumption to numeric value if it's provided as a string
    if electricity_consumption.isdigit():
        electricity_consumption = int(electricity_consumption)
    
    # Determine the estimated number of solar panels needed based on property size and electricity consumption
    if property_size == 'Small':
        if electricity_consumption <= 200:
            estimated_solar_panels = 5
        elif electricity_consumption <= 400:
            estimated_solar_panels = 8
        else:
            estimated_solar_panels = 10
    elif property_size == 'Medium':
        if electricity_consumption <= 400:
            estimated_solar_panels = 10
        elif electricity_consumption <= 600:
            estimated_solar_panels = 15
        else:
            estimated_solar_panels = 20
    else:
        if electricity_consumption <= 600:
            estimated_solar_panels = 15
        elif electricity_consumption <= 800:
            estimated_solar_panels = 20
        else:
            estimated_solar_panels = 25
    
    # Calculate estimated cost of solar panel installation
    estimated_panel_cost = estimated_solar_panels * panel_cost_per_unit
    estimated_installation_cost = estimated_panel_cost * installation_cost_factor
    estimated_total_cost = estimated_panel_cost + estimated_installation_cost
    
    # Calculate estimated energy production
    total_capacity = estimated_solar_panels * panel_capacity_per_unit
    daily_energy_production = total_capacity * average_daily_sunlight_hours
    
    text = "estimated_solar_panels: "+ estimated_solar_panels 
    +", estimated_panel_cost: "+ estimated_panel_cost 
    +", estimated_installation_cost: "+ estimated_installation_cost 
    +", estimated_total_cost: "+ estimated_total_cost 
    +", daily_energy_production: "+ daily_energy_production

    message = {
        'contentType': 'PlainText',
        'content': text
    }

    fulfillment_State ="Fulfilled"
    # Return the calculated estimate
    return close(intent_request, session_attributes, fulfillment_State, message)

def dispatch(intent_request):
    intent_name = intent_request['sessionState']['intent']['name']
    response = None
    # Dispatch to your bot's intent handlers
    if intent_name == 'GetSolarPanelInstallationEstimateIntent':
        return GetSolarPanelInstallationEstimateIntent(intent_request)
    # elif intent_name == 'FollowupCheckBalance':
    #     return FollowupCheckBalance(intent_request)
    else:
        raise Exception('Intent with name ' + intent_name + ' not supported')

def lambda_handler(event, context):
    response = dispatch(event)
    return response