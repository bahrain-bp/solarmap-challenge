import { DynamoDB } from "aws-sdk";
import { APIGatewayProxyHandler } from "aws-lambda";
import { Table } from "sst/node/table";

const dynamoDb = new DynamoDB.DocumentClient();

export const main: APIGatewayProxyHandler = async (event) => {
  console.log(event, "event from disconnect");

  const connectionId = event.requestContext.connectionId;

  // Scan DynamoDB to find the user_id based on the connectionId
  const scanParams = {
        // @ts-ignore
    TableName: Table.connection.tableName,
    FilterExpression: "connection_id = :id",
    ExpressionAttributeValues: {
      ":id": connectionId,
    },
  };

  try {
    const scanResult = await dynamoDb.scan(scanParams).promise();

    if (scanResult.Items && scanResult.Items.length > 0) {
      const user_id = scanResult.Items[0].user_id;

      // Now you can use the user_id as needed

      // Proceed with the delete operation (example)
      const deleteParams = {
        // @ts-ignore
        TableName: Table.connection.tableName,
        Key: {
          user_id: user_id,
        },
      };

      await dynamoDb.delete(deleteParams).promise();

      return { statusCode: 200, body: `Disconnected user ${user_id}` };
    } else {
      return { statusCode: 404, body: "Connection not found" };
    }
  } catch (error) {
    console.error(error, "error");
    return { statusCode: 500, body: "Internal Server Error" };
  }
};
