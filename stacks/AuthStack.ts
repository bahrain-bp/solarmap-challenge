import { Api, Cognito, StackContext, StaticSite } from "sst/constructs";

export function AuthStack({ stack, app }: StackContext) {
  // Create Api
  const api = new Api(stack, "AuthApi", {
    defaults: {
      authorizer: "iam",
    },
    routes: {
      "GET /private": "packages/functions/src/private.main",
    },
  });

// Create auth provider
const auth = new Cognito(stack, "Auth", {
    login: ["email"],
  });
  
  // Allow authenticated users invoke API
  auth.attachPermissionsForAuthUsers(stack, [api]);

  const site = new StaticSite(stack, "Site", {
    path: "frontend",
    environment: {
      VITE_APP_API_URL: api.url,
      VITE_APP_REGION: app.region,
      VITE_APP_USER_POOL_ID: auth.userPoolId,
      VITE_APP_USER_POOL_CLIENT_ID: auth.userPoolClientId,
    },
  });
  
  // Show the API endpoint and other info in the output
  stack.addOutputs({
    ApiEndpoint: api.url,
    UserPoolId: auth.userPoolId,
    UserPoolClientId: auth.userPoolClientId,
    SiteUrl: site.url,
  });
}