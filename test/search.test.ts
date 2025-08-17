import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { BrowserManager } from '../src/browser';
import { search } from '../src/search';
 import { vi } from 'vitest';

vi.setConfig({ testTimeout: 10_000 });
describe('Search Functionality', () => {
  let browser: any;

  beforeAll(async () => {
    browser = await BrowserManager.getBrowser();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('Google Search', async () => {
    const results = await search({
      engine: 'google',
      query: 'test'
    });
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]).toHaveProperty('title');
    expect(results[0]).toHaveProperty('url');
  });

  test('Bing Search', async () => {
    const results = await search({
      engine: 'bing',
      query: 'test'
    });
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]).toHaveProperty('title');
    expect(results[0]).toHaveProperty('url');
  });
});