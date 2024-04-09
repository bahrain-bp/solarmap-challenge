import AWS from "aws-sdk";
import { APIGatewayProxyEvent } from "aws-lambda";

export async function list() {
    const params = {
        UserPoolId: 'us-east-1_1YwYDMjHG'
    };
    
    const Cognito = new AWS.CognitoIdentityServiceProvider();
    const users = await Cognito.listUsers(params).promise();
    return users;
}