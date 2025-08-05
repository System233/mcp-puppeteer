# MCP Puppeteer Search

A Node.js search tool using Puppeteer to scrape search results from Google and Bing.

## Features

- Search both Google and Bing
- Automatic browser detection
- Results in Markdown or JSON format
- First page results only

## Installation

```bash
npm install
```

## Usage

```bash
# Search Google (default)
npm start -- [query]
npm start -- [query] [format]

# Search Bing 
npm start -- bing [query]
npm start -- bing [query] [format]

# Examples
npm start -- "node.js puppeteer"
npm start -- bing "typescript tutorial" json
```

## Options

- `query`: Search query (required)
- `format`: Output format - `markdown` (default) or `json`