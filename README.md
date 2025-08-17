# MCP Puppeteer Search

这是一个基于 Puppeteer 的 MCP（Model-~~Copilot~~ Protocol）搜索插件，它允许语言模型通过标准化的协议与本地浏览器进行交互，从而实现网络搜索和内容提取等功能。

## 功能

*   **多引擎搜索**: 通过 `search` 工具在 Bing 或 Google 上搜索关键词。
*   **内容提取**: 通过 `fetch` 工具从指定 URL 提取主要内容，并将其转换为 Markdown 格式。

## 配置

### 环境变量

*   `MCP_PUPPETEER_HEADLESS`: (可选) 是否以无头模式运行 Puppeteer。默认为 `1` (启用)。
*   `PUPPETEER_PROFILE_PATH`: (可选) 指定一个稳定的浏览器配置文件路径。这有助于保持登录状态和 Cookies，避免人机验证。

## 使用

### 作为 MCP 服务

MCP 服务允许语言模型（如 GPT）通过标准输入/输出与此插件进行通信。您可以使用 `npx` 来快速启动服务，而无需在本地克隆或安装此项目。

**启动命令：**

```bash
npx -y mcp-puppeteer
```

执行此命令后，服务将在后台启动，并等待语言模型的指令。

### 命令行

您也可以直接在命令行中使用此工具进行快速的搜索和内容提取。

**搜索：**

```bash
npx -y mcp-puppeteer -- search "your query" <google|bing>
```

**提取内容：**

```bash
npx -y mcp-puppeteer -- fetch "https://example.com"
```