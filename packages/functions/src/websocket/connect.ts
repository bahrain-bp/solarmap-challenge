import { DynamoDB } from "aws-sdk";
import { APIGatewayProxyHandler } from "aws-lambda";
import { Table } from "sst/node/table";

const dynamoDb = new DynamoDB.DocumentClient();

export const main: APIGatewayProxyHandler = async (event) => {
  const user_id = parseInt(event.queryStringParameters?.user_id!);
  console.log(user_id, "user_id from connection");

  const params = {
    // @ts-ignore
    TableName: Table.connection.tableName,
    Item: {
      connection_id: event.requestContext.connectionId,
      user_id: user_id,
    },
  };

  await dynamoDb.put(params).promise();

  return { statusCode: 200, body: "Connected To Husain" };
};
