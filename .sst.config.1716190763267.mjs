import { createRequire as topLevelCreateRequire } from 'module';const require = topLevelCreateRequire(import.meta.url);
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

// stacks/FrontendStack.ts
import { Fn as Fn2 } from "aws-cdk-lib";
import {
  AllowedMethods,
  OriginProtocolPolicy,
  OriginSslPolicy,
  ViewerProtocolPolicy
} from "aws-cdk-lib/aws-cloudfront";
import { HttpOrigin } from "aws-cdk-lib/aws-cloudfront-origins";
import { StaticSite, use as use3 } from "sst/constructs";

// stacks/ApiStack.ts
import { Api as Api2, use as use2 } from "sst/constructs";

// stacks/DBStack.ts
import { Table, RDS } from "sst/constructs";
import * as rds from "aws-cdk-lib/aws-rds";
import * as secretsManager from "aws-cdk-lib/aws-secretsmanager";
import * as path from "path";
import { Fn } from "aws-cdk-lib";
function DBStack({ stack, app }) {
  const table = new Table(stack, "Counter", {
    fields: {
      counter: "string"
    },
    primaryIndex: { partitionKey: "counter" }
  });
  const mainDBLogicalName = "MainDatabase";
  const dbSecretArnOutputName = "DBSecretArn";
  const dbClusterIdentifierOutputName = "DBClusterIdentifier";
  if (app.stage == "prod") {
    const db = new RDS(stack, mainDBLogicalName, {
      engine: "mysql5.7",
      defaultDatabaseName: "maindb",
      migrations: [".", "packages", "db-migrations"].join(path.sep)
    });
    stack.addOutputs({
      [dbSecretArnOutputName]: {
        value: db.secretArn,
        exportName: dbSecretArnOutputName
      },
      [dbClusterIdentifierOutputName]: {
        value: db.clusterIdentifier,
        exportName: dbClusterIdentifierOutputName
      }
    });
    return { db };
  } else {
    const existing_secret = secretsManager.Secret.fromSecretCompleteArn(stack, "ExistingSecret", Fn.importValue(dbSecretArnOutputName));
    const db = new RDS(stack, "ExistingDatabase", {
      engine: "mysql5.7",
      defaultDatabaseName: "maindb",
      migrations: [".", "packages", "db-migrations"].join(path.sep),
      cdk: {
        cluster: rds.ServerlessCluster.fromServerlessClusterAttributes(stack, "ExistingCluster", {
          // Import the existing cluster identifier from the exported value
          clusterIdentifier: Fn.importValue(dbClusterIdentifierOutputName),
          secret: existing_secret
        }),
        secret: existing_secret
      }
    });
    return { db };
  }
}
__name(DBStack, "DBStack");

// stacks/ApiStack.ts
import { CacheHeaderBehavior, CachePolicy } from "aws-cdk-lib/aws-cloudfront";
import { Duration as Duration2 } from "aws-cdk-lib/core";

