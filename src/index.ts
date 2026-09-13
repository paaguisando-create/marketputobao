import { McpServer } from "@modelcontextprotocol/server";
import { StdioServerTransport } from "@modelcontextprotocol/server/stdio";
import { z } from "zod";

const server = new McpServer({
  name: "marketputobao",
  version: "1.0.0",
});

server.registerTool(
  "get_stock_price",
  {
    description: "Get the current price and daily change for a stock ticker symbol",
    inputSchema: z.object({
      symbol: z.string().describe("Stock ticker symbol, e.g. AAPL, IBM, TSLA"),
    }),
  },
  async ({ symbol }) => {
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
    if (!apiKey) {
      return {
        content: [{ type: "text", text: "Missing ALPHA_VANTAGE_API_KEY environment variable." }],
      };
    }

    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol)}&apikey=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      const quote = data["Global Quote"];

      if (!quote || !quote["05. price"]) {
        return {
          content: [{ type: "text", text: `No data found for symbol "${symbol}". It may be invalid, or the API rate limit (5 calls/minute) was hit.` }],
        };
      }

      const price = quote["05. price"];
      const change = quote["09. change"];
      const changePercent = quote["10. change percent"];

      return {
        content: [
          {
            type: "text",
            text: `${symbol.toUpperCase()}: $${price} (${change}, ${changePercent})`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error fetching stock data: ${error}` }],
      };
    }
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});