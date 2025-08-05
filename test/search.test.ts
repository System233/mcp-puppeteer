import { launchBrowser } from '../src/browser';
import { search } from '../src/search';

describe('Search Functionality', () => {
  let browser: any;

  beforeAll(async () => {
    browser = await launchBrowser();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('Google Search', async () => {
    const results = await search(browser, {
      engine: 'google',
      query: 'test'
    });
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]).toHaveProperty('title');
    expect(results[0]).toHaveProperty('url');
  });

  test('Bing Search', async () => {
    const results = await search(browser, {
      engine: 'bing',
      query: 'test'
    });
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]).toHaveProperty('title');
    expect(results[0]).toHaveProperty('url');
  });
});