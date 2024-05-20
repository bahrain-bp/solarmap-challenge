import { Function, Bucket, Queue, StackContext, use } from "sst/constructs";
import { aws_lambda as lambda } from 'aws-cdk-lib';
import { ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Duration, aws_iam as iam } from "aws-cdk-lib";

export function AmazonLexSolarMapFulfillment({ stack }: StackContext) {
    // Creating Lambda Function

    const fulfillmentFunction = new lambda.Function(stack, 'Fulfillment-Lambda', {
        functionName: stack.stage + '-fulfillment-lambda-for-lex-bot',
        runtime: lambda.Runtime.PYTHON_3_11,
        handler: 'intentAmazonLexFulfillment.lambda_handler',
        memorySize: 512,
        timeout: Duration.seconds(60),
        // code: lambda.Code.fromInline('print("Hello World")'),
        code: lambda.Code.fromAsset('packages/functions/LexBot/fulfillment/'),
    });

    // Grant permission for the Lambda function to interact with Amazon Lex
    fulfillmentFunction.grantInvoke(new ServicePrincipal('lex.amazonaws.com'));

    fulfillmentFunction.addPermission('lex-fulfillment', {
        action: 'lambda:InvokeFunction',
        principal: new iam.ServicePrincipal('lex.amazonaws.com')
    })

    const communicationFunction = new lambda.Function(stack, 'Communication-Lambda', {
        functionName: stack.stage + '-communication-lambda-for-lex-bot',
        runtime: lambda.Runtime.PYTHON_3_11,
        handler: 'communicateAmazonLexLambda.lambda_handler',
        memorySize: 512,
        timeout: Duration.seconds(60),
        // code: lambda.Code.fromInline('print("Hello World")'),
        code: lambda.Code.fromAsset('packages/functions/LexBot/communication/'),
    });

    // Grant permission for the Lambda function to interact with Amazon Lex
    communicationFunction.grantInvoke(new ServicePrincipal('lex.amazonaws.com'));

    communicationFunction.addPermission('lex-fulfillment', {
        action: 'lambda:InvokeFunction',
        principal: new iam.ServicePrincipal('lex.amazonaws.com')
    })



    return { fulfillmentFunction, communicationFunction }
}