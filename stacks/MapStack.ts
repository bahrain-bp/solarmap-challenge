import {
  CfnIdentityPool,
  CfnIdentityPoolRoleAttachment,
} from "aws-cdk-lib/aws-cognito";
import { Role, PolicyStatement, Effect } from "aws-cdk-lib/aws-iam";
import { CfnMap } from "aws-cdk-lib/aws-location";
import { StackContext } from "sst/constructs";
import * as cdk from "aws-cdk-lib";

export function MapStack({ stack }: StackContext) {
  const mapName =
    stack.stage === "prod" ? "prod-map" : stack.stage + "-dev-map";
  const cfnMap = new CfnMap(stack, "Map", {
    configuration: {
      style: "HybridHereExploreSatellite",
    },
    mapName: mapName,
  });

  // Save the ARN of the map in a variable
  const mapArn = cfnMap.attrMapArn;

  // Create an Identity Pool
  const MyIdentityPoolMap = new CfnIdentityPool(stack, "MapIdentityPool", {
    allowUnauthenticatedIdentities: true, // Allow unauthenticated access
  });

  // Create a role to be associated with the Identity Pool
  const identityPoolRole = new Role(stack, "MapIdentityRole", {
    assumedBy: new cdk.aws_iam.FederatedPrincipal(
      "cognito-identity.amazonaws.com",
      {
        StringEquals: {
          "cognito-identity.amazonaws.com:aud": MyIdentityPoolMap.ref,
        },
        "ForAnyValue:StringLike": {
          "cognito-identity.amazonaws.com:amr": "unauthenticated",
        },
      },
      "sts:AssumeRoleWithWebIdentity"
    ),
  });

  // Add a policy statement to the role
  identityPoolRole.addToPolicy(
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ["geo:GetMap*"],
      resources: [mapArn],
      conditions: {
        StringLike: {
          "aws:referer": ["http://localhost:*/*"],
        },
      },
    })
  );

  // Attach the roles to the Identity Pool
  new CfnIdentityPoolRoleAttachment(stack, "IdentityPoolRoleAttachment", {
    identityPoolId: MyIdentityPoolMap.ref,
    roles: {
      unauthenticated: identityPoolRole.roleArn,
    },
  });

  const identityPoolId = MyIdentityPoolMap.ref;

  stack.addOutputs({
    cfnMap: cfnMap.attrMapArn,
    identityPoolId: MyIdentityPoolMap.ref,
  });

  return { identityPoolId, mapName }
}