import { DynamoDB, ApiGatewayManagementApi } from "aws-sdk";
import { Table } from "sst/node/table";
import { APIGatewayProxyHandler } from "aws-lambda";

// @ts-ignore
const TableName = Table.Connections.tableName;
const dynamoDb = new DynamoDB.DocumentClient();

const url = "wss://zrzuvslvoj.execute-api.us-east-1.amazonaws.com/husain"

export const handler: APIGatewayProxyHandler = async (event) => {
//   const messageData = JSON.parse(event.body).data;
const messageData =  "Hello SolarMapian, Welcome, your current Session ID is: "


  // Get all the connections
  const connections = await dynamoDb
    .scan({ TableName, ProjectionExpression: "id" })
    .promise();


    const apiG = new ApiGatewayManagementApi({
        apiVersion: "2018-11-29",
        endpoint: url.replace("wss://", "https://"),
    });

    // @ts-ignore
  const postToConnection = async function ({ id }) {
    try {
      // Send the message to the given client
      await apiG
        .postToConnection({ ConnectionId: id, Data: messageData + id })
        .promise();
    } catch (e) {
      // @ts-ignore
      if (e.statusCode === 410) {
        // Remove stale connections
        await dynamoDb.delete({ TableName, Key: { id } }).promise();
      }
    }
  };
  // @ts-ignore
  // Iterate through all the connections
  await Promise.all(connections.Items.map(postToConnection));

  return { statusCode: 200, body: "Message sent" };
};