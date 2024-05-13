import { Function, Bucket, Queue, StackContext, use } from "sst/constructs";
import { aws_lambda as lambda, validateBoolean } from 'aws-cdk-lib';
import { ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Duration, aws_iam as iam } from "aws-cdk-lib";
import { Construct } from 'constructs';
import { Stack } from 'aws-cdk-lib';
import { AmazonLexSolarMapFulfillment } from "./AmazonLexSolarMapFulfillment";
// npm install --save @amaabca/aws-lex-custom-resources
import {
    LexCustomResource,
    LexBotDefinition,
} from '@amaabca/aws-lex-custom-resources';


export function AmazonLexSolarMapBot({ stack }: StackContext) {

    const amazonLexSolarMapFulfillment = use(AmazonLexSolarMapFulfillment);
    const fulfillmentFunction = amazonLexSolarMapFulfillment.lambdaFunction;
    
    // Setup our custom resource from the AWS Serverless Application Repo.
    // Application link: https://serverlessrepo.aws.amazon.com/applications/us-east-1/777566285978/lex-v2-cfn-cr
    const provider = new LexCustomResource(
        stack,
        'LexV2CfnCustomResource',
        {
            semanticVersion: '0.3.0',
            logLevel: 'INFO',
        }
    );

    // The LexBotDefinition class is our main entry point to Lex bot creation.
    // Once we're happy with our bot definition, call `botDefinition.build()` to
    // generate the resource.
    const botDefinition = new LexBotDefinition(
        stack,
        'SolarMapBot',
        provider.serviceToken(),
        {
            botName: 'SolarMapBot',
            dataPrivacy: {
                childDirected: false,
            },
            description: 'A guide to solar energy in Bahrain',
            idleSessionTTLInSeconds: 300,
            roleArn: provider.serviceLinkedRoleArn(),
        },
    );
    

    // Add a language for our bot to which we can add intents/slots and slot types.
    const locale = botDefinition.addLocale({
        localeId: 'en_US',
        nluIntentConfidenceThreshold: 0.40,
        voiceSettings: {
            voiceId: 'Ivy',
        },
    });

    locale.addSlotType({
        slotTypeName: 'ElectricityConsumptionSlot',
        description: 'Types of electricity consumption levels',
        valueSelectionSetting: {
            resolutionStrategy: 'OriginalValue'
        },
        slotTypeValues: [
            { sampleValue: { value: 'Low' } },
            { sampleValue: { value: 'Medium' } },
            { sampleValue: { value: 'High' } },
            { sampleValue: { value: '300 kilowatt' } },
        ],
    });

    locale.addSlotType({
        slotTypeName: 'RoofTypeSlot',
        description: 'Types of rooftops materials',
        valueSelectionSetting: {
            resolutionStrategy: 'OriginalValue'
        },
        slotTypeValues: [
            { sampleValue: { value: 'Flat' } },
            { sampleValue: { value: 'Sloped' } },
            { sampleValue: { value: 'Metal' } },
            { sampleValue: { value: 'Tile' } },
            { sampleValue: { value: 'Asphalt' } },
            { sampleValue: { value: 'Something else' } },
        ],
    });

    locale.addSlotType({
        slotTypeName: 'InstallationTimelineSlot',
        description: 'Types of installation time periods',
        valueSelectionSetting: {
            resolutionStrategy: 'OriginalValue'
        },
        slotTypeValues: [
            { sampleValue: { value: 'ASAP' } },
            { sampleValue: { value: '3 months' } },
            { sampleValue: { value: 'Anything' } },
            { sampleValue: { value: 'Flexible' } },
        ],
    });

    locale.addSlotType({
        slotTypeName: 'ShadingSlot',
        description: 'Types of shading levels',
        valueSelectionSetting: {
            resolutionStrategy: 'OriginalValue'
        },
        slotTypeValues: [
            { sampleValue: { value: 'Low' } },
            { sampleValue: { value: 'Medium' } },
            { sampleValue: { value: 'High' } },
        ],
    });

    locale.addSlotType({
        slotTypeName: 'PropertySizeSlot',
        description: 'Types of property size categories',
        valueSelectionSetting: {
            resolutionStrategy: 'OriginalValue'
        },
        slotTypeValues: [
            { sampleValue: { value: 'Small' } },
            { sampleValue: { value: 'Medium' } },
            { sampleValue: { value: 'Large' } },
            { sampleValue: { value: '200 square meters' } },
        ],
    });

    locale.addSlotType({
        slotTypeName: 'BudgetSlot',
        description: 'Types of budget categories',
        valueSelectionSetting: {
            resolutionStrategy: 'OriginalValue'
        },
        slotTypeValues: [
            { sampleValue: { value: 'Low' } },
            { sampleValue: { value: 'Medium' } },
            { sampleValue: { value: 'High' } },
        ],
    });

    locale.addSlotType({
        slotTypeName: 'LocationSlot',
        description: 'Types of location areas',
        valueSelectionSetting: {
            resolutionStrategy: 'OriginalValue'
        },
        slotTypeValues: [
            { sampleValue: { value: 'City center' } },
            { sampleValue: { value: 'Suburb' } },
            { sampleValue: { value: 'Rural area' } },
        ],
    });

    locale.addSlotType({
        slotTypeName: 'RoofOrientationSlot',
        description: 'Types of rooftop orientation angles',
        valueSelectionSetting: {
            resolutionStrategy: 'OriginalValue'
        },
        slotTypeValues: [
            { sampleValue: { value: 'South' } },
            { sampleValue: { value: 'East' } },
            { sampleValue: { value: 'Multiple directions' } },
        ],
    });

    const GetSolarPanelInstallationEstimateIntent = locale.addIntent({ 
        intentName: 'GetSolarPanelInstallationEstimateIntent',
        description: 'Intent to order a bouquet of flowers for pick up',
        sampleUtterances: [
            { utterance: 'Calculate my solar panel installation' },
            { utterance: 'How much does it cost to install solar panels on my property?' },

            { utterance: 'My property size is {PropertySizeSlot}' },
            { utterance: 'The property is {PropertySizeSlot}' },
            { utterance: 'I need a custom estimate for my property size, it is around {PropertySizeSlot}' },

            { utterance: 'The property is located in the {LocationSlot}' },
            { utterance: 'It is in {LocationSlot}' },
            { utterance: 'The property is in a {LocationSlot}' },

            { utterance: 'Our electricity consumption is {ElectricityConsumptionSlot}' },
            { utterance: 'It is a {ElectricityConsumptionSlot} consumption level' },
            { utterance: 'We have {ElectricityConsumptionSlot} electricity consumption' },

            { utterance: 'The roof faces {RoofOrientationSlot}' },
            { utterance: 'The property is located in the {LocationSlot}' },
            { utterance: 'The roof has {RoofOrientationSlot}' },

            { utterance: 'There is {ShadingSlot} shading on the roof' },
            { utterance: 'Some areas have {ShadingSlot} shading' },
            { utterance: 'We have {ShadingSlot} due to surrounding trees' },

            { utterance: 'Our budget is {BudgetSlot} looking for basic installation' },
            { utterance: 'We have a {BudgetSlot} budget for standard installation' },
            { utterance: 'We can afford {BudgetSlot} budget for premium installation' },

            { utterance: 'We need the installation done {InstallationTimelineSlot}' },
            { utterance: 'Within {InstallationTimelineSlot} would be ideal' },
            { utterance: 'We are {InstallationTimelineSlot} with the installation time' },
        ],
        intentConfirmationSetting: {
            promptSpecification: {
                messageGroups: [
                    {
                        message: {
                            plainTextMessage: {
                                value: 'Thank you for providing the information. Just to confirm, you are requesting a solar panel installation estimate for a {PropertySizeSlot} property located in {LocationSlot}. Your average electricity consumption is {ElectricityConsumptionSlot}, and your roof orientation is {RoofOrientationSlot}. The roof type is {RoofTypeSlot}, and it receives {ShadingSlot} shading. Your budget for the installation is {BudgetSlot}, and you would like the installation to be completed {InstallationTimelineSlot}. Is all this information correct?',
                            },
                        },
                    },
                ],
                maxRetries: 2,
            },
            declinationResponse: {
                messageGroups: [
                    {
                        message: {
                            plainTextMessage: {
                                value: 'Okay, I have canceled your calculation request.'
                            },
                        },
                    },
                ],
            },
        },
    });

    GetSolarPanelInstallationEstimateIntent.addSlot({
        slotName: 'PropertySizeSlot',
        slotTypeName: 'PropertySizeSlot',
        valueElicitationSetting: {
            slotConstraint: 'Required',
            promptSpecification: {
                messageGroups: [
                    {
                        message: {
                            plainTextMessage: {
                                value: 'Please specify the size of your property. Is it small, medium, large, or would you prefer a custom estimate based on square meters?',
                            },
                        },
                    },
                ],
                maxRetries: 2,
            },
        },
    });

    GetSolarPanelInstallationEstimateIntent.addSlot({
        slotName: 'LocationSlot',
        slotTypeName: 'LocationSlot',
        valueElicitationSetting: {
            slotConstraint: 'Required',
            promptSpecification: {
                messageGroups: [
                    {
                        message: {
                            plainTextMessage: {
                                value: 'Could you tell me the location of your property? Is it in the city center, suburb, or rural area?',
                            },
                        },
                    },
                ],
                maxRetries: 2,
            },
        },
    });

    GetSolarPanelInstallationEstimateIntent.addSlot({
        slotName: 'ElectricityConsumptionSlot',
        slotTypeName: 'ElectricityConsumptionSlot',
        valueElicitationSetting: {
            slotConstraint: 'Required',
            promptSpecification: {
                messageGroups: [
                    {
                        message: {
                            plainTextMessage: {
                                value: 'To provide an accurate estimate, could you please share your average electricity consumption? Would you say it is low, medium, or high, or do you have a specific value in kilowatt?',
                            },
                        },
                    },
                ],
                maxRetries: 2,
            },
        },
    });

    GetSolarPanelInstallationEstimateIntent.addSlot({
        slotName: 'RoofOrientationSlot',
        slotTypeName: 'RoofOrientationSlot',
        valueElicitationSetting: {
            slotConstraint: 'Required',
            promptSpecification: {
                messageGroups: [
                    {
                        message: {
                            plainTextMessage: {
                                value: 'What is the orientation of your roof? Does it face north, south, east, west, or multiple directions?',
                            },
                        },
                    },
                ],
                maxRetries: 2,
            },
        },
    });

    GetSolarPanelInstallationEstimateIntent.addSlot({
        slotName: 'RoofTypeSlot',
        slotTypeName: 'RoofTypeSlot',
        valueElicitationSetting: {
            slotConstraint: 'Required',
            promptSpecification: {
                messageGroups: [
                    {
                        message: {
                            plainTextMessage: {
                                value: 'What type of roof do you have? Is it flat, sloped, metal, tile, asphalt, or something else?',
                            },
                        },
                    },
                ],
                maxRetries: 2,
            },
        },
    });


    GetSolarPanelInstallationEstimateIntent.addSlot({
        slotName: 'ShadingSlot',
        slotTypeName: 'ShadingSlot',
        valueElicitationSetting: {
            slotConstraint: 'Required',
            promptSpecification: {
                messageGroups: [
                    {
                        message: {
                            plainTextMessage: {
                                value: 'Does your roof receive much shading? Would you say it is low, medium, or high?',
                            },
                        },
                    },
                ],
                maxRetries: 2,
            },
        },
    });


    GetSolarPanelInstallationEstimateIntent.addSlot({
        slotName: 'BudgetSlot',
        slotTypeName: 'BudgetSlot',
        valueElicitationSetting: {
            slotConstraint: 'Required',
            promptSpecification: {
                messageGroups: [
                    {
                        message: {
                            plainTextMessage: {
                                value: 'What is your budget for the solar panel installation? Are you looking for a low-cost, medium-cost, or high-cost installation?',
                            },
                        },
                    },
                ],
                maxRetries: 2,
            },
        },
    });

    GetSolarPanelInstallationEstimateIntent.addSlot({
        slotName: 'InstallationTimelineSlot',
        slotTypeName: 'InstallationTimelineSlot',
        valueElicitationSetting: {
            slotConstraint: 'Required',
            promptSpecification: {
                messageGroups: [
                    {
                        message: {
                            plainTextMessage: {
                                value: 'When do you need the installation to be completed? Are you looking for an ASAP installation, within 3 months, within 6 months, or are you flexible with the timeline?',
                            },
                        },
                    },
                ],
                maxRetries: 2,
            },
        },
    });


    // create/update the bot resource
    const bot = botDefinition.build();

    // create a version that automatically is built when the bot changes
    const version = bot.automaticVersion();

    // create an alias and assign it to the latest bot version
    bot.addAlias({
        botAliasName: 'FulfillmentFunctions',
        botVersion: version.botVersion(),
        botAliasLocaleSettings: {
            en_US: {
                enabled: true,
                codeHookSpecification: { 
                    lambdaCodeHook: { 
                       codeHookInterfaceVersion: "$LATEST",
                       lambdaARN: fulfillmentFunction.functionArn,
                    }
                 },
            },
        },
    });
}
