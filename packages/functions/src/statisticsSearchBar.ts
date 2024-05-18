import { QuickSightClient, GenerateEmbedUrlForAnonymousUserCommand } from "@aws-sdk/client-quicksight";
import { APIGatewayProxyHandler } from "aws-lambda";

// Lambda handler function to generate an embed URL for QuickSight Q Search Bar
export const handler: APIGatewayProxyHandler = async (event, context) => {
  // Specify the AWS region and account ID where QuickSight is configured
  const dashboardRegion = "us-east-1";
  const awsAccountId = "211125369004";
  
  // Initialize the QuickSight client with the specified region
  const quickSightClient = new QuickSightClient({ region: dashboardRegion });

  try {
    // Prepare the command with necessary parameters for generating the embed URL
    const command = new GenerateEmbedUrlForAnonymousUserCommand({
      AwsAccountId: awsAccountId,
      Namespace: 'default',
      ExperienceConfiguration: {
        QSearchBar: {
          // Define the initial topic ID for the QSearchBar experience
          InitialTopicId: 'xonhtgcNUZJP5UsUTL6RtKQPgpQmPIV5'
        }
      },
      // List of ARNs that are allowed to be accessed by the generated URL
      AuthorizedResourceArns: [
        "arn:aws:quicksight:us-east-1:211125369004:topic/xonhtgcNUZJP5UsUTL6RtKQPgpQmPIV5" 
      ],
      // Session lifetime for the generated URL in minutes
      SessionLifetimeInMinutes: 60,
    });

    // Send the command to AWS QuickSight and wait for the response
    const response = await quickSightClient.send(command);

    // Return a successful HTTP response with the embed URL
    return {
      statusCode: 200,
      body: JSON.stringify(response),
      headers: {
        "Content-Type": "application/json",
      },
    };
  } catch (error) {
    // Log the error and return an internal server error response
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
