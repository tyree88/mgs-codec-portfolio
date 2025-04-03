/**
 * Node.js script to generate the codec ringtone
 * This script will generate and save the ringtone to the public/audio directory
 */

import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the audio directory exists
const audioDir = path.join(__dirname, '../public/audio');
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

// Path to save the ringtone
const ringtonePath = path.join(audioDir, 'codec-ringtone.mp3');

// Generate a simple metallic beeping sound file that resembles the MGS codec call
// For simplicity, we'll use the sox command-line utility (if available)
// Otherwise, we'll create a basic audio tone with pure JavaScript

function generateRingtoneWithSox() {
  return new Promise((resolve, reject) => {
    // Check if sox is available
    exec('command -v sox', (error) => {
      if (error) {
        console.log('Sox not available, using fallback method');
        return resolve(false);
      }
      
      // Use sox to generate the ringtone
      const soxCommand = `sox -n -r 44100 -c 1 "${ringtonePath}" synth 0.1 sine 1500 synth 0.2 sine 0 synth 0.1 sine 1800 synth 0.2 sine 0 synth 0.1 sine 1500 synth 0.2 sine 0 synth 0.1 sine 1800 repeat 3`;
      
      exec(soxCommand, (error) => {
        if (error) {
          console.error('Error generating ringtone with sox:', error);
          return resolve(false);
        }
        
        console.log(`Ringtone generated and saved to ${ringtonePath}`);
        return resolve(true);
      });
    });
  });
}

// Fallback method to generate a simple audio file
function generateRingtoneManually() {
  // Since we can't easily create audio files in Node.js without extra packages,
  // for now we'll write a very simple WAV file with minimal headers and a sine wave
  
  // We'll create a very simple WAV file header and data
  // This is a very basic implementation and won't sound as good as sox
  const sampleRate = 44100;
  const numChannels = 1;
  const bitsPerSample = 16;
  const duration = 3; // seconds
  
  // Calculate file size
  const dataSize = sampleRate * duration * numChannels * (bitsPerSample / 8);
  const fileSize = 36 + dataSize;
  
  // Create a buffer for the WAV file
  const buffer = Buffer.alloc(44 + dataSize);
  
  // Write WAV header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(fileSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // fmt chunk size
  buffer.writeUInt16LE(1, 20); // Audio format (1 = PCM)
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * numChannels * (bitsPerSample / 8), 28); // Byte rate
  buffer.writeUInt16LE(numChannels * (bitsPerSample / 8), 32); // Block align
  buffer.writeUInt16LE(bitsPerSample, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);
  
  // Generate a simple beep pattern
  let offset = 44;
  const beepFreq1 = 1500; // Hz
  const beepFreq2 = 1800; // Hz
  const beepDuration = 0.1; // seconds
  const gapDuration = 0.2; // seconds
  
  function generateBeep(frequency, startTime, duration) {
    const endTime = startTime + duration;
    const samplesCount = Math.floor(sampleRate * duration);
    
    for (let i = 0; i < samplesCount; i++) {
      const t = startTime + (i / sampleRate);
      if (t < endTime) {
        const sample = Math.sin(2 * Math.PI * frequency * t);
        // Convert to 16-bit PCM
        const value = Math.floor(sample * 32767);
        buffer.writeInt16LE(value, offset);
        offset += 2;
      }
    }
  }
  
  // Generate pattern: beep, gap, beep, gap, repeat
  let time = 0;
  while (time < duration) {
    generateBeep(beepFreq1, time, beepDuration);
    time += beepDuration + gapDuration;
    
    generateBeep(beepFreq2, time, beepDuration);
    time += beepDuration + gapDuration;
  }
  
  // Save the file
  fs.writeFileSync(ringtonePath, buffer);
  console.log(`Simple ringtone generated and saved to ${ringtonePath}`);
  return true;
}

// Try to generate the ringtone with sox first, then fall back to manual method
async function generateRingtone() {
  const soxSuccess = await generateRingtoneWithSox();
  if (!soxSuccess) {
    generateRingtoneManually();
  }
}

// Run the generation
generateRingtone().catch(err => {
  console.error('Failed to generate ringtone:', err);
});