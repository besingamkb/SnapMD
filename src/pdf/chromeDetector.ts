import * as fs from 'fs';
import * as vscode from 'vscode';

const WELL_KNOWN_PATHS: Record<string, string[]> = {
  darwin: [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
  ],
  linux: [
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/usr/bin/microsoft-edge',
    '/usr/bin/brave-browser',
    '/snap/bin/chromium',
  ],
  win32: [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe',
  ],
};

export function detectChromePath(): string {
  // 1. User setting
  const configured = vscode.workspace.getConfiguration('snapmd').get<string>('chromePath');
  if (configured) {
    if (!fs.existsSync(configured)) {
      throw new Error(
        `Chrome path from settings not found: ${configured}\n` +
        'Please verify the "snapmd.chromePath" setting points to a valid Chrome/Chromium executable.'
      );
    }
    return configured;
  }

  // 2. CHROME_PATH environment variable
  const envPath = process.env['CHROME_PATH'];
  if (envPath && fs.existsSync(envPath)) {
    return envPath;
  }

  // 3. Platform-specific well-known paths
  const platform = process.platform;
  const candidates = WELL_KNOWN_PATHS[platform] ?? [];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  throw new Error(
    'Could not find a Chrome/Chromium installation.\n\n' +
    'Please either:\n' +
    '  1. Install Google Chrome, Chromium, or Microsoft Edge\n' +
    '  2. Set the "snapmd.chromePath" setting to point to your browser executable\n' +
    '  3. Set the CHROME_PATH environment variable'
  );
}