// stacks/DocumentProcessingStack.ts
import { Function, Bucket, Queue, use } from "sst/constructs";
import * as iam from "aws-cdk-lib/aws-iam";
import { Duration } from "aws-cdk-lib";
function DocumentProcessingStack({ stack }) {
  const { db } = use(DBStack);
  const filterFunction = new Function(stack, "filterFunction", {
    handler: "packages/functions/src/filter-pdf-lambda.handler",
    timeout: "120 seconds",
    memorySize: 256,
    retryAttempts: 0
    /*runtime: "python3.11"*/
  });
  filterFunction.bind([db]);
  const filterQueue = new Queue(stack, "Filter-Queue", {
    consumer: filterFunction,
    cdk: {
      queue: {
        fifo: true,
        contentBasedDeduplication: true,
        queueName: stack.stage + "-queue-for-filter.fifo",
        visibilityTimeout: Duration.seconds(120)
      }
    }
  });
  const documentsFunction = new Function(stack, "documentsFunction", {
    handler: "packages/functions/src/process-pdf-lambda.handler",
    timeout: "120 seconds",
    memorySize: 256,
    retryAttempts: 0,
    environment: { QUEUE_URL: filterQueue.queueUrl }
    /*runtime: "python3.11"*/
  });
  const documentsQueue = new Queue(stack, "Document-Queue", {
    consumer: documentsFunction,
    cdk: {
      queue: {
        // fifo: true,
        // contentBasedDeduplication: true,
        queueName: stack.stage + "-queue-for-documents",
        visibilityTimeout: Duration.seconds(120)
      }
    }
  });
  documentsFunction.attachPermissions(["s3", "dynamodb", "sqs"]);
  documentsFunction.addToRolePolicy(new iam.PolicyStatement({
    actions: ["textract:*"],
    resources: ["*"]
    // Adjust resource pattern as needed
  }));
  documentsFunction.addToRolePolicy(new iam.PolicyStatement({
    actions: ["comprehend:*"],
    resources: ["*"]
    // Adjust resource pattern as needed
  }));
  const artificatsBucket = new Bucket(stack, "Artifacts-Bucket", {
    name: stack.stage + "-s3-for-artifacts",
    blockPublicACLs: true,
    notifications: {
      pdfNotification: {
        type: "queue",
        queue: documentsQueue,
        events: ["object_created"],
        filters: [{ prefix: "uploads/" }, { suffix: ".pdf" }]
      },
      pngNotification: {
        type: "queue",
        queue: documentsQueue,
        events: ["object_created"],
        filters: [{ prefix: "uploads/" }, { suffix: ".png" }]
      },
      jpegNotification: {
        type: "queue",
        queue: documentsQueue,
        events: ["object_created"],
        filters: [{ prefix: "uploads/" }, { suffix: ".jpeg" }]
      }
    }
  });
  stack.addOutputs({
    QueueARN: documentsQueue.queueArn,
    Bucket: artificatsBucket.bucketName
  });
  return { artificatsBucket };
}
__name(DocumentProcessingStack, "DocumentProcessingStack");

// stacks/ApiStack.ts
import { PolicyStatement as PolicyStatement2 } from "aws-cdk-lib/aws-iam";

// stacks/ImgDetection.ts
import { Bucket as Bucket2, Queue as Queue2 } from "sst/constructs";
function ImgDetection({ stack }) {
  const queue = new Queue2(stack, "myQueue", {
    consumer: "packages/functions/src/imageDetection.handler"
  });
  const bucket = new Bucket2(stack, "myBucket", {
    notifications: {
      myNotification: {
        type: "queue",
        queue,
        events: ["object_created"]
      }
    }
  });
  return {
    queue,
    bucket
  };
}
__name(ImgDetection, "ImgDetection");

// stacks/EmailAPIStack.ts
import { Api } from "sst/constructs";
function EmailAPIStack({ stack }) {
  const api = new Api(stack, "EmailsApi", {
    routes: {
      "POST /send-email": {
        function: {
          handler: "packages/functions/src/send-email.sendEmail",
          permissions: ["ses:SendEmail"]
          // Grant permission to send emails via SES
        }
      }
    }
  });
  stack.addOutputs({
    ApiEndpoint: api.url
  });
  return {
    api
  };
}
__name(EmailAPIStack, "EmailAPIStack");

