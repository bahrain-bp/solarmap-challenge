import * as cdk from "aws-cdk-lib";
import { CfnOutput, RemovalPolicy } from "aws-cdk-lib";
import {
    AccountRecovery,
    OAuthScope,
    UserPool,
    UserPoolClient,
  } from "aws-cdk-lib/aws-cognito";
  import { Construct } from "constructs";
import { StackContext } from "sst/constructs";

export function AuthStack({ stack }: StackContext) {

const cognito = new UserPool(stack, "SolarMapUserPool", {
    signInAliases: {
      email: true,
      username: false,
    },
    standardAttributes: {
      email: {
        required: true,
      },
      givenName: {
        required: true,
        mutable: true,
      },
      familyName: {
        required: true,
        mutable: true,
      },
    },
    passwordPolicy: {
      minLength: 8,
      requireLowercase: true,
      requireUppercase: true,
      requireDigits: true,
    },
    accountRecovery: AccountRecovery.EMAIL_ONLY,
    removalPolicy: RemovalPolicy.DESTROY,
  });

  const userPoolClient = new UserPoolClient(stack, "SolarMapClient", {
    userPool: cognito,
    authFlows: {
      userPassword: true,
      userSrp: true,
    },
    generateSecret: false,
    oAuth: {
      flows: {
        authorizationCodeGrant: true,
      },
      scopes: [OAuthScope.EMAIL, OAuthScope.OPENID, OAuthScope.PROFILE],
      callbackUrls: ["http://localhost:5173"],
    },
  });

  new CfnOutput(stack, "UserPoolId", {
    value: cognito.userPoolId || "",
  });

  new CfnOutput(stack, "UserPoolClientId", {
    value: userPoolClient.userPoolClientId || "",
  });
}