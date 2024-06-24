// Segmented Rooftop Lambda function
import { APIGatewayProxyEvent } from 'aws-lambda';
import { DynamoDB, ApiGatewayManagementApi } from 'aws-sdk';
import { Table } from 'sst/node/table';

export const handler = async (event: APIGatewayProxyEvent) => {
  try {
    console.log(event);

    // @ts-ignore
    const TableName = Table.Connections.tableName;
    const dynamoDb = new DynamoDB.DocumentClient();
    const url = 'wss://fckt4ovy57.execute-api.us-east-1.amazonaws.com/prod';

    // Parse the incoming event body
    // @ts-ignore
    const body = JSON.parse(event.body);
    const { segmentedImage, areaSizes } = body;

    const connections = await dynamoDb.scan({
      TableName,
      ProjectionExpression: 'id',
    }).promise();

    console.log('Connections:', connections);

    const apiG = new ApiGatewayManagementApi({
      apiVersion: '2018-11-29',
      endpoint: url.replace('wss://', 'https://'),
    });

    const postToConnection = async ({ id }: { id: string }) => {
      try {
        await apiG
          .postToConnection({
            ConnectionId: id,
            Data: JSON.stringify({ segmentedImage, areaSizes }),
          })
          .promise();
      } catch (e) {
        console.error(`Failed to send message to connection ${id}:`, e);
        // @ts-ignore
        if (e.statusCode === 410) {
          await dynamoDb.delete({
            TableName,
            Key: { id },
          }).promise();
        }
      }
    };
    // @ts-ignore
    await Promise.all(connections.Items.map(postToConnection));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Data sent to connections successfully' }),
    };
  } catch (error) {
    console.error('Error processing event:', error);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON payload' }),
    };
  }
};
