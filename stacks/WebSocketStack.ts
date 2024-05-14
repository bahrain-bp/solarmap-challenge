import { StackContext, Table, WebSocketApi, use } from "sst/constructs";
import { DBStack } from "./DBStack";

export function WebSocketStack({ stack }: StackContext) {
  const { db } = use(DBStack);

  // Create the table
  const table = new Table(stack, "connection", {
    fields: {
      user_id: "number",
      connection_id: "string",
    },
    primaryIndex: { partitionKey: "user_id" },
  });

  // Create the WebSocket API
  const ws = new WebSocketApi(stack, "WebSocket", {
    defaults: {
      function: {
        bind: [table, db],
      },
    },
    routes: {
      $connect: "packages/functions/src/websocket/connect.main",
      $disconnect: "packages/functions/src/websocket/disconnect.main",
    },
  });

  // Show the API endpoint in the output
  stack.addOutputs({
    ApiEndpoint: ws.url,
  });
  return { table, ws };
}
