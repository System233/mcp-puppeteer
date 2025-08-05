import { SearchResult } from './search';

export function convertToMarkdown(results: SearchResult[]): string {
  return results.map((result, index) => {
    return `### ${index + 1}. [${result.title}](${result.url})\n\n` +
           `${result.description}\n\n` +
           `---\n`;
  }).join('\n');
}

export function formatResults(results: SearchResult[], format: 'markdown' | 'json' = 'markdown'): string {
  switch(format) {
    case 'markdown':
      return convertToMarkdown(results);
    case 'json':
      return JSON.stringify(results, null, 2);
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
}