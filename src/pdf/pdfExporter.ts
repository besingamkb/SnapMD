import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import puppeteer from 'puppeteer-core';
import * as vscode from 'vscode';
import { renderMarkdownToHtml } from '../markdown/renderer';
import { detectChromePath } from './chromeDetector';

export interface ExportOptions {
  markdownText: string;
  outputPath: string;
  title?: string;
  sourceDir?: string;
}

export async function exportToPdf(options: ExportOptions): Promise<void> {
  const { markdownText, outputPath, title, sourceDir } = options;

  const config = vscode.workspace.getConfiguration('snapmd');
  const pdfFormat = config.get<string>('pdfFormat', 'A4');
  const printBackground = config.get<boolean>('printBackground', true);
  const mermaidTimeout = config.get<number>('mermaidTimeout', 10000);

  const html = renderMarkdownToHtml(markdownText, { title });
  const chromePath = detectChromePath();

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();

    // Use a temp file so relative images resolve from the source directory
    let tempHtmlPath: string | undefined;
    try {
      const baseDir = sourceDir ?? os.tmpdir();
      tempHtmlPath = path.join(baseDir, `.snapmd-temp-${Date.now()}.html`);
      fs.writeFileSync(tempHtmlPath, html, 'utf-8');
      await page.goto(`file://${tempHtmlPath}`, { waitUntil: 'networkidle0' });
    } catch {
      // Fallback to setContent if temp file approach fails
      await page.setContent(html, { waitUntil: 'networkidle0' });
    } finally {
      if (tempHtmlPath && fs.existsSync(tempHtmlPath)) {
        fs.unlinkSync(tempHtmlPath);
      }
    }

    // Wait for mermaid diagrams if present
    const hasMermaid = markdownText.includes('```mermaid');
    if (hasMermaid) {
      try {
        await page.waitForSelector('.mermaid svg', { timeout: mermaidTimeout });
      } catch {
        // Non-fatal: mermaid might not have rendered, continue with export
      }
    }

    const pdfBuffer = await page.pdf({
      format: pdfFormat as any,
      printBackground,
      margin: {
        top: '20mm',
        bottom: '20mm',
        left: '15mm',
        right: '15mm',
      },
    });

    fs.writeFileSync(outputPath, pdfBuffer);
  } finally {
    await browser.close();
  }
}
