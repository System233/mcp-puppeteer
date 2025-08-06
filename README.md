# MCP搜索插件

支持bing搜索引擎，以及拉取页面，搜索和拉取结果均为markdown。
* 需要安装edge浏览器，如果你的edge已登录账号，浏览器和bing会记录搜索历史。

## 用法

```
# 全局安装mcp-puppeteer
npm install -g mcp-puppeteer

# 启动MCP服务，或者在MCP插件中填入此命令
npx mcp-puppeteer


# 其他用法：搜索
npx mcp-puppeteer -- search "搜索内容"
# 抓取页面
npx mcp-puppeteer -- fetch "https://example.com"
```

# MCP Puppeteer Service

A web content search and extraction service using Puppeteer with browser instance management.


## Features

- Browser instance pooling for faster searches
- Automatic browser instance reuse
- Search engine adapters (Google/Bing)
- HTML to Markdown conversion
- URL content extraction
- Human-like browsing behavior to avoid detection

## Installation

```bash
npm install -g mcp-puppeteer
```

## Usage as MCP Service

### CLI Commands

```bash
# Search with query (uses browser pool)
npx mcp-puppeteer -- search "your query"

# Open URL and extract content (creates new browser instance)
npx mcp-puppeteer -- fetch https://example.com


# Start MCP Service
npx mcp-puppeteer

```

## Options

For search command:
- `query`: Search query (required)
- `format`: Output format - `markdown` (default) or `json`

For open command:
- `url`: Web page URL to fetch (required)