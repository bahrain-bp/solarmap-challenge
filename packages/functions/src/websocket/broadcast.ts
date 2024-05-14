import { APIGatewayProxyHandler } from "aws-lambda";
import { ApiGatewayManagementApi, DynamoDB } from "aws-sdk";
import { Api } from "sst/node/api";
import { Table } from "sst/node/table";
import { WebSocketApi } from "sst/node/websocket-api";

const dynamoDb = new DynamoDB.DocumentClient();
// @ts-ignore
const TableName = Table.connection.tableName;

export const handler: APIGatewayProxyHandler = async (ticketStore: any) => {
  // @ts-ignore
  const url = WebSocketApi.WebSocket.url;

  const api = new ApiGatewayManagementApi({
    apiVersion: "2018-11-29",
    endpoint: url.replace("wss://", "https://"),
  });
  const user_id_to_query = ticketStore.user_id;
  console.log(user_id_to_query, "user_id to query", typeof user_id_to_query);

  const params = {
    ExpressionAttributeValues: {
      ":user_id_val": user_id_to_query,
    },
    TableName: TableName,
    KeyConditionExpression: "user_id = :user_id_val",
  };
  console.log("Query Params:", params);

  try {
    // Check if there are connections - based on the user_id
    const { Items: connections } = await dynamoDb.query(params).promise();

    if (!connections || connections.length === 0) {
      console.log("No connections found");
      return { statusCode: 200, body: "No connections" };
    }

    const postData = JSON.stringify({
      message: ticketStore,
    });

    const postToConnection = async function (item: DynamoDB.AttributeMap) {
      const connection_id = item.connection_id as string;
      try {
        await api
          .postToConnection({ ConnectionId: connection_id!, Data: postData })
          .promise();
      } catch (e: any) {
        if (e.statusCode === 410) {
          // // If the connection is no longer available, remove it from DynamoDB
          // await dynamoDb
          //   .delete({ TableName, Key: { user_id_to_query } })
          //   .promise();
        } else {
          throw e;
        }
      }
    };

    // Iterate through connections and send messages
    await Promise.all(connections.map(postToConnection));

    return { statusCode: 200, body: "Message sent" };
  } catch (error) {
    console.log("ERROR:", error);
    return { statusCode: 500, body: "Internal Server Error" };
  }
};