// stacks/ApiStack.ts
function ApiStack(context) {
  const { app, stack } = context;
  const documentProcessingStack = use2(DocumentProcessingStack);
  const artifactsBucket = documentProcessingStack.artificatsBucket;
  const imgDetection = use2(ImgDetection);
  const mapsBucket = imgDetection.bucket;
  const { api: emailApi } = EmailAPIStack({ app, stack });
  const { db } = use2(DBStack);
  const api = new Api2(stack, "Api", {
    defaults: {
      function: {
        bind: [db]
      }
    },
    routes: {
      // Define API routes
      "POST /": "packages/functions/src/lambda.main",
      "GET /consultants": "packages/functions/src/fetchConsultants.handler",
      "GET /contractors": "packages/functions/src/fetchContractors.handler",
      "GET /resources": "packages/functions/src/fetchEduResources.handler",
      "GET /carboncalculator": "packages/functions/src/fetchCarbonCalc.handler",
      "POST /resources": "packages/functions/src/postEduResources.handler",
      "POST /carboncalculator": "packages/functions/src/postCarbonCalc.handler",
      "POST /consultants": "packages/functions/src/postConsultants.handler",
      "POST /contractors": "packages/functions/src/postContractors.handler",
      "DELETE /resources/{resource_id}": "packages/functions/src/deleteEduResources.handler",
      "DELETE /carboncalculator/{carbon_footprint_id}": "packages/functions/src/deleteCarbonCalc.handler",
      "DELETE /consultants/{consultant_id}": "packages/functions/src/deleteConsultants.handler",
      "DELETE /contractors/{contractor_id}": "packages/functions/src/deleteContractor.handler",
      "GET /documents": "packages/functions/src/getDocumentsDetails.handler",
      "POST /postcalculation": "packages/functions/src/postCalculation.handler",
      "GET /postcalculation": "packages/functions/src/fetchCalculations.handler",
      "GET /customer": "packages/functions/src/fetchCustomer.handler",
      "POST /customer": "packages/functions/src/postCustomer.handler",
      "DELETE /customer/{customer_id}": "packages/functions/src/deleteCustomer.handler",
      "POST /inquiry": "packages/functions/src/postInquiry.handler",
      "GET /inquiry": "packages/functions/src/fetchInquiry.handler",
      // Lambda function to send SNS SMS messages to subscribed users
      "POST /subscribe": "packages/functions/src/postSubscription.handler",
      "POST /inquirycustomer": "packages/functions/src/postCustomerInquiry.handler",
      "GET /inquirycustomer": "packages/functions/src/fetchCustomerInquiry.handler",
      "POST /solarpanel": "packages/functions/src/postSolarPanels.handler",
      "GET /solarpanel": "packages/functions/src/fetchSolarPanels.handler",
      "DELETE /solarpanel/{solarpanel_id}": "packages/functions/src/deleteSolarPanels.handler",
      "PUT /solarpanel/{solarpanel_id}": "packages/functions/src/updateSolarPanels.handler",
      "POST /feedback": "packages/functions/src/postFeedback.handler",
      "GET /feedback": "packages/functions/src/fetchFeedback.handler",
      // TypeScript lambda function for MEWA bill document processing 
      // "POST /process-pdf": "packages/functions/src/process-pdf-lambda.handler",
      "POST /send-email": {
        function: {
          handler: "packages/functions/src/send-email.sendEmail",
          permissions: [new PolicyStatement2({
            actions: ["ses:SendEmail"],
            // Add the necessary SES action here
            resources: ["*"]
            // You may need to specify the resource ARN if you want to restrict it
          })]
        }
      },
      // Define routes for document upload and image detection
      "POST /upload": {
        function: {
          handler: "packages/functions/src/document-upload-s3.handler",
          permissions: [new PolicyStatement2({
            actions: ["s3:*"],
            resources: [artifactsBucket.bucketArn + "/*"]
          })],
          environment: {
            BUCKET_NAME: artifactsBucket.bucketName
          }
        }
      },
      "POST /detectionUpload": {
        function: {
          handler: "packages/functions/src/imageDetectionUpload.handler",
          permissions: [new PolicyStatement2({
            actions: ["s3:*"],
            resources: [mapsBucket.bucketArn + "/*"]
          })],
          environment: {
            BUCKET_NAME: mapsBucket.bucketName
          }
        }
      },
      // "GET /communicate": {
      //     cdk: {
      //         function: communicationFunction,
      //     }
      // },
      // Sample Pyhton lambda function
      "GET /": {
        function: {
          handler: "packages/functions/src/sample-python-lambda/lambda.main",
          runtime: "python3.11",
          timeout: "60 seconds"
        }
      },
      // Define routes for QuickSight integration
      "GET /BusinessDashboard": {
        function: {
          handler: "packages/functions/src/AnonymousEmbedDashboardFunction.handler",
          permissions: [new PolicyStatement2({
            actions: ["quicksight:*"],
            resources: [
              "arn:aws:quicksight:*:*:namespace/default",
              "arn:aws:quicksight:*:*:dashboard/8260f2dc-bd4e-4c32-b8ce-0b6568c824cf",
              "arn:aws:quicksight:us-east-1:211125369004:topic/XUb6hHYJsspOO27IIwHYM2eEKi6bWL1n",
              "arn:aws:quicksight:us-east-1:211125369004:topic/9z9ugAtwlWsNWdWDEJBU73Mtbo3j7RBF"
            ]
          })]
        }
      },
      "GET /calculatorUsage": {
        function: {
          handler: "packages/functions/src/calcUsageStats.handler",
          permissions: [new PolicyStatement2({
            actions: ["quicksight:*"],
            resources: [
              "arn:aws:quicksight:*:*:namespace/default",
              "arn:aws:quicksight:*:*:dashboard/60731b32-1883-450f-99e9-19af71b09054",
              "arn:aws:quicksight:us-east-1:211125369004:topic/xonhtgcNUZJP5UsUTL6RtKQPgpQmPIV5"
            ]
          })]
        }
      },
      "GET /BusinessQSearchBar": {
        function: {
          handler: "packages/functions/src/AnonymousEmbedQSearchBarFunction.handler",
          permissions: [new PolicyStatement2({
            actions: ["quicksight:*"],
            resources: [
              "arn:aws:quicksight:*:*:namespace/default",
              "arn:aws:quicksight:*:*:dashboard/8260f2dc-bd4e-4c32-b8ce-0b6568c824cf",
              "arn:aws:quicksight:us-east-1:211125369004:topic/XUb6hHYJsspOO27IIwHYM2eEKi6bWL1n",
              "arn:aws:quicksight:us-east-1:211125369004:topic/9z9ugAtwlWsNWdWDEJBU73Mtbo3j7RBF"
            ]
          })]
        }
      },
      //Add dashboardID and topicID in the resources
      "GET /statisticsSearchBar": {
        function: {
          handler: "packages/functions/src/statisticsSearchBar.handler",
          permissions: [new PolicyStatement2({
            actions: ["quicksight:*"],
            resources: [
              "arn:aws:quicksight:*:*:namespace/default",
              "arn:aws:quicksight:*:*:dashboard/60731b32-1883-450f-99e9-19af71b09054",
              "arn:aws:quicksight:us-east-1:211125369004:topic/xonhtgcNUZJP5UsUTL6RtKQPgpQmPIV5"
            ]
          })]
        }
      }
    }
  });
  api.attachPermissions("*");
  const apiCachePolicy = new CachePolicy(stack, "CachePolicy", {
    minTtl: Duration2.seconds(0),
    defaultTtl: Duration2.seconds(0),
    headerBehavior: CacheHeaderBehavior.allowList(
      "Accept",
      "Authorization",
      "Content-Type",
      "Referer"
    )
  });
  return { api, apiCachePolicy, emailApi };
}
__name(ApiStack, "ApiStack");

