/**
 * Generate the MGS2 codec ringtone programmatically using Web Audio API
 */

// Frequencies for each beep in the MGS2 codec ringtone pattern
const beepFrequencies = [1280, 1320, 1200, 1080, 1200, 1320];
const beepDurations = [0.075, 0.075, 0.075, 0.075, 0.075, 0.075];
const pauseDurations = [0.075, 0.075, 0.075, 0.075, 0.075, 0.3];

// Generate the codec ringtone audio 
export function generateRingtone() {
  return new Promise((resolve) => {
    // Create an audio context
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const masterGain = audioContext.createGain();
    masterGain.gain.value = 0.25;
    masterGain.connect(audioContext.destination);
    
    // Buffer to hold the full ringtone
    const ringtoneBuffer = audioContext.createBuffer(
      1, // Mono audio (1 channel)
      audioContext.sampleRate * 3, // 3 seconds duration
      audioContext.sampleRate
    );
    
    // Get the channel data
    const channelData = ringtoneBuffer.getChannelData(0);
    
    let currentTime = 0;
    
    // Generate the ringtone pattern with 3 repetitions
    for (let repeat = 0; repeat < 3; repeat++) {
      // Add each beep in the pattern
      for (let i = 0; i < beepFrequencies.length; i++) {
        // Generate the beep
        const beepSamples = generateBeep(
          beepFrequencies[i], 
          currentTime, 
          beepDurations[i], 
          audioContext.sampleRate
        );
        
        // Add the beep to the channel data
        for (let j = 0; j < beepSamples.length; j++) {
          const sampleIndex = Math.floor((currentTime + (j / audioContext.sampleRate)) * audioContext.sampleRate);
          if (sampleIndex < channelData.length) {
            channelData[sampleIndex] += beepSamples[j];
          }
        }
        
        // Update the current time
        currentTime += beepDurations[i] + pauseDurations[i];
      }
    }
    
    // Create a source from the buffer
    const source = audioContext.createBufferSource();
    source.buffer = ringtoneBuffer;
    source.connect(masterGain);
    
    // Export the ringtone as WAV
    const wavBlob = bufferToWave(ringtoneBuffer, ringtoneBuffer.length);
    
    // Close the audio context
    audioContext.close().then(() => {
      resolve(wavBlob);
    });
  });
}

// Generate a single beep at the specified frequency and duration
function generateBeep(frequency, startTime, duration, sampleRate) {
  const samples = Math.floor(duration * sampleRate);
  const buffer = new Float32Array(samples);
  
  // Create a sine wave with the given frequency
  for (let i = 0; i < samples; i++) {
    // Sine wave formula: amplitude * sin(2 * PI * frequency * time)
    buffer[i] = 0.5 * Math.sin(2 * Math.PI * frequency * (i / sampleRate));
    
    // Apply a simple envelope to avoid clicks
    let envelope = 1;
    const attackSamples = Math.min(0.01 * sampleRate, samples / 4);
    const releaseSamples = Math.min(0.01 * sampleRate, samples / 4);
    
    if (i < attackSamples) {
      // Attack phase (fade in)
      envelope = i / attackSamples;
    } else if (i > samples - releaseSamples) {
      // Release phase (fade out)
      envelope = (samples - i) / releaseSamples;
    }
    
    // Apply envelope
    buffer[i] *= envelope;
  }
  
  return buffer;
}

// Download the generated ringtone
export function downloadRingtone() {
  generateRingtone().then((wavBlob) => {
    const url = URL.createObjectURL(wavBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'codec-ringtone.wav';
    link.click();
    URL.revokeObjectURL(url);
  });
}

// Convert an AudioBuffer to a WAV Blob
function bufferToWave(abuffer, len) {
  // Get the channel data from the buffer
  const numChannels = abuffer.numberOfChannels;
  const sampleRate = abuffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;
  
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
  
  const buffer = new ArrayBuffer(44 + len * blockAlign);
  const view = new DataView(buffer);
  
  // Write the WAV header
  
  // "RIFF" chunk descriptor
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + len * blockAlign, true);
  writeString(view, 8, 'WAVE');
  
  // "fmt " sub-chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // fmt chunk size
  view.setUint16(20, format, true); // audio format (PCM)
  view.setUint16(22, numChannels, true); // number of channels
  view.setUint32(24, sampleRate, true); // sample rate
  view.setUint32(28, sampleRate * blockAlign, true); // byte rate
  view.setUint16(32, blockAlign, true); // block align
  view.setUint16(34, bitDepth, true); // bits per sample
  
  // "data" sub-chunk
  writeString(view, 36, 'data');
  view.setUint32(40, len * blockAlign, true); // data chunk size
  
  // Write the audio data
  const channels = [];
  for (let i = 0; i < numChannels; i++) {
    channels.push(abuffer.getChannelData(i));
  }
  
  let offset = 44;
  for (let i = 0; i < len; i++) {
    for (let c = 0; c < numChannels; c++) {
      // Convert float audio data to 16-bit PCM
      const sample = Math.max(-1, Math.min(1, channels[c][i]));
      const sampleInt = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
      view.setInt16(offset, sampleInt, true);
      offset += bytesPerSample;
    }
  }
  
  return new Blob([buffer], { type: 'audio/wav' });
  
  // Helper function to write strings to the DataView
  function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }
}

// Export default to make module compatible with scripts
export default { generateRingtone, downloadRingtone };