import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { BrowserManager } from "./browser";
import { search } from "./search";
import { extractContent, formatResults } from "./markdown";
import { z } from "zod";

const server = new McpServer({
  name: "puppeteer-service",
  version: "1.0.0",
});

const internalSearch = async (query: string, engine: "google" | "bing") => {
  const browser = await BrowserManager.getBrowser();
  const results = await search(browser, {
    engine: engine as "google" | "bing",
    query,
  });
  return results;
};

const internalFetch = async (url: string) => {
  const browser = await BrowserManager.getBrowser();
  return await extractContent(browser, url);
};
// 暴露搜索功能
server.tool(
  "search",
  `在搜索引擎中搜索关键词，返回Markdown或JSON格式的匹配部分快照，可继续使用extract-content工具访问链接以读取完整页面`,
  {
    query: z.string().describe("搜索关键词，必需"),
    engine: z
      .enum(["bing"])
      .optional()
      .describe("搜索引擎，可选，默认'bing'"),
    format: z
      .enum(["markdown", "json"])
      .optional()
      .describe("返回格式，可选，默认'markdown'"),
  },
  async (args, extra) => {
    const { query, engine = "bing", format = "markdown" } = args;
    const results = await internalSearch(query, engine);

    if (format === "json") {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(results, null, 2),
          },
        ],
        _meta: {},
      };
    }

    return {
      content: [
        {
          type: "text",
          text: formatResults(results),
        },
      ],
      _meta: {},
    };
  }
);

// 暴露内容提取功能
server.tool(
  "fetch",
  `网页内容提取/抓取工具 - 访问URL并从中提取主要内容`,
  {
    url: z.string().url().describe("有效的网页URL，必需"),
  },
  async (args, extra) => {
    const { url } = args;
    const browser = await BrowserManager.getBrowser();
    return {
      content: [
        {
          type: "text",
          text: await extractContent(browser, url),
        },
      ],
      _meta: {},
    };
  }
);

async function main() {
  const command = process.argv[3];
  const args = process.argv.slice(4);

  try {
    switch (command) {
      case "search":
        const query = args[0];
        const format = args[1] === "json" ? "json" : "markdown";
        const result = await internalSearch(query, "bing");
        console.log(formatResults(result));
        process.exit(0);
        break;
      case "fetch":
        const url = args[0];
        const content = await internalFetch(url);
        console.log(content);
        process.exit(0);
        break;
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

if (process.argv[2] === "--") {
  main();
} else {
  // 启动MCP服务
  const transport = new StdioServerTransport();
  server.connect(transport);
  console.error("Puppeteer MCP service started");
}
