import { Browser, Page } from 'puppeteer-core';

export interface SearchResult {
  title: string;
  url: string;
  description: string;
  content: string;
}

export async function search(browser: Browser, options: { 
  engine: 'google' | 'bing';
  query: string;
}): Promise<SearchResult[]> {
  const page = await browser.newPage();
  
  // 随机User-Agent列表
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/120.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Safari/605.1.15'
  ];
  
  // 设置随机User-Agent
  await page.setUserAgent(userAgents[Math.floor(Math.random() * userAgents.length)]);
  
  // 隐藏自动化特征
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', {
      get: () => false,
    });
    Object.defineProperty(navigator, 'plugins', {
      get: () => [1, 2, 3, 4, 5],
    });
  });
  
  try {
    switch(options.engine) {
      case 'google':
        return await searchGoogle(page, options.query);
      case 'bing':
        return await searchBing(page, options.query);
      default:
        throw new Error(`Unsupported search engine: ${options.engine}`);
    }
  } finally {
    await page.close();
  }
}

// 随机延迟函数
function randomDelay(min: number, max: number): Promise<void> {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
}

async function searchGoogle(page: Page, query: string): Promise<SearchResult[]> {
  // 模拟人类输入行为
  await page.goto('https://www.google.com', {
    waitUntil: 'networkidle2',
    timeout: 30000
  });
  
  await randomDelay(1000, 3000);
  
  // 模拟在搜索框中输入
  await page.type('textarea[name="q"]', query, {delay: 50 + Math.random() * 100});
  await randomDelay(500, 1500);
  
  // 模拟点击搜索按钮
  await Promise.all([
    page.waitForNavigation({waitUntil: 'networkidle2', timeout: 30000}),
    page.click('input[name="btnK"]')
  ]);
  
  await randomDelay(2000, 5000);

  // 更新后的Google搜索结果选择器
  const results = await page.$$eval('div[data-header-feature] > div > div', (divs) => {
    return divs.map(div => {
      const title = div.querySelector('h3')?.textContent || '';
      const url = div.querySelector('a')?.href || '';
      const description = div.querySelector('div[style="-webkit-line-clamp:2"]')?.textContent || '';
      
      return {
        title,
        url,
        description,
        content: `${title}\n${description}`
      };
    }).filter(result => result.title && result.url);
  });

  return results;
}

async function searchBing(page: Page, query: string): Promise<SearchResult[]> {
  await page.goto(`https://www.bing.com/search?q=${encodeURIComponent(query)}`, {
    waitUntil: 'networkidle2',
    timeout: 30000
  });

  // Bing搜索结果选择器
  const results = await page.$$eval('li.b_algo', (lis) => {
    return lis.map(li => {
      const title = li.querySelector('h2')?.textContent || '';
      const url = li.querySelector('a')?.href || '';
      const description = li.querySelector('div.b_caption p')?.textContent || '';
      
      return {
        title,
        url,
        description,
        content: `${title}\n${description}`
      };
    }).filter(result => result.title && result.url);
  });

  return results;
}