// stacks/MapStack.ts
import {
  CfnIdentityPool,
  CfnIdentityPoolRoleAttachment
} from "aws-cdk-lib/aws-cognito";
import { Role, PolicyStatement as PolicyStatement3, Effect } from "aws-cdk-lib/aws-iam";
import { CfnMap } from "aws-cdk-lib/aws-location";
import * as cdk from "aws-cdk-lib";
function MapStack({ stack }) {
  const existingDomainName = "https://d36no989weouwx.cloudfront.net/*";
  const mapName = stack.stage === "prod" ? "production-map" : stack.stage + "-devs-map";
  const cfnMap = new CfnMap(stack, "Map", {
    configuration: {
      style: "RasterHereExploreSatellite"
    },
    mapName
  });
  const mapArn = cfnMap.attrMapArn;
  const MyIdentityPoolMap = new CfnIdentityPool(stack, "MapIdentityPool", {
    allowUnauthenticatedIdentities: true
    // Allow unauthenticated access
  });
  const identityPoolRole = new Role(stack, "MapIdentityRole", {
    assumedBy: new cdk.aws_iam.FederatedPrincipal(
      "cognito-identity.amazonaws.com",
      {
        StringEquals: {
          "cognito-identity.amazonaws.com:aud": MyIdentityPoolMap.ref
        },
        "ForAnyValue:StringLike": {
          "cognito-identity.amazonaws.com:amr": "unauthenticated"
        }
      },
      "sts:AssumeRoleWithWebIdentity"
    )
  });
  identityPoolRole.addToPolicy(
    new PolicyStatement3({
      effect: Effect.ALLOW,
      actions: ["geo:GetMap*"],
      resources: [mapArn],
      conditions: {
        StringLike: {
          "aws:referer": ["http://localhost:*/*", existingDomainName]
        }
      }
    })
  );
  new CfnIdentityPoolRoleAttachment(stack, "IdentityPoolRoleAttachment", {
    identityPoolId: MyIdentityPoolMap.ref,
    roles: {
      unauthenticated: identityPoolRole.roleArn
    }
  });
  const identityPoolId = MyIdentityPoolMap.ref;
  stack.addOutputs({
    cfnMap: cfnMap.attrMapArn,
    identityPoolId: MyIdentityPoolMap.ref
  });
  return { identityPoolId, mapName };
}
__name(MapStack, "MapStack");

