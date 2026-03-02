import * as vscode from 'vscode';
import MarkdownIt from 'markdown-it';
import { mermaidPlugin } from '../markdown/mermaidPlugin';
import { getPreviewHtml } from './previewPanelContent';

let currentPanel: vscode.WebviewPanel | undefined;
let debounceTimer: ReturnType<typeof setTimeout> | undefined;

export function showPreviewPanel(
  document: vscode.TextDocument,
  onExportRequested: (document: vscode.TextDocument) => void,
): void {
  const column = vscode.ViewColumn.Beside;

  if (currentPanel) {
    currentPanel.reveal(column);
    updatePanelContent(currentPanel, document);
    return;
  }

  currentPanel = vscode.window.createWebviewPanel(
    'snapmdPreview',
    `Preview: ${getDocumentName(document)}`,
    column,
    {
      enableScripts: true,
      retainContextWhenHidden: true,
    },
  );

  updatePanelContent(currentPanel, document);

  // Handle messages from the webview
  currentPanel.webview.onDidReceiveMessage((message) => {
    if (message.command === 'exportPDF') {
      onExportRequested(document);
    }
  });

  // Live preview: listen for document changes
  const changeListener = vscode.workspace.onDidChangeTextDocument((e) => {
    if (e.document.uri.toString() === document.uri.toString() && currentPanel) {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      debounceTimer = setTimeout(() => {
        if (currentPanel) {
          const bodyHtml = renderBody(e.document.getText());
          currentPanel.webview.postMessage({
            command: 'updateContent',
            html: bodyHtml,
          });
        }
      }, 300);
    }
  });

  currentPanel.onDidDispose(() => {
    currentPanel = undefined;
    changeListener.dispose();
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
  });
}

function updatePanelContent(panel: vscode.WebviewPanel, document: vscode.TextDocument): void {
  const bodyHtml = renderBody(document.getText());
  const title = getDocumentName(document);
  panel.webview.html = getPreviewHtml(bodyHtml, title);
}

function renderBody(markdownText: string): string {
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
  });
  md.use(mermaidPlugin);
  return md.render(markdownText);
}

function getDocumentName(document: vscode.TextDocument): string {
  return document.fileName.split(/[\\/]/).pop() ?? 'Untitled';
}
