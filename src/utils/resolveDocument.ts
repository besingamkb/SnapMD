import * as vscode from 'vscode';

export async function resolveTargetDocument(uri?: vscode.Uri): Promise<vscode.TextDocument | undefined> {
  // If a URI is provided (context menu / editor title), open that document
  if (uri) {
    return vscode.workspace.openTextDocument(uri);
  }

  // Otherwise use the active editor
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showWarningMessage('SnapMD: No active Markdown document found.');
    return undefined;
  }

  const document = editor.document;
  if (document.languageId !== 'markdown') {
    vscode.window.showWarningMessage('SnapMD: The active document is not a Markdown file.');
    return undefined;
  }

  return document;
}