// stacks/AuthStack.ts
import { CfnOutput, RemovalPolicy } from "aws-cdk-lib";
import { UserPool, AccountRecovery, UserPoolClient, OAuthScope } from "aws-cdk-lib/aws-cognito";
function AuthStack({ stack, app }) {
  const cognito = new UserPool(stack, "SolarMapUserPool", {
    signInAliases: {
      email: true,
      username: false
    },
    standardAttributes: {
      email: {
        required: true
      },
      givenName: {
        required: true,
        mutable: true
      },
      familyName: {
        required: true,
        mutable: true
      }
    },
    passwordPolicy: {
      minLength: 8,
      requireLowercase: true,
      requireUppercase: true,
      requireDigits: true
    },
    accountRecovery: AccountRecovery.EMAIL_ONLY,
    removalPolicy: RemovalPolicy.DESTROY
  });
  const userPoolClient = new UserPoolClient(stack, "SolarMapClient", {
    userPool: cognito,
    authFlows: {
      userPassword: true,
      userSrp: true
    },
    generateSecret: false,
    oAuth: {
      flows: {
        authorizationCodeGrant: true
      },
      scopes: [OAuthScope.EMAIL, OAuthScope.OPENID, OAuthScope.PROFILE]
    }
  });
  const userPoolId = cognito.userPoolId;
  const userPoolClientId = userPoolClient.userPoolClientId;
  new CfnOutput(stack, "UserPoolId", {
    value: cognito.userPoolId || ""
  });
  new CfnOutput(stack, "UserPoolClientId", {
    value: userPoolClient.userPoolClientId || ""
  });
  return { userPoolId, userPoolClientId };
}
__name(AuthStack, "AuthStack");

// stacks/FrontendStack.ts
function FrontendStack({ stack, app }) {
  const { api, apiCachePolicy } = use3(ApiStack);
  const { mapName, identityPoolId } = use3(MapStack);
  const { userPoolId, userPoolClientId } = use3(AuthStack);
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
      VITE_USER_POOL_CLIENT_ID: userPoolClientId
    },
    cdk: {
      distribution: {
        /*distributionId: existingDistributionId,*/
        additionalBehaviors: {
          "/api/*": {
            origin: new HttpOrigin(
              /*existingDistributionId*/
              Fn2.parseDomainName(api.url),
              {
                originSslProtocols: [OriginSslPolicy.TLS_V1_2],
                protocolPolicy: OriginProtocolPolicy.HTTPS_ONLY
              }
            ),
            viewerProtocolPolicy: ViewerProtocolPolicy.HTTPS_ONLY,
            cachePolicy: {
              cachePolicyId: apiCachePolicy.cachePolicyId
            },
            allowedMethods: AllowedMethods.ALLOW_ALL,
            cachedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS
          }
        }
      }
    }
  });
  stack.addOutputs({
    SiteUrl: site.url,
    ApiEndpoint: api.url
  });
}
__name(FrontendStack, "FrontendStack");

