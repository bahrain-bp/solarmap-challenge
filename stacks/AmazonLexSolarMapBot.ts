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
        'YourBotName', // Replace 'YourBotName' with your actual bot name
        provider.serviceToken(),
        {
            botName: 'YourBotName', // Replace 'YourBotName' with your actual bot name
            dataPrivacy: {
                childDirected: false,
            },
            description: 'Description of your bot', // Provide a description for your bot
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
        slotTypeName: 'YourSlotType', // Specify your slot type name
        description: 'Description of your slot type', // Provide a description for your slot type
        valueSelectionSetting: {
            resolutionStrategy: 'OriginalValue'
        },
        slotTypeValues: [
            { sampleValue: { value: 'value1' } }, // Replace 'value1' with your slot values
            { sampleValue: { value: 'value2' } }, // Replace 'value2' with your slot values
            // Add more slot values as needed
        ],
    });

    const yourIntent = locale.addIntent({
        intentName: 'YourIntentName', // Specify your intent name
        description: 'Description of your intent', // Provide a description for your intent
        sampleUtterances: [
            { utterance: 'Your sample utterance 1' }, // Replace with your sample utterances
            { utterance: 'Your sample utterance 2' }, // Replace with your sample utterances
            // Add more sample utterances as needed
        ],
        intentConfirmationSetting: {
            promptSpecification: {
                messageGroups: [
                    {
                        message: {
                            plainTextMessage: {
                                value: 'Your confirmation prompt message', // Replace with your confirmation prompt message
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
                                value: 'Your declination response message' // Replace with your declination response message
                            },
                        },
                    },
                ],
            },
        },
    });

    yourIntent.addSlot({
        slotName: 'YourSlotName', // Specify your slot name
        slotTypeName: 'YourSlotType', // Specify your slot type name
        description: 'Description of your slot', // Provide a description for your slot
        valueElicitationSetting: {
            slotConstraint: 'Required',
            promptSpecification: {
                messageGroups: [
                    {
                        message: {
                            plainTextMessage: {
                                value: 'Your value elicitation prompt message', // Replace with your value elicitation prompt message
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
        botAliasName: 'live',
        botVersion: version.botVersion(),
        botAliasLocaleSettings: {
            en_US: {
                enabled: true
            },
        },
    });
}
