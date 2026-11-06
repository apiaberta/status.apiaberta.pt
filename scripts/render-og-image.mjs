#!/usr/bin/env node
/**
 * Rasteriza scripts/og-image.svg para public/og-image.png (1200×630).
 * Requer Google Chrome (ou Chromium) e a fonte Inter instalada.
 *
 *   node scripts/render-og-image.mjs
 */
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const svgPath = path.join(root, 'scripts/og-image.svg');
const outPath = path.join(root, 'public/og-image.png');
const chrome = process.env.CHROME_PATH || '/usr/local/bin/google-chrome';
const limitBytes = 300 * 1024;

const svg = await readFile(svgPath, 'utf8');
const dir = await mkdtemp(path.join(tmpdir(), 'og-image-'));
const htmlPath = path.join(dir, 'og.html');
const shotPath = path.join(dir, 'og-image.png');

await writeFile(
    htmlPath,
    `<!doctype html>
<html lang="pt">
<head>
    <meta charset="utf-8" />
    <style>
        html, body { margin: 0; width: 1200px; height: 630px; overflow: hidden; }
    </style>
</head>
<body>${svg}</body>
</html>
`,
);

function waitForPng(file, timeoutMs = 20000) {
    const started = Date.now();
    return new Promise((resolve, reject) => {
        const tick = async () => {
            try {
                const info = await stat(file);
                if (info.size > 1000) {
                    setTimeout(resolve, 250);
                    return;
                }
            } catch {
                // still writing
            }
            if (Date.now() - started > timeoutMs) {
                reject(new Error('Chrome não escreveu o PNG a tempo.'));
                return;
            }
            setTimeout(tick, 150);
        };
        tick();
    });
}

const child = spawn(chrome, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    '--window-size=1200,630',
    `--user-data-dir=${path.join(dir, 'chrome-profile')}`,
    `--screenshot=${shotPath}`,
    '--virtual-time-budget=4000',
    `file://${htmlPath}`,
], { stdio: 'ignore' });

try {
    await waitForPng(shotPath);
} finally {
    child.kill('SIGKILL');
    await new Promise((resolve) => setTimeout(resolve, 300));
}

const png = await readFile(shotPath);
await writeFile(outPath, png);
await rm(dir, { recursive: true, force: true }).catch(() => {});
if (png.length > limitBytes) {
    throw new Error(`PNG com ${(png.length / 1024).toFixed(1)} KB; o limite é 300 KB.`);
}
console.log(`Escreveu ${path.relative(root, outPath)} (${png.length} bytes)`);
