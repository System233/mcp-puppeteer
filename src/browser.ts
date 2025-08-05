import edgePaths from "edge-paths";
import { Browser, launch } from "puppeteer-core";

interface BrowserOptions {
  headless?: boolean;
  args?: string[];
}


export class BrowserManager {
  private static browsers: Set<Browser> = new Set();
  private static readonly MAX_BROWSERS = 1;
  private static readonly IDLE_TIMEOUT = 5 * 60 * 1000; // 5 minutes

  public static async getBrowser(): Promise<Browser> {
    // 清理空闲浏览器
    await this.cleanupIdleBrowsers();

    // 查找可用的浏览器实例
    for (const browser of this.browsers) {
      if (browser.connected) {
        return browser;
      }
    }

    // 如果未达到上限，创建新实例
    if (this.browsers.size < this.MAX_BROWSERS) {
      const browser = await launchBrowser();
      this.browsers.add(browser);
      return browser;
    }
    throw new Error("no browser avaliable")
  }

  public static async restartBrowser(): Promise<void> {
    await this.closeAll();
  }

  public static async closeBrowser(): Promise<void> {
    if (this.browsers.size > 0) {
      for (const browser of this.browsers) {
        if (browser) {
          await browser.close();
          this.browsers.delete(browser);
        }
      }
    }
  }

  public static async closeAll(): Promise<void> {
    await Promise.all(
      Array.prototype.map.call(this.browsers, (b) => b.close())
    );
    this.browsers = new Set();
  }

  public static listBrowsers(): { count: number } {
    return { count: this.browsers.size };
  }

  private static async cleanupIdleBrowsers(): Promise<void> {
    const now = Date.now();
    for (const browser of this.browsers) {
      if (!browser.connected) {
        this.browsers.delete(browser);
      }
    }
  }
}

export async function launchBrowser(
  options: BrowserOptions = {}
): Promise<Browser> {
  const {
    headless = true,
    args = ["--no-sandbox", "--disable-setuid-sandbox"],
  } = options;

  // 尝试查找已安装的浏览器
  const executablePath=edgePaths.getAnyEdgeLatest()

  if (!executablePath) {
    throw new Error(
      "Could not find any installed browser. Please install Chrome or Edge."
    );
  }

  return await launch({
    executablePath,
    headless,
    args: [
      ...args,
      "--disable-blink-features=AutomationControlled",
      "--disable-infobars",
      "--window-size=1920,1080",
      "--start-maximized",
      "--disable-dev-shm-usage",
      "--disable-web-security",
      "--disable-notifications",
    ],
    ignoreDefaultArgs: ["--enable-automation"],
    defaultViewport: null,
  });
}
