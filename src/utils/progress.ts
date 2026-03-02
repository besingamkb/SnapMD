import * as vscode from 'vscode';

let statusBarItem: vscode.StatusBarItem | undefined;
let hideTimer: ReturnType<typeof setTimeout> | undefined;

function ensureStatusBarItem(): vscode.StatusBarItem {
  if (!statusBarItem) {
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
  }
  return statusBarItem;
}

export function showExporting(): void {
  const item = ensureStatusBarItem();
  if (hideTimer) {
    clearTimeout(hideTimer);
    hideTimer = undefined;
  }
  item.text = '$(sync~spin) SnapMD: Exporting…';
  item.show();
}

export function showSuccess(): void {
  const item = ensureStatusBarItem();
  item.text = '$(check) SnapMD: Export complete';
  item.show();
  scheduleHide();
}

export function showError(message: string): void {
  const item = ensureStatusBarItem();
  item.text = `$(error) SnapMD: ${message}`;
  item.show();
  scheduleHide(5000);
}

function scheduleHide(ms = 3000): void {
  if (hideTimer) {
    clearTimeout(hideTimer);
  }
  hideTimer = setTimeout(() => {
    statusBarItem?.hide();
    hideTimer = undefined;
  }, ms);
}

export function disposeStatusBar(): void {
  if (hideTimer) {
    clearTimeout(hideTimer);
  }
  statusBarItem?.dispose();
  statusBarItem = undefined;
}
