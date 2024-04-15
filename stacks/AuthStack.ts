import { Api, Cognito, StackContext } from "sst/constructs";

export function AuthStack({ stack }: StackContext) {
    // Create Api
    const api = new Api(stack, "AuthApi", {
        defaults: {
            authorizer: "iam",
        },
        routes: {
            "GET /private": "packages/functions/src/private.main",
            "GET /public": {
                function: "packages/functions/src/public.main",
                authorizer: "none",
            },
        },
    });

    // Create auth provider
    const auth = new Cognito(stack, "Auth", {
        login: ["email"],
    });

    // Allow authenticated users invoke API
    auth.attachPermissionsForAuthUsers(stack, [api]);

    stack.addOutputs({
        UserPoolId: auth.userPoolId,
        IdentityPoolId: auth.cognitoIdentityPoolId,
        UserPoolClientId: auth.userPoolClientId,
      });

}