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
        'OrderFlowersBot',
        provider.serviceToken(),
        {
            botName: 'OrderFlowersBot',
            dataPrivacy: {
                childDirected: false,
            },
            description: 'Bot to order flowers on the behalf of a user',
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
        slotTypeName: 'FlowerTypes',
        description: 'Types of flowers to pick up',
        valueSelectionSetting: {
            resolutionStrategy: 'OriginalValue'
        },
        slotTypeValues: [
            { sampleValue: { value: 'lillies' } },
            { sampleValue: { value: 'roses' } },
            { sampleValue: { value: 'tulips' } },
        ],
    });

    const orderFlowers = locale.addIntent({
        intentName: 'OrderFlowers',
        description: 'Intent to order a bouquet of flowers for pick up',
        sampleUtterances: [
            { utterance: 'I would like to pick up flowers' },
            { utterance: 'I would like to order some flower' },
        ],
        intentConfirmationSetting: {
            promptSpecification: {
                messageGroups: [
                    {
                        message: {
                            plainTextMessage: {
                                value: 'Okay, your {FlowerType} will be ready for pickup by {PickupTime} on {PickupDate}. Does this sound okay?',
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
                                value: 'Okay, I will not place your order.'
                            },
                        },
                    },
                ],
            },
        },
    });

    orderFlowers.addSlot({
        slotName: 'FlowerType',
        slotTypeName: 'FlowerTypes',
        description: 'The type of flowers to pick up',
        valueElicitationSetting: {
            slotConstraint: 'Required',
            promptSpecification: {
                messageGroups: [
                    {
                        message: {
                            plainTextMessage: {
                                value: 'What type of flowers would you like to order?',
                            },
                        },
                    },
                ],
                maxRetries: 2,
            },
        },
    });

    orderFlowers.addSlot({
        slotName: 'PickupDate',
        slotTypeName: 'AMAZON.Date',
        description: 'The date to pick up the flowers',
        valueElicitationSetting: {
            slotConstraint: 'Required',
            promptSpecification: {
                messageGroups: [
                    {
                        message: {
                            plainTextMessage: {
                                value: 'What day do you want the {FlowerType} to be picked up?',
                            },
                        },
                    },
                ],
                maxRetries: 2,
            },
        },
    });

    orderFlowers.addSlot({
        slotName: 'PickupTime',
        slotTypeName: 'AMAZON.Time',
        description: 'The time to pick up the flowers',
        valueElicitationSetting: {
            slotConstraint: 'Required',
            promptSpecification: {
                messageGroups: [
                    {
                        message: {
                            plainTextMessage: {
                                value: 'At what time do you want the {FlowerType} to be picked up?',
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
