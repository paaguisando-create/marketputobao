import { McpServer } from "@modelcontextprotocol/server";
import { StdioServerTransport } from "@modelcontextprotocol/server/stdio";
import { z } from "zod";
 
const server = new McpServer({
  name: "my-mcp-server",
  version: "1.0.0",
});
 
// A minimal "hello world" tool — replace with real functionality later
server.registerTool(
  "greet",
  {
    description: "Greet someone by name",
    inputSchema: z.object({
      name: z.string().describe("The name to greet"),
    }),
  },
  async ({ name }) => ({
    content: [{ type: "text", text: `Hello, ${name}!` }],
  }),
);
 
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP server running on stdio"); // use console.error, never console.log
}
 
main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
