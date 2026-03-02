import * as vscode from 'vscode';
import { handleExportPdf } from './commands/exportPdf';
import { handlePreviewMarkdown } from './commands/previewMarkdown';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('snapmd.exportPdf', (uri?: vscode.Uri) => {
      handleExportPdf(uri);
    }),
    vscode.commands.registerCommand('snapmd.previewMarkdown', (uri?: vscode.Uri) => {
      handlePreviewMarkdown(uri);
    }),
  );
}

export function deactivate() {}
