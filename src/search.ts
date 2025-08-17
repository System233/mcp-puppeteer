import { Browser, Page } from "puppeteer-core";
import { BrowserManager } from "./browser";

export interface SearchResult {
  title: string;
  url: string;
  description: string;
  content: string;
}

export async function search(options: {
  engine: "google" | "bing";
  query: string;
}): Promise<SearchResult[]> {
  const browser = await BrowserManager.getBrowser();
  const page = await browser.newPage();

  await page.setRequestInterception(true);
  page.on("request", (req) => {
    if (["image", "stylesheet", "font", "media"].includes(req.resourceType())) {
      req.abort();
    } else {
      req.continue();
    }
  });

  // 随机User-Agent列表
  const userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/120.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Safari/605.1.15",
  ];

  // 设置随机User-Agent
  await page.setUserAgent(
    userAgents[Math.floor(Math.random() * userAgents.length)]
  );

  // 隐藏自动化特征
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, "webdriver", {
      get: () => false,
    });
    Object.defineProperty(navigator, "plugins", {
      get: () => [1, 2, 3, 4, 5],
    });
  });

  try {
    switch (options.engine) {
      case "google":
        return await searchGoogle(page, options.query);
      case "bing":
        return await searchBing(page, options.query);
      default:
        throw new Error(`Unsupported search engine: ${options.engine}`);
    }
  } finally {
    await page.close();
  }
}

async function searchGoogle(
  page: Page,
  query: string
): Promise<SearchResult[]> {
  await page.goto(
    `https://www.google.com/search?q=${encodeURIComponent(query)}`,
    {
      waitUntil: "networkidle2",
      timeout: 30000,
    }
  );

  // 更新后的Google搜索结果选择器
  const results = await page.$$eval(
    "div[data-async-context] > div > div",
    (divs) => {
      return divs
        .map((div) => {
          const title = div.querySelector("h3")?.textContent || "";
          const url = div.querySelector("a")?.href || "";
          const description =
            div.querySelector('div[style*="-webkit-line-clamp"]')
              ?.textContent || "";

          return {
            title,
            url,
            description,
            content: `${title}\n${description}`,
          };
        })
        .filter((result) => result.title && result.url);
    }
  );

  return results;
}

async function searchBing(page: Page, query: string): Promise<SearchResult[]> {
  await page.goto(
    `https://www.bing.com/search?q=${encodeURIComponent(query)}`,
    {
      waitUntil: "networkidle2",
      timeout: 30000,
    }
  );

  // Bing搜索结果选择器
  const results = await page.$$eval("li.b_algo", (lis) => {
    function decodeBingUrl(url: string) {
      const u = new URLSearchParams(url);
      const raw = u.get("u");
      if (!raw) {
        return url;
      }
      return atob(raw.replace(/^a1/, "").replace(/_/g, "/").replace(/-/g, "+"));
    }
    return lis
      .map((li) => {
        const title = li.querySelector("h2")?.textContent || "";
        const url = decodeBingUrl(li.querySelector("a")?.href || "");
        const description =
          li.querySelector("h2+*")?.textContent || "";

        return {
          title,
          url,
          description,
          content: `${title}\n${description}`,
        };
      })
      .filter((result) => result.title && result.url);
  });

  return results;
}
