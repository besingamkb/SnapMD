import * as vscode from 'vscode';
import { showPreviewPanel } from '../webview/previewPanel';
import { handleExportPdf } from './exportPdf';
import { resolveTargetDocument } from '../utils/resolveDocument';

export async function handlePreviewMarkdown(uri?: vscode.Uri): Promise<void> {
  const document = await resolveTargetDocument(uri);
  if (!document) {
    return;
  }

  showPreviewPanel(document, () => {
    handleExportPdf(document.uri);
  });
}
