import { SearchResult } from './search';

function convertToMarkdown(results: SearchResult[]): string {
  return results
    .map(result => `### ${result.title}\n${result.url}\n\n${result.description}`)
    .join('\n\n---\n\n');
}

function textToMarkdown(content: string): string {
  return `# Page Content\n\n${content
    .split('\n')
    .filter(line => line.trim())
    .map(line => `- ${line}`)
    .join('\n')}`;
}

export function formatResults(
  content: SearchResult[] | string,
  format: 'markdown' | 'json' = 'markdown'
): string {
  if (typeof content === 'string') {
    return textToMarkdown(content);
  }

  switch (format) {
    case 'markdown':
      return convertToMarkdown(content);
    case 'json':
      return JSON.stringify(content, null, 2);
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
}