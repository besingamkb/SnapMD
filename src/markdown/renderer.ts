import MarkdownIt from 'markdown-it';
import { mermaidPlugin } from './mermaidPlugin';
import { buildHtmlDocument, type HtmlTemplateOptions } from './htmlTemplate';

export interface RenderOptions extends HtmlTemplateOptions {}

export function renderMarkdownToHtml(markdownText: string, options: RenderOptions = {}): string {
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
  });

  md.use(mermaidPlugin);

  const bodyHtml = md.render(markdownText);
  return buildHtmlDocument(bodyHtml, options);
}
