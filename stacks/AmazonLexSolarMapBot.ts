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
import { AmazonLexSolarMapFulfillment } from "./AmazonLexSolarMapFulfillment";

export function AmazonLexSolarMapBot({ stack }: StackContext) {

    const amazonLexSolarMapFulfillment = use(AmazonLexSolarMapFulfillment);
    const fulfillmentFunction = amazonLexSolarMapFulfillment.fulfillmentFunction;
    

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
        }
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
        slotTypeName: 'SolarMapSlot',
        description: 'Everything Solar Map',
        valueSelectionSetting: {
            resolutionStrategy: 'OriginalValue'
        },
        slotTypeValues: [
            { sampleValue: { value: 'About' } },
            { sampleValue: { value: 'Contractors' } },
            { sampleValue: { value: 'Consultants' } },
            { sampleValue: { value: 'Calculation' } },
            { sampleValue: { value: 'Process' } },
            { sampleValue: { value: 'More' } },
            { sampleValue: { value: 'Data & Privacy' } },
        ],
    });

    const welcomeIntent = locale.addIntent({
        intentName: 'WelcomeIntent',
        description: 'Intent to provide user with all around solar map information',
        sampleUtterances: [
            { utterance: 'Hello SolarMap' },
            { utterance: 'Hi SolarMap' },
            { utterance: 'About' },
            { utterance: 'Tell me more' },
            { utterance: 'What is this?' },
            { utterance: 'Who are you?' },
            { utterance: 'How can I get started?' },
            { utterance: 'Good morning' },
            { utterance: 'Good afternoon' },
            { utterance: 'Explain'},
            { utterance: 'Another'},
            { utterance: 'Next'},
            { utterance: 'Again'},
        ],
        fulfillmentCodeHook: {
            enabled: true,
                // PostFulfillmentStatusSpecification: { // Last updates here
                //     successResponse: {
                //         messageGroups: [
                //             {
                //                 message: {
                //                     plainTextMessage: {
                //                         value: 'Okay, your request has been successfuly processed.'
                //                     },
                //                 },
                //             },
                //         ],
                //     },
                //     failureResponse: {
                //         messageGroups: [
                //             {
                //                 message: {
                //                     plainTextMessage: {
                //                         value: 'Okay, please choose another category.'
                //                     },
                //                 },
                //             },
                //         ],
                //     }

                // },
        },
        intentConfirmationSetting: {
            promptSpecification: {
                messageGroups: [
                    {
                        message: {
                            plainTextMessage: {
                                value: 'Okay, your selected category is "{SolarMapSlot}", please confirm.',
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
                                value: 'Okay, please choose another category.'
                            },
                        },
                    },
                ],
            },
        },
    });

    welcomeIntent.addSlot({
        slotName: 'SolarMapSlot',
        slotTypeName: 'SolarMapSlot',
        description: 'The type of category to learn about',
        valueElicitationSetting: {
            slotConstraint: 'Required',
            promptSpecification: {
                messageGroups: [
                    {
                        message: {
                            plainTextMessage: {
                                value: 'Welcome to Solar Map Bot. Which of the following categories from "About", "Contractors", "Consultants", "Calculation", "Process", "Data & Privacy", or "More", would you like to learn about?',
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
        botAliasName: 'liveAlias',
        botVersion: version.botVersion(),
        botAliasLocaleSettings: {
            en_US: {
                codeHookSpecification: { 
                    lambdaCodeHook: { 
                       codeHookInterfaceVersion: "1.0",
                       lambdaARN: fulfillmentFunction.functionArn,
                    }
                 },
                 enabled: true,
            },
        },
    });

    
    
}
