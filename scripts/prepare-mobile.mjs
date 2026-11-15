import { mkdir, copyFile, rm } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const webDir = resolve(root, 'www');

await rm(webDir, { recursive: true, force: true });
await mkdir(webDir, { recursive: true });

for (const file of ['index.html', 'englishgo-icon.png', 'englishgo-logo.png', 'firebase-config.js']) {
  await copyFile(resolve(root, file), resolve(webDir, file));
}

console.log('EnglishGo mobile web bundle prepared in ./www');
