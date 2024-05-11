import { Function, Bucket, Queue, StackContext, use } from "sst/constructs";
import { aws_lambda as lambda } from 'aws-cdk-lib';
import { ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Duration, aws_iam as iam } from "aws-cdk-lib";
import { Construct } from 'constructs';
import { Stack } from 'aws-cdk-lib';
import {
  LexCustomResource,
  LexBotDefinition,
} from '@amaabca/aws-lex-custom-resources';


export function AmazonLexSolarMapBot({ stack }: StackContext) {

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
        'SolarMapBot', // Replace 'YourBotName' with your actual bot name
        provider.serviceToken(),
        {
            botName: 'SolarMapBot', // Replace 'YourBotName' with your actual bot name
            dataPrivacy: {
                childDirected: false,
            },
            description: `SolarMap Bot is a virtual guide 
            to everything solar panel in Bahrain. Get Estiamtes, 
            submit applications, check status and more!`, // Provide a description for your bot
            idleSessionTTLInSeconds: 300,
            roleArn: provider.serviceLinkedRoleArn(),
        }
    );

    // Add a language for your bot to which you can add intents/slots and slot types.
    const locale = botDefinition.addLocale({
        localeId: 'en_US', // Specify the locale ID for your bot
        nluIntentConfidenceThreshold: 0.40,
        voiceSettings: {
            voiceId: 'Ivy',
        },
    });

    locale.addSlotType({
        slotTypeName: 'PropertySizeSlot', // Specify your slot type name
        description: 'User Property Dimensions', // Provide a description for your slot type
        valueSelectionSetting: {
            resolutionStrategy: 'OriginalValue'
        },
        slotTypeValues: [
            { sampleValue: { value: 'Small' } }, 
            { sampleValue: { value: 'Medium' } }, 
            { sampleValue: { value: 'Large' } }, 
            { sampleValue: { value: '275 square meters' } }, 
            // Adding more slot values as needed
        ],
    });

    const yourIntent = locale.addIntent({
        intentName: 'GetSolarPenlInstallationEstimateIntent', // Specify your intent name
        description: 'Description of your intent', // Provide a description for your intent
        sampleUtterances: [
            { utterance: 'Calculate my solar panel installation' },
            { utterance: 'How many solar panels do I need?' }, 
            // Adding more sample utterances as needed
        ],
        intentConfirmationSetting: {
            promptSpecification: {
                messageGroups: [
                    {
                        message: {
                            plainTextMessage: {
                                value: `Thank you for providing the information.
                                Just to confirm, you're requesting a solar panel installation estimate for.`, // Replace with your confirmation prompt message
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
                                value: 'Okay, I have canceled your calculation request.' // Replace with your declination response message
                            },
                        },
                    },
                ],
            },
        },
    });

    yourIntent.addSlot({
        slotName: 'PropertySizeSlot', // Specify your slot name
        slotTypeName: 'PropertySizeSlot', // Specify your slot type name
        // description: 'Description of your slot', // Provide a description for your slot
        valueElicitationSetting: {
            slotConstraint: 'Required',
            promptSpecification: {
                messageGroups: [
                    {
                        message: {
                            plainTextMessage: {
                                value: `Please specify the size of your property. Is it small, medium, large,
                                or provide a custom estimate based on square meters?`, // Replace with your value elicitation prompt message
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
        botAliasName: 'SolarMapBotLive',
        botVersion: version.botVersion(),
        botAliasLocaleSettings: {
            en_US: {
                enabled: true
            },
        },
    });
}
