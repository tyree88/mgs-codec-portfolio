<script>
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();
  
  // Props
  export let active = false;
  export let reducedMotion = false;
  
  // State
  let audioContext;
  let analyser;
  let microphone;
  let gainNode;
  let isConnected = false;
  let isProcessing = false;
  let pitchShift = 1.0; // Default pitch (no shift)
  let voiceEffect = 'none'; // Default effect
  let volume = 0.5; // Default volume (0-1)
  
  // Voice effect options
  const voiceEffects = [
    { id: 'none', label: 'None' },
    { id: 'snake', label: 'Snake' },
    { id: 'codec', label: 'Codec' },
    { id: 'robot', label: 'Robot' },
    { id: 'cyborg', label: 'Cyborg' }
  ];
  
  // Initialize audio system
  async function initAudio() {
    if (!audioContext) {
      try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        gainNode = audioContext.createGain();
        
        // Connect gain to output
        gainNode.connect(audioContext.destination);
        gainNode.gain.value = volume;
        
        // Connect analyser for visualization
        analyser.connect(gainNode);
        analyser.fftSize = 2048;
        
        isConnected = false;
      } catch (e) {
        console.error('Web Audio API is not supported in this browser', e);
      }
    }
  }
  
  // Start capturing audio from microphone
  async function startMicrophone() {
    if (!audioContext) {
      await initAudio();
    }
    
    if (isConnected) return;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      microphone = audioContext.createMediaStreamSource(stream);
      
      // Set up processing chain based on selected effect
      setupAudioProcessing();
      
      isConnected = true;
      dispatch('status', { connected: true });
    } catch (e) {
      console.error('Error accessing microphone:', e);
      dispatch('status', { connected: false, error: e.message });
    }
  }
  
  // Stop microphone capture
  function stopMicrophone() {
    if (microphone && microphone.mediaStream) {
      const tracks = microphone.mediaStream.getTracks();
      tracks.forEach(track => track.stop());
    }
    
    if (audioContext) {
      disconnectProcessing();
    }
    
    isConnected = false;
    isProcessing = false;
    dispatch('status', { connected: false });
  }
  
  // Handle volume change
  function handleVolumeChange(event) {
    volume = parseFloat(event.target.value);
    if (gainNode) {
      gainNode.gain.value = volume;
    }
  }
  
  // Handle pitch change
  function handlePitchChange(event) {
    pitchShift = parseFloat(event.target.value);
    if (isConnected) {
      setupAudioProcessing();
    }
  }
  
  // Handle voice effect change
  function handleEffectChange(event) {
    voiceEffect = event.target.value;
    if (isConnected) {
      setupAudioProcessing();
    }
  }
  
  // Set up audio processing chain based on selected effect
  function setupAudioProcessing() {
    // First disconnect existing processing
    disconnectProcessing();
    
    if (!microphone) return;
    
    // Create new processing chain
    let processingNode;
    
    switch (voiceEffect) {
      case 'snake':
        // Lower pitch for Snake voice
        processingNode = createPitchProcessor(0.8);
        break;
      case 'codec':
        // Add codec radio effect (low quality + slight distortion)
        processingNode = createCodecProcessor();
        break;
      case 'robot':
        // Robot voice effect
        processingNode = createRobotProcessor();
        break;
      case 'cyborg':
        // Cyborg voice (mix of human and robot)
        processingNode = createCyborgProcessor();
        break;
      default:
        // Just apply the pitch shift
        processingNode = createPitchProcessor(pitchShift);
    }
    
    // Connect the chain
    microphone.connect(processingNode);
    processingNode.connect(analyser);
    
    isProcessing = true;
  }
  
  // Disconnect all audio processing
  function disconnectProcessing() {
    if (microphone) {
      microphone.disconnect();
    }
    
    isProcessing = false;
  }
  
  // Create a simple pitch shifter (approximation)
  function createPitchProcessor(pitchFactor) {
    const processor = audioContext.createScriptProcessor(4096, 1, 1);
    
    processor.onaudioprocess = (e) => {
      const input = e.inputBuffer.getChannelData(0);
      const output = e.outputBuffer.getChannelData(0);
      
      // Very simple resampling by skipping/duplicating samples
      // This is a crude approximation but works for demo purposes
      for (let i = 0; i < output.length; i++) {
        const readIndex = Math.floor(i * pitchFactor);
        if (readIndex < input.length) {
          output[i] = input[readIndex];
        } else {
          output[i] = 0;
        }
      }
    };
    
    return processor;
  }
  
  // Create codec radio effect processor (low quality + slight distortion)
  function createCodecProcessor() {
    const lowpass = audioContext.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 2000; // Cut high frequencies
    
    const highpass = audioContext.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = 300; // Cut low frequencies
    
    const distortion = audioContext.createWaveShaper();
    distortion.curve = makeDistortionCurve(10); // Light distortion
    
    // Connect chain
    lowpass.connect(highpass);
    highpass.connect(distortion);
    
    return { 
      connect: (destination) => distortion.connect(destination),
      disconnect: () => {
        lowpass.disconnect();
        highpass.disconnect();
        distortion.disconnect();
      }
    };
  }
  
  // Create robot voice effect
  function createRobotProcessor() {
    const oscillator = audioContext.createOscillator();
    oscillator.type = 'sawtooth';
    oscillator.frequency.value = 50; // Modulation frequency
    oscillator.start();
    
    const modulationGain = audioContext.createGain();
    modulationGain.gain.value = 0.1;
    oscillator.connect(modulationGain);
    
    const processor = audioContext.createScriptProcessor(4096, 1, 1);
    processor.onaudioprocess = (e) => {
      const input = e.inputBuffer.getChannelData(0);
      const output = e.outputBuffer.getChannelData(0);
      
      // Apply robot effect
      for (let i = 0; i < output.length; i++) {
        // Add quantization noise and modulation
        output[i] = Math.round(input[i] * 10) / 10;
      }
    };
    
    return processor;
  }
  
  // Create cyborg voice (mix of human and robot)
  function createCyborgProcessor() {
    const robotProcessor = createRobotProcessor();
    
    const processor = audioContext.createScriptProcessor(4096, 1, 1);
    processor.onaudioprocess = (e) => {
      const input = e.inputBuffer.getChannelData(0);
      const output = e.outputBuffer.getChannelData(0);
      
      // Mix normal voice with robot effect
      for (let i = 0; i < output.length; i++) {
        // Create a mix of original and processed
        const robotic = Math.round(input[i] * 8) / 8; // Quantized
        output[i] = 0.6 * input[i] + 0.4 * robotic;
      }
    };
    
    return processor;
  }
  
  // Helper function to create distortion curve
  function makeDistortionCurve(amount) {
    const k = amount;
    const sampleCount = 44100;
    const curve = new Float32Array(sampleCount);
    
    for (let i = 0; i < sampleCount; ++i) {
      const x = i * 2 / sampleCount - 1;
      curve[i] = (3 + k) * x * 20 * (Math.PI / 180) / (Math.PI + k * Math.abs(x));
    }
    
    return curve;
  }
  
  // Toggle the microphone connection
  function toggleMicrophone() {
    if (isConnected) {
      stopMicrophone();
    } else {
      startMicrophone();
    }
  }
  
  // Cleanup on component destroy
  onDestroy(() => {
    stopMicrophone();
    
    if (audioContext) {
      audioContext.close().catch(() => {});
    }
  });
