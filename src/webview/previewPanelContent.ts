import * as crypto from 'crypto';

const MERMAID_CDN = 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js';

export function getPreviewHtml(bodyHtml: string, title: string): string {
  const nonce = crypto.randomBytes(16).toString('hex');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy"
    content="default-src 'none';
      style-src 'unsafe-inline';
      script-src 'nonce-${nonce}' https://cdn.jsdelivr.net;
      img-src vscode-resource: https: data:;
      font-src https:;">
  <title>${escapeHtml(title)}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: var(--vscode-editor-foreground, #24292e);
      background: var(--vscode-editor-background, #fff);
      max-width: 900px;
      margin: 0 auto;
      padding: 20px;
      padding-top: 50px;
    }
    h1, h2, h3, h4, h5, h6 {
      margin-top: 1.5em;
      margin-bottom: 0.5em;
      font-weight: 600;
    }
    h1 { font-size: 2em; border-bottom: 1px solid var(--vscode-panel-border, #eaecef); padding-bottom: 0.3em; }
    h2 { font-size: 1.5em; border-bottom: 1px solid var(--vscode-panel-border, #eaecef); padding-bottom: 0.3em; }
    code {
      background: var(--vscode-textCodeBlock-background, #f6f8fa);
      padding: 0.2em 0.4em;
      border-radius: 3px;
      font-size: 85%;
      font-family: var(--vscode-editor-font-family, "SFMono-Regular", Consolas, monospace);
    }
    pre {
      background: var(--vscode-textCodeBlock-background, #f6f8fa);
      padding: 16px;
      border-radius: 6px;
      overflow-x: auto;
      line-height: 1.45;
    }
    pre code { background: none; padding: 0; font-size: 100%; }
    blockquote {
      border-left: 4px solid var(--vscode-panel-border, #dfe2e5);
      margin: 0;
      padding: 0 1em;
      color: var(--vscode-descriptionForeground, #6a737d);
    }
    table { border-collapse: collapse; width: 100%; margin: 1em 0; }
    th, td { border: 1px solid var(--vscode-panel-border, #dfe2e5); padding: 6px 13px; }
    th { background: var(--vscode-textCodeBlock-background, #f6f8fa); font-weight: 600; }
    img { max-width: 100%; height: auto; }
    a { color: var(--vscode-textLink-foreground, #0366d6); text-decoration: none; }
    hr { border: none; border-top: 1px solid var(--vscode-panel-border, #eaecef); margin: 2em 0; }
    .mermaid { text-align: center; margin: 1em 0; }

    #snapmd-toolbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      background: var(--vscode-editor-background, #fff);
      border-bottom: 1px solid var(--vscode-panel-border, #eaecef);
      padding: 6px 16px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 8px;
    }
    #snapmd-toolbar button {
      background: var(--vscode-button-background, #007acc);
      color: var(--vscode-button-foreground, #fff);
      border: none;
      padding: 4px 12px;
      border-radius: 3px;
      cursor: pointer;
      font-size: 13px;
      font-family: var(--vscode-font-family, sans-serif);
    }
    #snapmd-toolbar button:hover {
      background: var(--vscode-button-hoverBackground, #005fa3);
    }
  </style>
</head>
<body>
  <div id="snapmd-toolbar">
    <button id="export-btn">Export to PDF</button>
  </div>
  <div id="snapmd-content">
    ${bodyHtml}
  </div>
  <script src="${MERMAID_CDN}"></script>
  <script nonce="${nonce}">
    const vscode = acquireVsCodeApi();

    mermaid.initialize({ startOnLoad: true });

    document.getElementById('export-btn').addEventListener('click', () => {
      vscode.postMessage({ command: 'exportPDF' });
    });

    window.addEventListener('message', (event) => {
      const message = event.data;
      if (message.command === 'updateContent') {
        const contentEl = document.getElementById('snapmd-content');
        if (contentEl) {
          contentEl.innerHTML = message.html;
          mermaid.run({ nodes: contentEl.querySelectorAll('.mermaid') });
        }
      }
    });
  </script>
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
