import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const articlesDir = 'src/content/articles';
const files = readdirSync(articlesDir).filter((name) => name.endsWith('.md'));
const errors = [];
const warnings = [];
const titles = new Map();

for (const file of files) {
  const slug = file.replace(/\.md$/, '');
  const content = readFileSync(join(articlesDir, file), 'utf8');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    errors.push(file + ': use lowercase ASCII slug with hyphens');
  }
  const fm = content.match(/^---\r?\n([\s\S]+?)\r?\n---\r?\n/);
  if (!fm) {
    errors.push(file + ': missing frontmatter');
    continue;
  }
  const metadata = Object.fromEntries(
    fm[1].split(/\r?\n/).map((line) => {
      const m = line.match(/^([a-zA-Z]+):\s*(.*)$/);
      return m ? [m[1], m[2].trim().replace(/^["']|["']$/g, '')] : [];
    }).filter((parts) => parts.length === 2)
  );
  for (const key of ['title', 'description', 'category', 'date', 'author', 'draft']) {
    if (!metadata[key]) errors.push(file + ': missing ' + key);
  }
  if (!['aarti-stotra', 'dharm-sanskriti', 'vrat-tyohar'].includes(metadata.category)) {
    errors.push(file + ': unrecognized category');
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(metadata.date ?? '') || Number.isNaN(new Date(metadata.date).getTime())) {
    errors.push(file + ': invalid publication date');
  }
  if (!['true', 'false'].includes(metadata.draft)) {
    errors.push(file + ': draft must be true or false');
  }
  if ((metadata.description ?? '').length < 30) {
    errors.push(file + ': description too short');
  }
  const oldFile = titles.get(metadata.title);
  if (oldFile) errors.push(file + ': duplicate title with ' + oldFile);
  else titles.set(metadata.title, file);

  for (const match of content.matchAll(/\]\(\/lekh\/([a-z0-9-]+)\/\)/g)) {
    if (!existsSync(join(articlesDir, match[1] + '.md'))) {
      errors.push(file + ': broken article link ' + match[1]);
    }
  }

  if (metadata.draft === 'false' && !content.includes('## संदर्भ')) {
    warnings.push(file + ': published article lacks a references section; review this legacy article');
  }
}

console.log('Checked ' + files.length + ' article files.');
for (const warning of warnings) console.warn('WARNING: ' + warning);
if (errors.length) {
  for (const error of errors) console.error('ERROR: ' + error);
  process.exit(1);
}
console.log('Content checks passed.');


// Devotional source-text validation, separate from editorial articles.
const prayerDir = 'src/content/prayers';
const prayerFiles = readdirSync(prayerDir).filter((name) => name.endsWith('.md'));
for (const file of prayerFiles) {
  const text = readFileSync(join(prayerDir, file), 'utf8');
  const match = text.match(/^---\r?\n([\s\S]+?)\r?\n---\r?\n/);
  if (!match) { errors.push(file + ': missing devotional frontmatter'); continue; }
  const metadata = Object.fromEntries(match[1].split(/\r?\n/).map((line) => {
    const m = line.match(/^([a-zA-Z]+):\s*(.*)$/);
    return m ? [m[1], m[2].trim().replace(/^["']|["']$/g, '')] : [];
  }).filter((item) => item.length === 2));
  for (const key of ['title', 'description', 'kind', 'deity', 'deitySlug', 'attribution', 'date', 'draft']) {
    if (!metadata[key]) errors.push(file + ': missing devotional field ' + key);
  }
  if (!['aarti', 'chalisa', 'stotra'].includes(metadata.kind)) errors.push(file + ': invalid devotional kind');
  if (!['ganesh', 'hanuman', 'shiv', 'vishnu'].includes(metadata.deitySlug)) errors.push(file + ': invalid deitySlug');
  if (!['true', 'false'].includes(metadata.draft)) errors.push(file + ': invalid draft value');
  if (metadata.language && !['hi', 'mr', 'sa', 'awa'].includes(metadata.language)) errors.push(file + ': invalid language');
  if (!text.includes('## पाठ') && !text.includes('## स्रोत') && !text.includes('## संस्करण')) {
    warnings.push(file + ': lacks explicit version/source heading');
  }
  if (!text.includes('> ')) errors.push(file + ': missing verse block');
  if (file === 'shiva-panchakshara-stotram.md' || file === 'ganesha-pancharatnam.md') {
    const count = [...text.matchAll(/^### /gm)].length;
    if (count !== 5) errors.push(file + ': expected five main verse headings, got ' + count);
    if (!text.includes('## फलश्रुति')) errors.push(file + ': missing separate phalashruti');
  }
  if (file === 'sukhkarta-dukhharta.md') {
    const count = [...text.matchAll(/^### .*अंतरा/gm)].length;
    if (count !== 3) errors.push(file + ': expected three main stanzas, got ' + count);
  }
  if (file === 'hanuman-chalisa.md') {
    const body = text.split('## चालीस चौपाइयाँ\n')[1]?.split('## समापन दोहा')[0] ?? '';
    const count = body.trim().split(/\n>\s*\n>\s*/).filter(Boolean).length;
    if (count !== 40) errors.push(file + ': expected 40 chaupais, found ' + count);
  }
}
console.log('Checked ' + prayerFiles.length + ' devotional text files.');
if (errors.length) {
  for (const error of errors) console.error('ERROR: ' + error);
  process.exit(1);
}
