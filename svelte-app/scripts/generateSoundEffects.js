/**
 * Node.js script to generate all sound effects for the codec interface
 * 
 * This script uses the Web Audio API via the AudioContext from the 'web-audio-api' package
 * to generate the sound effects programmatically.
 * 
 * Run with:
 * node svelte-app/scripts/generateSoundEffects.js
 */

const fs = require('fs');
const path = require('path');
const { AudioContext } = require('web-audio-api');

// Make sure the audio directory exists
const audioDir = path.join(__dirname, '../public/audio');
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

// Generate the codec ringtone
generateCodecRingtone()
  .then(() => generateFrequencyChangeSound())
  .then(() => generateEasterEggFoundSound())
  .then(() => {
    console.log('All sound effects generated successfully!');
  })
  .catch(err => {
    console.error('Error generating sound effects:', err);
  });

// Generate the MGS2 codec ringtone
async function generateCodecRingtone() {
  // Frequencies for the codec ringtone beeps
  const beepFrequencies = [1280, 1320, 1200, 1080, 1200, 1320];
  const beepDurations = [0.075, 0.075, 0.075, 0.075, 0.075, 0.075];
  const pauseDurations = [0.075, 0.075, 0.075, 0.075, 0.075, 0.3];
  
  const audioContext = new AudioContext();
  const totalDuration = 3.0; // 3 seconds (enough for several repetitions)
  const outputBuffer = audioContext.createBuffer(
    1, // Mono
    Math.ceil(totalDuration * audioContext.sampleRate),
    audioContext.sampleRate
  );
  
  const outputChannel = outputBuffer.getChannelData(0);
  let currentTime = 0;
  
  // Generate 3 repetitions of the pattern
  for (let repeat = 0; repeat < 3; repeat++) {
    for (let i = 0; i < beepFrequencies.length; i++) {
      const beepFreq = beepFrequencies[i];
      const beepDuration = beepDurations[i];
      const pauseDuration = pauseDurations[i];
      
      // Calculate sample positions
      const startSample = Math.floor(currentTime * audioContext.sampleRate);
      const endSample = Math.floor((currentTime + beepDuration) * audioContext.sampleRate);
      
      // Generate the beep
      for (let sample = startSample; sample < endSample; sample++) {
        if (sample < outputChannel.length) {
          const t = (sample - startSample) / audioContext.sampleRate;
          
          // Simple sine wave with envelope
          let amplitude = 0.3; // Lower volume
          
          // Apply envelope to avoid clicks
          if (t < 0.01) {
            // Attack
            amplitude *= (t / 0.01);
          } else if (t > beepDuration - 0.01) {
            // Release
            amplitude *= ((beepDuration - t) / 0.01);
          }
          
          outputChannel[sample] = amplitude * Math.sin(2 * Math.PI * beepFreq * t);
        }
      }
      
      // Move to the next beep (including pause)
      currentTime += beepDuration + pauseDuration;
    }
  }
  
  // Export the buffer as WAV
  const wavBuffer = bufferToWav(outputBuffer);
  const outputPath = path.join(audioDir, 'codec-ringtone.mp3');
  
  return new Promise((resolve, reject) => {
    fs.writeFile(outputPath, wavBuffer, err => {
      if (err) {
        reject(err);
      } else {
        console.log(`Created codec ringtone at ${outputPath}`);
        resolve();
      }
    });
  });
}

// Generate the frequency change sound
async function generateFrequencyChangeSound() {
  const audioContext = new AudioContext();
  const duration = 0.2; // 200ms
  const outputBuffer = audioContext.createBuffer(
    1,
    Math.ceil(duration * audioContext.sampleRate),
    audioContext.sampleRate
  );
  
  const outputChannel = outputBuffer.getChannelData(0);
  
  // Create a frequency sweep from high to low
  for (let i = 0; i < outputChannel.length; i++) {
    const t = i / audioContext.sampleRate;
    const progress = t / duration;
    
    // Sweep from 2000Hz to 500Hz
    const frequency = 2000 - (1500 * progress);
    
    // Amplitude with envelope
    let amplitude = 0.3;
    
    // Apply fade-in and fade-out
    if (t < 0.02) {
      amplitude *= (t / 0.02);
    } else if (t > duration - 0.05) {
      amplitude *= ((duration - t) / 0.05);
    }
    
    // Add some noise for a digital effect
    const noise = 0.05 * (Math.random() * 2 - 1);
    
    outputChannel[i] = amplitude * Math.sin(2 * Math.PI * frequency * t) + noise;
  }
  
  // Export the buffer as WAV
  const wavBuffer = bufferToWav(outputBuffer);
  const outputPath = path.join(audioDir, 'frequency-change.mp3');
  
  return new Promise((resolve, reject) => {
    fs.writeFile(outputPath, wavBuffer, err => {
      if (err) {
        reject(err);
      } else {
        console.log(`Created frequency change sound at ${outputPath}`);
        resolve();
      }
    });
  });
}

