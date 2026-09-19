import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { tools } from "./tools/index.js";

const server = new McpServer({
  name: "portfolio-mcp-server",
  version: "1.0.0",
});

for (const tool of tools) {
  server.registerTool(tool.name, tool.config, tool.handler);
}

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Portfolio MCP server lancé (stdio).");
}

main().catch((err) => {
  console.error("Erreur fatale :", err);
  process.exit(1);
});
