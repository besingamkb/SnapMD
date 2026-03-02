import * as vscode from 'vscode';

export interface SnapMdConfig {
  chromePath: string;
  pdfFormat: string;
  printBackground: boolean;
  mermaidTimeout: number;
}

export function getConfig(): SnapMdConfig {
  const config = vscode.workspace.getConfiguration('snapmd');
  return {
    chromePath: config.get<string>('chromePath', ''),
    pdfFormat: config.get<string>('pdfFormat', 'A4'),
    printBackground: config.get<boolean>('printBackground', true),
    mermaidTimeout: config.get<number>('mermaidTimeout', 10000),
  };
}