// Generate the easter egg found sound
async function generateEasterEggFoundSound() {
  const audioContext = new AudioContext();
  const duration = 1.0; // 1 second
  const outputBuffer = audioContext.createBuffer(
    1,
    Math.ceil(duration * audioContext.sampleRate),
    audioContext.sampleRate
  );
  
  const outputChannel = outputBuffer.getChannelData(0);
  
  // Create a distinctive sound for easter egg discovery
  for (let i = 0; i < outputChannel.length; i++) {
    const t = i / audioContext.sampleRate;
    
    // First part: ascending notes
    if (t < 0.5) {
      const progress = t / 0.5;
      // Sweep up in discrete steps
      const baseFreq = 300 + Math.floor(progress * 5) * 100;
      const amplitude = 0.3 * (0.5 + 0.5 * Math.sin(Math.PI * progress));
      
      // Modulate with a second frequency for a more interesting sound
      outputChannel[i] = amplitude * Math.sin(2 * Math.PI * baseFreq * t) 
                        * (0.7 + 0.3 * Math.sin(2 * Math.PI * 20 * t));
    } 
    // Second part: success sound
    else {
      const localT = t - 0.5;
      const baseFreq = 800;
      const amplitude = 0.3 * Math.exp(-localT * 4);
      
      outputChannel[i] = amplitude * Math.sin(2 * Math.PI * baseFreq * localT);
    }
    
    // Add some retro digital noise
    if (Math.random() < 0.1) {
      outputChannel[i] += 0.05 * (Math.random() * 2 - 1);
    }
  }
  
  // Export the buffer as WAV
  const wavBuffer = bufferToWav(outputBuffer);
  const outputPath = path.join(audioDir, 'easter-egg-found.mp3');
  
  return new Promise((resolve, reject) => {
    fs.writeFile(outputPath, wavBuffer, err => {
      if (err) {
        reject(err);
      } else {
        console.log(`Created easter egg found sound at ${outputPath}`);
        resolve();
      }
    });
  });
}

// Convert AudioBuffer to WAV format
function bufferToWav(audioBuffer) {
  const numChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const format = 1; // PCM format
  const bitDepth = 16;
  
  // Calculate file size
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
  const dataSize = audioBuffer.length * blockAlign;
  const fileSize = 44 + dataSize; // WAV header is 44 bytes
  
  // Create the buffer
  const buffer = Buffer.alloc(fileSize);
  
  // Write the WAV header
  // "RIFF" chunk descriptor
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  
  // "fmt " sub-chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // fmt chunk size
  buffer.writeUInt16LE(format, 20); // audio format (PCM)
  buffer.writeUInt16LE(numChannels, 22); // number of channels
  buffer.writeUInt32LE(sampleRate, 24); // sample rate
  buffer.writeUInt32LE(sampleRate * blockAlign, 28); // byte rate
  buffer.writeUInt16LE(blockAlign, 32); // block align
  buffer.writeUInt16LE(bitDepth, 34); // bits per sample
  
  // "data" sub-chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40); // data chunk size
  
  // Write the audio data
  let offset = 44;
  for (let i = 0; i < audioBuffer.length; i++) {
    for (let channel = 0; channel < numChannels; channel++) {
      const sample = audioBuffer.getChannelData(channel)[i];
      // Convert float to 16-bit PCM
      const pcmSample = Math.max(-1, Math.min(1, sample));
      const int16Sample = pcmSample < 0 
        ? Math.floor(pcmSample * 0x8000) 
        : Math.floor(pcmSample * 0x7FFF);
        
      buffer.writeInt16LE(int16Sample, offset);
      offset += bytesPerSample;
    }
  }
  
  return buffer;
}