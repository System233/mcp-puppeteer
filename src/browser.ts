import * as edgePaths from "edge-paths";
import { Browser, launch } from "puppeteer-core";

interface BrowserOptions {
  headless?: boolean;
  args?: string[];
}

export class BrowserManager {
  private static browser: Browser | null = null;

  public static async getBrowser(): Promise<Browser> {
    // 如果已有浏览器实例且仍然连接，则直接返回
    if (this.browser && this.browser.connected) {
      return this.browser;
    }

    // 否则，创建一个新的浏览器实例
    this.browser = await launchBrowser();
    this.browser.on("disconnected", () => {
      this.browser = null;
    });
    return this.browser;
  }

  public static async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

async function launchBrowser(
  options: BrowserOptions = {}
): Promise<Browser> {
  const {
    headless = !!parseInt(process.env.MCP_PUPPETEER_HEADLESS||"1"),
    args = ["--no-sandbox", "--disable-setuid-sandbox"],
  } = options;

  // 尝试查找已安装的浏览器
  const executablePath=edgePaths.getAnyEdgeLatest()

  if (!executablePath) {
    throw new Error(
      "Could not find any installed browser. Please install Chrome or Edge."
    );
  }

  const userDataDir = process.env.PUPPETEER_PROFILE_PATH;

  return await launch({
    executablePath,
    headless,
    userDataDir,
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
