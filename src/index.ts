import { launchBrowser } from './browser';
import { search } from './search';
import { formatResults, htmlToMarkdown } from './markdown';

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
    
    // 设置随机User-Agent
    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/120.0'
    ];
    await page.setUserAgent(userAgents[Math.floor(Math.random() * userAgents.length)]);
    
    // 隐藏自动化特征
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
    });

    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // 提取主要内容 - 尝试获取article/main标签内容，否则获取body
    const content = await page.evaluate(() => {
      const article = document.querySelector('article') ||
                     document.querySelector('main') ||
                     document.body;
      return article.innerHTML;
    });

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
      const formatted = htmlToMarkdown(content);
      console.log(formatted);
    } else {
      throw new Error('Invalid command. Use "search [query]" or "open [url]"');
    }
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();