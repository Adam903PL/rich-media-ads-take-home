// Weight of what each given HTML page loads statically: its stylesheets, scripts and images,
// plus the ES modules those scripts import statically. Dynamic import() is left out, because
// it only loads development aids here (debug.js). Also lists the files in the pages' folder
// (without design/) that no page loads.
// Usage: node tools/audit/weight.mjs <page.html> [<page.html> ...]
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';

const PAGE_REFERENCE = /<(?:link|script|img)\b[^>]*?\b(?:href|src)="([^"]+)"/g;
const STATIC_IMPORT = /^\s*(?:import|export)\b[^;]*?\bfrom\s*['"]([^'"]+)['"]|^\s*import\s*['"]([^'"]+)['"]/gm;
const EXCLUDED_FOLDERS = new Set(['design']);

function requireFile(file, referencedBy) {
  if (!existsSync(file) || !statSync(file).isFile()) {
    throw new Error(`${file} (referenced by ${referencedBy}) does not exist`);
  }
  return file;
}

function addModule(file, files) {
  if (files.has(file)) return;
  files.add(file);
  for (const [, from, bare] of readFileSync(file, 'utf8').matchAll(STATIC_IMPORT)) {
    addModule(requireFile(resolve(dirname(file), from ?? bare), file), files);
  }
}

function filesLoadedBy(page) {
  const files = new Set([page]);
  for (const [, reference] of readFileSync(page, 'utf8').matchAll(PAGE_REFERENCE)) {
    if (/^(data:|https?:|\/\/)/.test(reference)) continue;
    const file = requireFile(resolve(dirname(page), reference), page);
    if (file.endsWith('.js')) addModule(file, files);
    else files.add(file);
  }
  return files;
}

function listFolder(folder) {
  return readdirSync(folder, { withFileTypes: true }).flatMap((entry) => {
    const path = join(folder, entry.name);
    if (!entry.isDirectory()) return [path];
    return EXCLUDED_FOLDERS.has(entry.name) ? [] : listFolder(path);
  });
}

const pages = process.argv.slice(2).map((page) => requireFile(resolve(page), 'the command line'));
if (pages.length === 0) {
  throw new Error('Usage: node tools/audit/weight.mjs <page.html> [<page.html> ...]');
}

const root = dirname(pages[0]);
const show = (file) => relative(root, file).split(sep).join('/');
const bytes = (files) => [...files].reduce((sum, file) => sum + statSync(file).size, 0);
const format = (size) => `${size.toLocaleString('en-US').replaceAll(',', ' ')} B (${(size / 1024 / 1024).toFixed(2)} MB)`;

const all = new Set();
let packages = 0;

for (const page of pages) {
  const files = filesLoadedBy(page);
  files.forEach((file) => all.add(file));
  packages += bytes(files);
  console.log(`${show(page)}: ${files.size} files, ${format(bytes(files))}`);
  for (const file of [...files].sort()) console.log(`  ${String(statSync(file).size).padStart(9)}  ${show(file)}`);
}

console.log(`\nAll packages together: ${format(packages)}`);
console.log(`Every file once:       ${format(bytes(all))}`);

const unused = listFolder(root).filter((file) => !all.has(resolve(file)));
console.log(`\nIn ${relative(process.cwd(), root) || '.'} (without ${[...EXCLUDED_FOLDERS].join(', ')}/) but loaded by no page: ${unused.length ? '' : 'none'}`);
for (const file of unused.sort()) console.log(`  ${String(statSync(file).size).padStart(9)}  ${show(file)}`);