// stacks/devops/ImageBuilderForCodeCatalyst.ts
import path2 from "path";
import * as imagebuilder from "aws-cdk-lib/aws-imagebuilder";
import * as ecr from "aws-cdk-lib/aws-ecr";
import * as iam2 from "aws-cdk-lib/aws-iam";
var fs = __require("fs");
function ImageBuilderForCodeCatalyst({ stack, app }) {
  const gitComponenet = new imagebuilder.CfnComponent(stack, "GitComponenet", {
    name: app.logicalPrefixedName("Git"),
    platform: "Linux",
    version: "1.0.0",
    data: fs.readFileSync(
      path2.resolve(".codecatalyst/imagebuilder/git.yaml"),
      "utf8"
    )
  });
  const nodejsComponenet = new imagebuilder.CfnComponent(stack, "NodejsComponenet", {
    name: app.logicalPrefixedName("Nodejs"),
    platform: "Linux",
    version: "1.0.0",
    data: fs.readFileSync(
      path2.resolve(".codecatalyst/imagebuilder/node.yaml"),
      "utf8"
    )
  });
  const ecrRepoForImageBuilderCodeCatalyst = new ecr.Repository(stack, "EcrRepoForImageBuilderCodeCatalyst");
  const AmazonLinux2023wGitNodeRecipe = new imagebuilder.CfnContainerRecipe(stack, "AmazonLinux2023withGitAndNodeRecipe", {
    components: [
      {
        componentArn: gitComponenet.attrArn
      },
      {
        componentArn: nodejsComponenet.attrArn
      }
    ],
    containerType: "DOCKER",
    dockerfileTemplateData: "FROM {{{ imagebuilder:parentImage }}}\n{{{ imagebuilder:environments }}}\n{{{ imagebuilder:components }}}\n",
    name: app.logicalPrefixedName("AmazonLinux2023WithGit"),
    parentImage: `arn:aws:imagebuilder:${stack.region}:aws:image/amazon-linux-2023-x86-latest/x.x.x`,
    targetRepository: {
      repositoryName: ecrRepoForImageBuilderCodeCatalyst.repositoryName,
      service: "ECR"
    },
    version: "2.0.0"
  });
  const instanceProfileForImageBuilder = new iam2.InstanceProfile(stack, "InstanceProfileForImageBuilder", {
    role: new iam2.Role(stack, "EC2InstanceProfileForImageBuilder", {
      assumedBy: new iam2.ServicePrincipal("ec2.amazonaws.com"),
      managedPolicies: [
        {
          managedPolicyArn: "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
        },
        {
          managedPolicyArn: "arn:aws:iam::aws:policy/EC2InstanceProfileForImageBuilder"
        },
        {
          managedPolicyArn: "arn:aws:iam::aws:policy/EC2InstanceProfileForImageBuilderECRContainerBuilds"
        }
      ]
    })
  });
  const infraConfig = new imagebuilder.CfnInfrastructureConfiguration(stack, "ImageBuilderInfraConfig", {
    name: app.logicalPrefixedName("infra"),
    instanceProfileName: instanceProfileForImageBuilder.instanceProfileName
  });
  const distConfig = new imagebuilder.CfnDistributionConfiguration(stack, "ImageBuilderDistConfig", {
    name: app.logicalPrefixedName("dist"),
    distributions: [
      {
        region: stack.region,
        containerDistributionConfiguration: {
          "TargetRepository": {
            "RepositoryName": ecrRepoForImageBuilderCodeCatalyst.repositoryName,
            "Service": "ECR"
          }
        }
      }
    ]
  });
  const imageBuilderPipeline = new imagebuilder.CfnImagePipeline(stack, "AmazonLinux2023WithGitPipeline", {
    name: app.logicalPrefixedName("AmazonLinux23WithGitPipeline"),
    infrastructureConfigurationArn: infraConfig.attrArn,
    distributionConfigurationArn: distConfig.attrArn,
    containerRecipeArn: AmazonLinux2023wGitNodeRecipe.attrArn,
    status: "ENABLED"
  });
}
__name(ImageBuilderForCodeCatalyst, "ImageBuilderForCodeCatalyst");

