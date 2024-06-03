import { SSTConfig } from "sst";
import { FrontendStack } from "./stacks/FrontendStack";
import { DBStack } from "./stacks/DBStack";
import { ApiStack } from "./stacks/ApiStack";
import { ImageBuilderForCodeCatalyst } from "./stacks/devops/ImageBuilderForCodeCatalyst";
import { OIDCForGitHubCI } from "./stacks/devops/OIDCForGitHubCI";
import { DocumentProcessingStack } from "./stacks/DocumentProcessingStack";
import { MapStack } from "./stacks/MapStack";
import { AuthStack } from "./stacks/AuthStack";
import { ImgDetection } from "./stacks/ImgDetection";

import { AmazonLexSolarMapBot } from "./stacks/AmazonLexSolarMapBot";
import { AmazonLexSolarMapFulfillment } from "./stacks/AmazonLexSolarMapFulfillment";

import { WebSocketStack } from "./stacks/WebSocketStack";


export default {
  config(_input) {
    return {
      name: "codecatalyst-sst-app",
      region: "us-east-1",
    };
  },
  stacks(app) {
    // Remove all resources when non-prod stages are removed
    if (app.stage !== "prod") {
      app.setDefaultRemovalPolicy("destroy");
    }

    const stackBaseName = `SolarMapBot-${app.stage}`;  // Dynamic stack name including the stage
    
    if (app.stage == 'devops-coca') {
      app.stack(ImageBuilderForCodeCatalyst)
    }
    else if (app.stage == 'devops-gh') {
      app.stack(OIDCForGitHubCI)
    }
    else {
      app.stack(DBStack)
      .stack(AuthStack)
      .stack(WebSocketStack)
      .stack(DocumentProcessingStack) // Initialize "DocumentProcessingStack" stack before "ApiStack" stack (Dependency)
      
      .stack(ImgDetection)

      .stack(AmazonLexSolarMapFulfillment)
      .stack(AmazonLexSolarMapBot, {
        stackName: stackBaseName
      })

      .stack(ApiStack)
      .stack(MapStack)  
      .stack(FrontendStack)
    }
  }
} satisfies SSTConfig;
