import { launchBrowser } from './browser';
import { search } from './search';
import { formatResults } from './markdown';

interface SearchOptions {
  engine: 'google' | 'bing';
  query: string;
  format?: 'markdown' | 'json';
}
interface CommandOptions {
  format?: 'markdown' | 'json';
}

interface OpenOptions extends CommandOptions {
  url: string;
}

async function fetchPageContent(url: string): Promise<string> {
  const browser = await launchBrowser();
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    const content = await page.content();
    await browser.close();
    return content;
  } catch (error) {
    await browser.close();
    throw error;
  }
}

async function main() {
  try {
    const command = process.argv[2];
    
    if (command === 'search') {
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
    } else if (command === 'open') {
      const url = process.argv[3];
      if (!url) throw new Error('URL is required for open command');
      
      console.log(`Fetching content from: ${url}`);
      const content = await fetchPageContent(url);
      console.log(content);
    } else {
      throw new Error('Invalid command. Use "search [query]" or "open [url]"');
    }
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();