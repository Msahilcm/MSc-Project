// Clean up comments in JS/JSX/CSS files while preserving useful doc/comments
// Usage:
//   node scripts/clean-comments.mjs          # dry run (prints files that would change)
//   node scripts/clean-comments.mjs --write  # apply changes

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import globby from 'globby';
import stripJs from 'strip-comments';
import stripCss from 'strip-css-comments';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isWrite = process.argv.includes('--write');

const roots = ['src', 'backend'];
const patterns = roots.map((r) => `${r}/**/*.{js,jsx,css}`);
const ignore = ['**/node_modules/**', '**/uploads/**', '**/build/**', '**/dist/**'];

// Preserve block comments that look like JSDoc (/** ... */), important /*! ... */,
// ESLint/Prettier directives, and license banners
const preserveJs = (comment) => {
  if (!comment) return false;
  const c = String(comment);
  return (
    c.startsWith('/**') ||
    c.startsWith('/*!') ||
    c.includes('eslint') ||
    c.toLowerCase().includes('license') ||
    c.includes('@preserve')
  );
};

const preserveCss = (comment) => {
  if (!comment) return false;
  const c = String(comment);
  return c.startsWith('!') || c.toLowerCase().includes('license') || c.includes('@preserve');
};

const normalizeBlankLines = (text) => text.replace(/\n{3,}/g, '\n\n');

const processFile = async (file) => {
  const ext = path.extname(file).toLowerCase();
  const original = await fs.readFile(file, 'utf8');
  let cleaned = original;

  try {
    if (ext === '.js' || ext === '.jsx') {
      cleaned = stripJs(original, { preserve: preserveJs });
    } else if (ext === '.css') {
      cleaned = stripCss(original, { preserve: preserveCss });
    }
  } catch (e) {
    // If library parsing fails, skip file
    return { file, changed: false, error: e.message };
  }

  cleaned = normalizeBlankLines(cleaned).trimEnd() + '\n';

  if (cleaned !== original) {
    if (isWrite) {
      await fs.writeFile(file, cleaned, 'utf8');
    }
    return { file, changed: true };
  }
  return { file, changed: false };
};

const run = async () => {
  const files = await globby(patterns, { gitignore: true, ignore });
  const results = await Promise.all(files.map(processFile));
  const changed = results.filter((r) => r.changed);
  if (isWrite) {
    console.log(`Cleaned comments in ${changed.length} file(s).`);
  } else {
    console.log(`Dry run: ${changed.length} file(s) would change.`);
    changed.forEach((r) => console.log(' -', r.file));
    console.log('\nRun with --write to apply changes.');
  }
};

run().catch((e) => {
  console.error('Error cleaning comments:', e);
  process.exit(1);
});

