import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, '../data');
const manifestPath = path.join(__dirname, '../data/itc-manifest.json');

try {
  const files = fs.readdirSync(dataDir)
    .filter(f => f.endsWith('.json') && f !== 'itc-manifest.json')
    .map(f => f.replace('.json', '').toUpperCase())
    .sort();

  fs.writeFileSync(manifestPath, JSON.stringify(files, null, 2));
  console.log(`✅ ITC Manifest generated with ${files.length} topics.`);
} catch (error) {
  console.error('❌ Error generating ITC manifest:', error);
  process.exit(1);
}
