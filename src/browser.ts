import { Browser, launch } from 'puppeteer-core';

interface BrowserOptions {
  headless?: boolean;
  args?: string[];
}

// 常见浏览器安装路径
const BROWSER_PATHS = [
  // Windows Edge
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  // Windows Chrome
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  // macOS Chrome
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  // Linux Chrome
  '/usr/bin/google-chrome'
];

export async function launchBrowser(options: BrowserOptions = {}): Promise<Browser> {
  const { headless = false, args = ['--no-sandbox', '--disable-setuid-sandbox'] } = options;
  
  // 尝试查找已安装的浏览器
  let executablePath: string | undefined;
  for (const path of BROWSER_PATHS) {
    try {
      const fs = require('fs');
      if (fs.existsSync(path)) {
        executablePath = path;
        break;
      }
    } catch (error) {
      console.warn(`Failed to check browser path ${path}:`, error);
    }
  }

  if (!executablePath) {
    throw new Error('Could not find any installed browser. Please install Chrome or Edge.');
  }

  return await launch({
    executablePath,
    headless,
    args: [
      ...args,
      '--disable-blink-features=AutomationControlled',
      '--disable-infobars',
      '--window-size=1920,1080',
      '--start-maximized',
      '--disable-dev-shm-usage',
      '--disable-web-security',
      '--disable-notifications'
    ],
    ignoreDefaultArgs: ['--enable-automation'],
    defaultViewport: null
  });
}