/**
 * This is a utility script to generate a ringtone similar to the MGS codec call
 * We're doing this in JavaScript since we can't easily upload audio files directly
 */

// Set up the audio context
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const duration = 3; // seconds
const sampleRate = audioContext.sampleRate;
const frameCount = sampleRate * duration;

// Create a buffer for the ringtone
const ringtoneBuffer = audioContext.createBuffer(1, frameCount, sampleRate);
const channelData = ringtoneBuffer.getChannelData(0);

// Generate the MGS-like ringtone pattern
// The ringtone consists of two alternating high-pitched beeps
function generateRingtone() {
  const beepFreq1 = 1500; // Hz
  const beepFreq2 = 1800; // Hz
  const beepDuration = 0.1; // seconds
  const gapDuration = 0.2; // seconds
  
  let time = 0;
  while (time < duration) {
    // First beep
    for (let i = 0; i < beepDuration * sampleRate; i++) {
      const position = time * sampleRate + i;
      if (position < frameCount) {
        channelData[position] = Math.sin(2 * Math.PI * beepFreq1 * i / sampleRate) * 0.5;
      }
    }
    time += beepDuration;
    
    // Gap
    time += gapDuration;
    
    // Second beep
    for (let i = 0; i < beepDuration * sampleRate; i++) {
      const position = time * sampleRate + i;
      if (position < frameCount) {
        channelData[position] = Math.sin(2 * Math.PI * beepFreq2 * i / sampleRate) * 0.5;
      }
    }
    time += beepDuration;
    
    // Gap
    time += gapDuration;
  }
  
  return ringtoneBuffer;
}

// Create and download the ringtone
function downloadRingtone() {
  const buffer = generateRingtone();
  
  // Set up the offline audio context to render
  const offlineContext = new OfflineAudioContext(1, frameCount, sampleRate);
  const source = offlineContext.createBufferSource();
  source.buffer = buffer;
  source.connect(offlineContext.destination);
  source.start();
  
  // Render and create a WAV download
  offlineContext.startRendering().then(renderedBuffer => {
    // Convert buffer to WAV
    const wavBlob = bufferToWave(renderedBuffer, frameCount);
    
    // Create download link
    const url = URL.createObjectURL(wavBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = "codec-ringtone.wav";
    link.click();
  });
}

// Helper function to convert AudioBuffer to WAV format
function bufferToWave(abuffer, len) {
  const numOfChan = abuffer.numberOfChannels;
  const length = len * numOfChan * 2 + 44;
  const buffer = new ArrayBuffer(length);
  const view = new DataView(buffer);
  let offset = 0;
  let pos = 0;
  
  // Write WAVE header
  setUint32(0x46464952); // "RIFF"
  setUint32(length - 8); // file length - 8
  setUint32(0x45564157); // "WAVE"
  
  setUint32(0x20746d66); // "fmt " chunk
  setUint32(16); // length = 16
  setUint16(1); // PCM (uncompressed)
  setUint16(numOfChan);
  setUint32(abuffer.sampleRate);
  setUint32(abuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
  setUint16(numOfChan * 2); // block-align
  setUint16(16); // 16-bit
  
  setUint32(0x61746164); // "data" chunk
  setUint32(length - pos - 4); // chunk length
  
  // Write interleaved data
  for (let i = 0; i < abuffer.numberOfChannels; i++) {
    const channel = abuffer.getChannelData(i);
    for (let j = 0; j < len; j++) {
      const sample = Math.max(-1, Math.min(1, channel[j])); // clamp
      sample < 0 ? sample * 0x8000 : sample * 0x7FFF; // convert to 16-bit
      view.setInt16(pos, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true); // write 16-bit
      pos += 2;
    }
  }
  
  // Helper function to write strings/ints to the buffer
  function setUint32(data) {
    view.setUint32(offset, data, true);
    offset += 4;
  }
  
  function setUint16(data) {
    view.setUint16(offset, data, true);
    offset += 2;
  }
  
  return new Blob([buffer], { type: 'audio/wav' });
}

// Export functions
export { generateRingtone, downloadRingtone };