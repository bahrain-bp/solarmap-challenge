import { Function, Bucket, Queue, StackContext, use } from "sst/constructs";
import { aws_lambda as lambda} from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Duration } from "aws-cdk-lib";

export function DocumentProcessingStack({ stack }: StackContext) {
    // Creating Lambda Function

    const lambdaFunction = new lambda.Function(stack, 'Vehicles-Lambda', {
        functionName: stack.stage + '-lambda-for-sqs',
        runtime: lambda.Runtime.PYTHON_3_11,
        handler: 'intentAmazonLexFulfillment.lambda_handler',
        memorySize: 512,
        timeout: Duration.seconds(60),
        // code: lambda.Code.fromInline('print("Hello World")'),
        code: lambda.Code.fromAsset('../amakin-open-parking/packages/functions/src/vehicle-processing-lambda/'),
    });
  
}