// stacks/devops/OIDCForGitHubCI.ts
import { Duration as Duration3 } from "aws-cdk-lib";
import * as iam3 from "aws-cdk-lib/aws-iam";
function OIDCForGitHubCI({ stack }) {
  const provider = new iam3.OpenIdConnectProvider(stack, "GitHub", {
    url: "https://token.actions.githubusercontent.com",
    clientIds: ["sts.amazonaws.com"]
  });
  const organization = "bahrain-bp";
  const repository = "solarmap-challenge";
  new iam3.Role(stack, "GitHubActionsRole", {
    assumedBy: new iam3.OpenIdConnectPrincipal(provider).withConditions({
      StringLike: {
        "token.actions.githubusercontent.com:sub": `repo:${organization}/${repository}:*`
      }
    }),
    description: "Role assumed for deploying from GitHub CI using AWS CDK",
    roleName: "GitHub",
    // Change this to match the role name in the GitHub workflow file
    maxSessionDuration: Duration3.hours(1),
    inlinePolicies: {
      // You could attach AdministratorAccess here or constrain it even more, but this uses more granular permissions used by SST
      SSTDeploymentPolicy: new iam3.PolicyDocument({
        assignSids: true,
        statements: [
          new iam3.PolicyStatement({
            effect: iam3.Effect.ALLOW,
            actions: [
              "cloudformation:DeleteStack",
              "cloudformation:DescribeStackEvents",
              "cloudformation:DescribeStackResources",
              "cloudformation:DescribeStacks",
              "cloudformation:GetTemplate",
              "cloudformation:ListImports",
              "ecr:CreateRepository",
              "iam:PassRole",
              "iot:Connect",
              "iot:DescribeEndpoint",
              "iot:Publish",
              "iot:Receive",
              "iot:Subscribe",
              "lambda:GetFunction",
              "lambda:GetFunctionConfiguration",
              "lambda:UpdateFunctionConfiguration",
              "s3:ListBucket",
              "s3:PutObjectAcl",
              "s3:GetObject",
              "s3:PutObject",
              "s3:DeleteObject",
              "s3:ListObjectsV2",
              "s3:CreateBucket",
              "s3:PutBucketPolicy",
              "ssm:DeleteParameter",
              "ssm:GetParameter",
              "ssm:GetParameters",
              "ssm:GetParametersByPath",
              "ssm:PutParameter",
              "sts:AssumeRole"
            ],
            resources: [
              "*"
            ]
          })
        ]
      })
    }
  });
}
__name(OIDCForGitHubCI, "OIDCForGitHubCI");

// sst.config.ts
var sst_config_default = {
  config(_input) {
    return {
      name: "codecatalyst-sst-app",
      region: "us-east-1"
    };
  },
  stacks(app) {
    if (app.stage !== "prod") {
      app.setDefaultRemovalPolicy("destroy");
    }
    if (app.stage == "devops-coca") {
      app.stack(ImageBuilderForCodeCatalyst);
    } else if (app.stage == "devops-gh") {
      app.stack(OIDCForGitHubCI);
    } else {
      app.stack(DBStack).stack(AuthStack).stack(DocumentProcessingStack).stack(ImgDetection).stack(ApiStack).stack(MapStack).stack(FrontendStack);
    }
  }
};
export {
  sst_config_default as default
};
