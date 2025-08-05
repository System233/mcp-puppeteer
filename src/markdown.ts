import { SearchResult } from './search';
import TurndownService from 'turndown';
const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
  hr: '---',
  blankReplacement: (content, node) => {
    return node?.nodeName === 'P' ? '\n\n' : '';
  },
  strongDelimiter: '**',
  emDelimiter: '*'
});

// 添加自定义规则
turndownService.addRule('preformatted', {
  filter: ['pre'],
  replacement: (content) => `\`\`\`\n${content}\n\`\`\`\n\n`
});

turndownService.addRule('headers', {
  filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
  replacement: (content, node) => {
    const hLevel = Number(node.nodeName.substring(1));
    return `${'#'.repeat(hLevel)} ${content}\n\n`;
  }
});

turndownService.addRule('lists', {
  filter: ['li'],
  replacement: (content, node) => {
    const parent = node.parentNode as HTMLElement;
    const prefix = parent?.nodeName === 'OL' ? '1. ' : '- ';
    return `${prefix}${content}\n`;
  }
});

turndownService.addRule('links', {
  filter: ['a'],
  replacement: (content, node) => {
    const element = node as HTMLLinkElement;
    const href = element.getAttribute('href');
    return href ? `[${content}](${href})` : content;
  }
});

turndownService.addRule('headers', {
  filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
  replacement: (content, node) => {
    const level = parseInt((node as HTMLElement).tagName.substring(1));
    return `${'#'.repeat(level)} ${content}\n\n`;
  }
});

turndownService.addRule('paragraphs', {
  filter: ['p'],
  replacement: (content) => `\n${content}\n\n`
});

turndownService.addRule('divs', {
  filter: ['div'],
  replacement: (content) => `\n${content}\n`
});

turndownService.addRule('styles', {
  filter: ['style'],
  replacement: () => '<!-- styles omitted -->\n'
});

turndownService.addRule('metas', {
  filter: ['meta'],
  replacement: () => ''
});

function convertToMarkdown(results: SearchResult[]): string {
  return results
    .map(result => `### ${result.title}\n${result.url}\n\n${result.description}`)
    .join('\n\n---\n\n');
}

export function htmlToMarkdown(html: string): string {
  return turndownService.turndown(html);
}

export function formatResults(
  content: SearchResult[],
  format: 'markdown' | 'json' = 'markdown'
): string {

  switch (format) {
    case 'markdown':
      return convertToMarkdown(content);
    case 'json':
      return JSON.stringify(content, null, 2);
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
}