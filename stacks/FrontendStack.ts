import { Fn } from "aws-cdk-lib";
import {
  AllowedMethods,
  OriginProtocolPolicy,
  OriginSslPolicy,
  ViewerProtocolPolicy,
} from "aws-cdk-lib/aws-cloudfront";
import { HttpOrigin } from "aws-cdk-lib/aws-cloudfront-origins";

import { StaticSite, StackContext, use } from "sst/constructs";
import { ApiStack } from "./ApiStack";
import { MapStack } from "./MapStack";
import { AuthStack } from "./AuthStack";
import { WebSocketStack } from "./WebSocketStack";

export function FrontendStack({ stack, app }: StackContext) {

  const {api, apiCachePolicy} = use(ApiStack);
  const { mapName, identityPoolId } = use(MapStack);
  const {userPoolId, userPoolClientId} = use(AuthStack);
  const { ws } = use(WebSocketStack);


  // const existingDistributionId = "EDEPL5WMAI026";
  // const existingDomainName = "d36no989weouwx.cloudfront.net";

  // Deploy our React app
  const site = new StaticSite(stack, "ReactSite", {
    path: "packages/frontend",
    buildCommand: "npm run build",
    buildOutput: "dist",
    environment: {
      VITE_API_URL: api.url,
      VITE_APP_REGION: app.region,
      VITE_MAP_NAME: mapName,
      VITE_IDENTITY_POOL_ID: identityPoolId,
      VITE_USER_POOL_ID: userPoolId,
      VITE_USER_POOL_CLIENT_ID: userPoolClientId,
      VITE_WEB_SOCKET_API_KEY: ws.url,
    },
    cdk: {
      distribution: {
        /*distributionId: existingDistributionId,*/
        additionalBehaviors: {
          "/api/*": {
            origin: new HttpOrigin(/*existingDistributionId*/Fn.parseDomainName(api.url), {
              originSslProtocols: [OriginSslPolicy.TLS_V1_2],
              protocolPolicy: OriginProtocolPolicy.HTTPS_ONLY,
            }),
            viewerProtocolPolicy: ViewerProtocolPolicy.HTTPS_ONLY,
            cachePolicy: {
              cachePolicyId: apiCachePolicy.cachePolicyId,
            },
            allowedMethods: AllowedMethods.ALLOW_ALL,
            cachedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
          },
        },
      },
    }
  });

  
  // Show the URLs in the output
  stack.addOutputs({
    SiteUrl: site.url,
    ApiEndpoint: api.url,
  });
}
