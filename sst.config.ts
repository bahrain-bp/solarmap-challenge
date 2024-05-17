import { SSTConfig } from "sst";
import { FrontendStack } from "./stacks/FrontendStack";
import { DBStack } from "./stacks/DBStack";
import { ApiStack } from "./stacks/ApiStack";
import { ImageBuilderForCodeCatalyst } from "./stacks/devops/ImageBuilderForCodeCatalyst";
import { OIDCForGitHubCI } from "./stacks/devops/OIDCForGitHubCI";
import { DocumentProcessingStack } from "./stacks/DocumentProcessingStack";
import { MapStack } from "./stacks/MapStack";
import { AuthStack } from "./stacks/AuthStack";
import { ImgDetection } from "./sta./stacks/ImgDetection

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
    
    if (app.stage == 'devops-coca') {
      app.stack(ImageBuilderForCodeCatalyst)
    }
    else if (app.stage == 'devops-gh') {
      app.stack(OIDCForGitHubCI)
    }
    else {
      app.stack(DBStack)
      .stack(AuthStack)
      .stack(DocumentProcessingStack) // Initialize "DocumentProcessingStack" stack before "ApiStack" stack (Dependency)
      .stack(ImgDetection)
      .stack(ApiStack)
      .stack(MapStack)
      .stack(FrontendStack)
    }
  }
} satisfies SSTConfig;
