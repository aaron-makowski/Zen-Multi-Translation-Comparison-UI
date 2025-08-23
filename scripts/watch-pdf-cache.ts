import chokidar from 'chokidar';
import { spawn } from 'node:child_process';
import path from 'node:path';

const pdfDir = path.resolve(process.cwd(), 'public', 'pdfs');

console.log(`Watching ${pdfDir} for new PDFs...`);

const watcher = chokidar.watch(pdfDir, {
  ignoreInitial: true,
});

watcher.on('error', (err) => {
  console.error('Watcher error:', err);
  process.exit(1);
});

watcher.on('add', (filePath) => {
  if (!filePath.endsWith('.pdf')) return;
  console.log(`New PDF detected: ${filePath}`);

  const proc = spawn('npx', ['tsx', 'scripts/ingest-pdf.ts', filePath], {
    stdio: 'inherit',
    shell: true,
  });

  proc.on('spawn', () => {
    console.log(`Ingestion process started for ${filePath}`);
  });

  proc.on('error', (err) => {
    console.error(`Failed to start ingestion for ${filePath}:`, err);
  });

  proc.on('close', (code) => {
    if (code === 0) {
      console.log(`Ingestion succeeded for ${filePath}`);
    } else {
      console.error(`Ingestion failed for ${filePath} (exit code ${code})`);
    }
  });
});
