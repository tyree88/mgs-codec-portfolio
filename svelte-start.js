// This script starts the Svelte app
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Change directory to the svelte-app folder
const svelteAppDir = join(__dirname, 'svelte-app');
process.chdir(svelteAppDir);

// First, make sure the audio directory exists and contains the ringtone
const audioDir = join(svelteAppDir, 'public/audio');
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
  console.log(`Created audio directory at ${audioDir}`);
}

// Check if the ringtone exists, if not, run the generator
const ringtonePath = join(audioDir, 'codec-ringtone.mp3');
if (!fs.existsSync(ringtonePath)) {
  console.log('Ringtone not found, generating it...');
  try {
    // Import and run the generator
    import('./svelte-app/scripts/generateAudio.js')
      .then(() => console.log('Ringtone generation script executed'))
      .catch(err => console.error('Error generating ringtone:', err));
  } catch (error) {
    console.error('Error importing ringtone generator:', error);
  }
} else {
  console.log('Ringtone file found at:', ringtonePath);
}

// Start the Svelte development server using npx vite with improved configuration
console.log('Starting Svelte development server in directory:', svelteAppDir);
// Create a public directory for static assets if it doesn't exist
const publicDir = join(svelteAppDir, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
  console.log(`Created public directory at ${publicDir}`);
}

// Start Vite directly with full path to ensure it finds the correct config
const svelteProcess = spawn('npx', [
  'vite', 
  '--port', '5173', 
  '--host', '0.0.0.0',
  '--strictPort', 
  '--cors'
], {
  cwd: svelteAppDir, // Ensure we're in the right directory
  env: { ...process.env, FORCE_COLOR: "1" } // Enable colored output
});

// Log output
svelteProcess.stdout.on('data', (data) => {
  const output = data.toString();
  console.log(`Svelte: ${output}`);
  
  // Look for the local URL and log it clearly
  if (output.includes('Local:')) {
    console.log('========================================');
    console.log('Svelte app is running. Access via proxy at:');
    console.log('http://localhost:5000/svelte-app/');
    console.log('========================================');
  }
});

svelteProcess.stderr.on('data', (data) => {
  console.error(`Svelte error: ${data}`);
});

svelteProcess.on('close', (code) => {
  console.log(`Svelte process exited with code ${code}`);
  // Auto-restart if the process crashes with non-zero exit code
  if (code !== 0) {
    console.log('Attempting to restart Svelte app...');
    setTimeout(() => {
      // Reimport this module to restart the process
      import('./svelte-start.js').catch(err => {
        console.error('Failed to restart Svelte app:', err);
      });
    }, 3000);
  }
});

// Keep the script running
process.on('SIGINT', () => {
  svelteProcess.kill('SIGINT');
  process.exit(0);
});