// This script starts the Svelte app
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Change directory to the svelte-app folder
process.chdir(join(__dirname, 'svelte-app'));

// Start the Svelte development server using npx vite directly
const svelteProcess = spawn('npx', ['vite', '--port', '5173', '--host']);

// Log output
svelteProcess.stdout.on('data', (data) => {
  console.log(`Svelte: ${data}`);
});

svelteProcess.stderr.on('data', (data) => {
  console.error(`Svelte error: ${data}`);
});

svelteProcess.on('close', (code) => {
  console.log(`Svelte process exited with code ${code}`);
});

// Keep the script running
process.on('SIGINT', () => {
  svelteProcess.kill('SIGINT');
  process.exit(0);
});