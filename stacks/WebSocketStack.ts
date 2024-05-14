import { StackContext, Table, WebSocketApi, use } from "sst/constructs";
import { DBStack } from "./DBStack";

export function WebSocketStack({ stack }: StackContext) {
  const { db } = use(DBStack);

  // Create the table
    const table = new Table(stack, "Connections", {
      fields: {
        id: "string",
      },
      primaryIndex: { partitionKey: "id" },
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
      sendmessage: "packages/functions/src/websocket/sendMessage.main",
    },
  });

  // Show the API endpoint in the output
  stack.addOutputs({
    WebSocketApiEndpoint: ws.url,
  });
  return { table, ws };
}
