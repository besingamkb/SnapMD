import * as path from 'path';
import * as vscode from 'vscode';
import { exportToPdf } from '../pdf/pdfExporter';
import { resolveTargetDocument } from '../utils/resolveDocument';
import { showExporting, showSuccess, showError } from '../utils/progress';

export async function handleExportPdf(uri?: vscode.Uri): Promise<void> {
  const document = await resolveTargetDocument(uri);
  if (!document) {
    return;
  }

  const sourcePath = document.uri.fsPath;
  const defaultName = path.basename(sourcePath, path.extname(sourcePath)) + '.pdf';
  const defaultUri = vscode.Uri.file(path.join(path.dirname(sourcePath), defaultName));

  const saveUri = await vscode.window.showSaveDialog({
    defaultUri,
    filters: { 'PDF Files': ['pdf'] },
  });

  if (!saveUri) {
    return;
  }

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: 'SnapMD: Exporting to PDF…',
      cancellable: false,
    },
    async () => {
      showExporting();
      try {
        await exportToPdf({
          markdownText: document.getText(),
          outputPath: saveUri.fsPath,
          title: path.basename(sourcePath, path.extname(sourcePath)),
          sourceDir: path.dirname(sourcePath),
        });

        showSuccess();
        const openAction = 'Open PDF';
        const result = await vscode.window.showInformationMessage(
          `PDF exported to ${path.basename(saveUri.fsPath)}`,
          openAction,
        );
        if (result === openAction) {
          await vscode.env.openExternal(saveUri);
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        showError('Export failed');
        vscode.window.showErrorMessage(`SnapMD export failed: ${message}`);
      }
    },
  );
}
