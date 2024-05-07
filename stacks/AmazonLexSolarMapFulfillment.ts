import { Function, Bucket, Queue, StackContext, use } from "sst/constructs";
import { aws_lambda as lambda } from 'aws-cdk-lib';
import { ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Duration, aws_iam as iam } from "aws-cdk-lib";

export function AmazonLexSolarMapFulfillment({ stack }: StackContext) {
    // Creating Lambda Function

    const lambdaFunction = new lambda.Function(stack, 'Vehicles-Lambda', {
        functionName: stack.stage + '-lambda-for-lex-bot',
        runtime: lambda.Runtime.PYTHON_3_11,
        handler: 'intentAmazonLexFulfillment.lambda_handler',
        memorySize: 512,
        timeout: Duration.seconds(60),
        // code: lambda.Code.fromInline('print("Hello World")'),
        code: lambda.Code.fromAsset('packages/functions/src/LexBot/'),
    });

    // Grant permission for the Lambda function to interact with Amazon Lex
    lambdaFunction.grantInvoke(new ServicePrincipal('lex.amazonaws.com'));

    lambdaFunction.addPermission('lex-fulfillment', {
        action: 'lambda:InvokeFunction', 
        principal: new iam.ServicePrincipal('lex.amazonaws.com')
    })

}