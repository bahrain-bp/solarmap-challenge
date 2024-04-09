import { Api, Cognito, StackContext, use } from "sst/constructs";
import { ApiStack } from "./ApiStack";
import * as iam from "aws-cdk-lib/aws-iam";

export function AuthStack({ stack }: StackContext) {
  // Create Api
//   const api = new Api(stack, "Api", {
//     defaults: {
//       authorizer: "iam",
//     },
//     routes: {
//       "GET /private": "packages/functions/src/private.main",
//       "GET /public": {
//         function: "packages/functions/src/public.main",
//         authorizer: "none",
//       },
//     },
//   });

  const {api} = use(ApiStack);

  const list_users = api.getFunction("GET /admin/users");
  list_users?.role?.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonCognitoPowerUser"));

  // Create auth provider
const auth = new Cognito(stack, "Auth", {
    login: ["email"],
  });
  
  // Allow authenticated users invoke API
  auth.attachPermissionsForAuthUsers(stack, [api]);


  // Show the API endpoint and other info in the output
  stack.addOutputs({
    UserPoolId: auth.userPoolId,
    IdentityPoolId: auth.cognitoIdentityPoolId,
    UserPoolClientId: auth.userPoolClientId,
  });
}