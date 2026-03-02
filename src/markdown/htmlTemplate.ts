export interface HtmlTemplateOptions {
  title?: string;
}

const MERMAID_CDN = 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js';

const DEFAULT_CSS = `
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    line-height: 1.6;
    color: #24292e;
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
  }
  h1, h2, h3, h4, h5, h6 {
    margin-top: 1.5em;
    margin-bottom: 0.5em;
    font-weight: 600;
  }
  h1 { font-size: 2em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
  h2 { font-size: 1.5em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
  code {
    background: #f6f8fa;
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-size: 85%;
    font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
  }
  pre {
    background: #f6f8fa;
    padding: 16px;
    border-radius: 6px;
    overflow-x: auto;
    line-height: 1.45;
  }
  pre code {
    background: none;
    padding: 0;
    font-size: 100%;
  }
  blockquote {
    border-left: 4px solid #dfe2e5;
    margin: 0;
    padding: 0 1em;
    color: #6a737d;
  }
  table {
    border-collapse: collapse;
    width: 100%;
    margin: 1em 0;
  }
  th, td {
    border: 1px solid #dfe2e5;
    padding: 6px 13px;
  }
  th {
    background: #f6f8fa;
    font-weight: 600;
  }
  tr:nth-child(even) {
    background: #f6f8fa;
  }
  img {
    max-width: 100%;
    height: auto;
  }
  a {
    color: #0366d6;
    text-decoration: none;
  }
  hr {
    border: none;
    border-top: 1px solid #eaecef;
    margin: 2em 0;
  }
  .mermaid {
    text-align: center;
    margin: 1em 0;
  }
  @media print {
    body { max-width: none; padding: 0; }
    pre { white-space: pre-wrap; word-wrap: break-word; }
  }
`;

export function buildHtmlDocument(bodyHtml: string, options: HtmlTemplateOptions = {}): string {
  const title = options.title ?? 'SnapMD Document';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <style>${DEFAULT_CSS}</style>
</head>
<body>
  ${bodyHtml}
  <script src="${MERMAID_CDN}"></script>
  <script>mermaid.initialize({ startOnLoad: true });</script>
</body>
</html>`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