</script>

<div class="voice-modulator border border-codec-green p-4 bg-codec-dark-green bg-opacity-30">
  <div class="modulator-header mb-3 flex justify-between items-center">
    <h3 class="text-codec-light-green font-mono text-base font-bold">VOICE MODULATOR</h3>
    
    <button 
      class="mic-toggle-btn {isConnected ? 'active' : ''} text-sm px-3 py-1 border border-codec-green rounded"
      on:click={toggleMicrophone}
    >
      {isConnected ? 'DISCONNECT MIC' : 'CONNECT MIC'}
    </button>
  </div>
  
  <div class="modulator-controls grid gap-3">
    <div class="control-group">
      <label for="effect" class="text-codec-light-green font-mono text-sm">Voice Effect:</label>
      <select 
        id="effect"
        class="w-full bg-codec-dark-green text-codec-light-green border border-codec-green p-1 font-mono"
        on:change={handleEffectChange}
        value={voiceEffect}
      >
        {#each voiceEffects as effect}
          <option value={effect.id}>{effect.label}</option>
        {/each}
      </select>
    </div>
    
    <div class="control-group">
      <label for="pitch" class="text-codec-light-green font-mono text-sm">Pitch Shift: {pitchShift.toFixed(1)}</label>
      <input 
        id="pitch"
        type="range" 
        min="0.5" 
        max="2.0" 
        step="0.1"
        value={pitchShift}
        class="w-full"
        on:input={handlePitchChange}
      />
    </div>
    
    <div class="control-group">
      <label for="volume" class="text-codec-light-green font-mono text-sm">Volume: {Math.round(volume * 100)}%</label>
      <input 
        id="volume"
        type="range" 
        min="0" 
        max="1" 
        step="0.1"
        value={volume}
        class="w-full"
        on:input={handleVolumeChange}
      />
    </div>
  </div>
  
  <div class="status-indicator mt-3 text-xs font-mono">
    <div class="status-text text-codec-light-green">
      {#if isConnected}
        <span class="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span> Microphone connected
        {#if isProcessing}
          <span class="ml-2">| Processing with {voiceEffect === 'none' ? 'no effect' : voiceEffect + ' effect'}</span>
        {/if}
      {:else}
        <span class="inline-block w-2 h-2 bg-red-500 rounded-full mr-1"></span> Microphone disconnected
      {/if}
    </div>
    
    <div class="mt-2 text-codec-green opacity-80">
      Note: Allow microphone access when prompted. Voice is processed locally and not recorded.
    </div>
  </div>
</div>

<style>
  /* Input range styling */
  input[type="range"] {
    -webkit-appearance: none;
    appearance: none;
    height: 6px;
    background: #003300;
    border: 1px solid var(--codec-green, #00FF00);
    border-radius: 2px;
  }
  
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    background: var(--codec-green, #00FF00);
    border-radius: 50%;
    cursor: pointer;
  }
  
  input[type="range"]::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: var(--codec-green, #00FF00);
    border-radius: 50%;
    cursor: pointer;
    border: none;
  }
  
  select {
    appearance: none;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2300FF00' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 8px center;
    background-size: 16px;
    padding-right: 30px;
  }
  
  .mic-toggle-btn {
    transition: all 0.2s ease;
  }
  
  .mic-toggle-btn:hover {
    background-color: rgba(0, 255, 0, 0.2);
  }
  
  .mic-toggle-btn.active {
    background-color: var(--codec-green, #00FF00);
    color: black;
  }
</style>