import { launchBrowser } from './browser';
import { search } from './search';
import { formatResults } from './markdown';

interface SearchOptions {
  engine: 'google' | 'bing';
  query: string;
  format?: 'markdown' | 'json';
}

async function main() {
  try {
    const options: SearchOptions = {
      engine: process.argv[2] === 'bing' ? 'bing' : 'google',
      query: process.argv[3] || 'test query',
      format: process.argv[4] === 'json' ? 'json' : 'markdown'
    };

    console.log(`Searching ${options.engine} for: ${options.query}`);
    
    const browser = await launchBrowser();
    const results = await search(browser, options);
    const output = formatResults(results, options.format);
    
    console.log(output);
    await browser.close();
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();