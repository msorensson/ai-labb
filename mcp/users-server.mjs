import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ListToolsRequestSchema, CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import users from "../app/api/public/users/index.js";

const server = new Server(
  { name: "users-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

const tools = [
  {
    name: "list_users",
    description: "Return all users from the mock dataset",
    inputSchema: { type: "object", additionalProperties: false, properties: {} }
  },
  {
    name: "get_user",
    description: "Return a single user by id",
    inputSchema: {
      type: "object",
      required: ["id"],
      additionalProperties: false,
      properties: { id: { type: "string", description: "User id, e.g. user-1" } }
    }
  }
];

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools }));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const { name, arguments: args } = req.params;
  if (name === "list_users") {
    return { content: [{ type: "json", data: users }] };
  }
  if (name === "get_user") {
    const id = args?.id;
    const user = users.find((u) => u.id === id);
    if (!user) {
      return { isError: true, content: [{ type: "text", text: "User not found" }] };
    }
    return { content: [{ type: "json", data: user }] };
  }
  return { isError: true, content: [{ type: "text", text: `Unknown tool: ${name}` }] };
});

const transport = new StdioServerTransport();

console.log("[users-mcp] Starting STDIO MCP server...");
console.log("[users-mcp] Tools available: list_users, get_user");
console.log("[users-mcp] Waiting for MCP client to connect on STDIO...");

server
  .connect(transport)
  .then(() => {
    console.log("[users-mcp] Disconnected. Exiting.");
  })
  .catch((err) => {
    console.error("[users-mcp] Connection error:", err);
    process.exit(1);
  });

process.on("SIGINT", () => {
  console.log("[users-mcp] Caught SIGINT, shutting down.");
  process.exit(0);
});


