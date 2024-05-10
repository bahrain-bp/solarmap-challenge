import { QuickSightClient, GenerateEmbedUrlForAnonymousUserCommand } from "@aws-sdk/client-quicksight";
import { APIGatewayProxyHandler } from "aws-lambda";

export const handler: APIGatewayProxyHandler = async (event, context) => {
  const dashboardRegion = "us-east-1";
  const awsAccountId = "211125369004";
  
  const quickSightClient = new QuickSightClient({ region: dashboardRegion });

  try {
    const command = new GenerateEmbedUrlForAnonymousUserCommand({
      AwsAccountId: awsAccountId,
      Namespace: 'default',
      ExperienceConfiguration: {
        QSearchBar: {
          InitialTopicId: 'xonhtgcNUZJP5UsUTL6RtKQPgpQmPIV5' // Updated Topic ID
        }
      },
      AuthorizedResourceArns: [
        "arn:aws:quicksight:us-east-1:211125369004:topic/xonhtgcNUZJP5UsUTL6RtKQPgpQmPIV5" // Updated ARN with new Topic ID
      ],
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
