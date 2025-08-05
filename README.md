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
npm install
```

## Usage as MCP Service

### CLI Commands

```bash
# Search with query (uses browser pool)
npm start -- search "your query"

# Open URL and extract content (creates new browser instance)
npm start -- fetch https://example.com

```

### Browser Instance Management

The service maintains a pool of browser instances to accelerate search operations:

1. First search creates a new browser instance
2. Subsequent searches reuse existing instances
3. Idle instances are automatically closed after 5 minutes
4. Maximum 3 concurrent browser instances

### Performance Tips

- For batch operations, keep the service running
- Use `search` command for fastest results (reuses instances)
- Close unused instances with `close-all` when done

## Examples

Search for "test query":
```bash
npm start -- search "test query"
```

Search with JSON output:
```bash
npm start -- search "node.js" json
```

Open a webpage:
```bash
npm start -- fetch https://example.com
```


## Options

For search command:
- `query`: Search query (required)
- `format`: Output format - `markdown` (default) or `json`

For open command:
- `url`: Web page URL to fetch (required)