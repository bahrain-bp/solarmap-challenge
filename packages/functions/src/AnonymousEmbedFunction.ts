import { QuickSightClient, GenerateEmbedUrlForAnonymousUserCommand } from "@aws-sdk/client-quicksight";
import { APIGatewayProxyHandler } from "aws-lambda";

export const handler: APIGatewayProxyHandler = async (event, context) => {
  const dashboardId = "5c860b60-5e39-4a81-857e-4283698b93b2";
  const dashboardRegion = "us-east-1";
  const awsAccountId = "211125369004";
  
  const quickSightClient = new QuickSightClient({ region: dashboardRegion });

  const dashboardArn = `arn:aws:quicksight:${dashboardRegion}:${awsAccountId}:dashboard/${dashboardId}`;

  try {
    const command = new GenerateEmbedUrlForAnonymousUserCommand({
      AwsAccountId: awsAccountId,
      Namespace: 'default',
      ExperienceConfiguration: {
        Dashboard: {
          InitialDashboardId: dashboardId,
        },
      },
      AuthorizedResourceArns: [dashboardArn],
      SessionLifetimeInMinutes: 60,
    });

    const response = await quickSightClient.send(command);

    return {
      statusCode: 200,
      body: JSON.stringify(response),
      headers: {
        "Content-Type": "application/json",
      },
    };
  } catch (error) {
    console.error('Error generating QuickSight embed URL:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
      headers: {
        "Content-Type": "application/json",
      },
    };
  }
};
