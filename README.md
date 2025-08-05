# MCP Puppeteer Web Tools

A Node.js tool using Puppeteer for web search and content extraction.

## Features

- Search Bing (default search engine)
- Open and extract content from any URL
- Automatic browser detection
- Results in Markdown or JSON format (for search)
- Human-like browsing behavior to avoid detection

## Installation

```bash
npm install
```

## Usage

### Search Command
```bash
npm start -- search [query] [format]
```
- Searches Bing for the query
- Optional `format` parameter: `json` for JSON output (default: markdown)

### Open Command  
```bash
npm start -- open [url]
```
- Fetches and displays the full HTML content of the specified URL

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
npm start -- open https://example.com
```

## Options

For search command:
- `query`: Search query (required)
- `format`: Output format - `markdown` (default) or `json`

For open command:
- `url`: Web page URL to fetch (required)