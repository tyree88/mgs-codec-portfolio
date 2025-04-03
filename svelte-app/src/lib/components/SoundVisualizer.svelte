<script>
  import { onMount, onDestroy } from 'svelte';
  
  // Props
  export let active = false;
  export let audioSource = null;
  export let reducedMotion = false;
  
  // State
  let canvas;
  let canvasContext;
  let audioContext;
  let analyser;
  let dataArray;
  let source;
  let animationFrame;
  let connected = false;
  
  let visualizerStyle = 'waveform'; // Options: waveform, frequency, circular
  
  // Set up the visualizer when the component is mounted
  onMount(() => {
    if (!canvas) return;
    
    // Get the canvas context
    canvasContext = canvas.getContext('2d');
    
    // Set the canvas size
    resizeCanvas();
    
    // Listen for window resize
    window.addEventListener('resize', resizeCanvas);
  });
  
  // Clean up when the component is destroyed
  onDestroy(() => {
    window.removeEventListener('resize', resizeCanvas);
    cancelAnimationFrame(animationFrame);
    
    if (audioContext) {
      disconnectAudio();
    }
  });
  
  // Watch for changes to the active prop
  $: if (active !== undefined) {
    if (active) {
      activateVisualizer();
    } else {
      deactivateVisualizer();
    }
  }
  
  // Watch for changes to the audioSource prop
  $: if (audioSource && active && !connected) {
    if (audioContext) {
      connectAudioSource();
    }
  }
  
  // Adjust canvas size on window resize
  function resizeCanvas() {
    if (!canvas) return;
    
    // Set the canvas size
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    
    // Redraw
    if (active && canvasContext) {
      draw();
    }
  }
  
  // Activate the visualizer
  function activateVisualizer() {
    if (!audioContext) {
      // Create audio context
      try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        
        // Create data array for analysis
        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
        
        // Connect the analyser to the destination
        analyser.connect(audioContext.destination);
        
        // If we already have an audio source, connect it
        if (audioSource) {
          connectAudioSource();
        }
        
        // Start the visualization loop
        draw();
      } catch (e) {
        console.error('Web Audio API not supported:', e);
      }
    } else {
      // If we already have an audio context, just start drawing
      draw();
    }
  }
  
  // Deactivate the visualizer
  function deactivateVisualizer() {
    // Stop the animation
    cancelAnimationFrame(animationFrame);
    
    // Clear the canvas
    if (canvasContext) {
      canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    // Disconnect audio (but don't close the context)
    if (audioContext) {
      disconnectAudio();
    }
  }
  
  // Connect the audio source to the analyser
  function connectAudioSource() {
    if (!audioSource || !audioContext || !analyser) return;
    
    try {
      // If we have an existing source, disconnect it
      if (source) {
        disconnectAudio();
      }
      
      // Connect the new source
      if (audioSource.constructor.name === 'HTMLAudioElement') {
        // If it's an audio element, create a media element source
        source = audioContext.createMediaElementSource(audioSource);
      } else if (audioSource instanceof MediaStream) {
        // If it's a media stream, create a media stream source
        source = audioContext.createMediaStreamSource(audioSource);
      } else if (typeof audioSource.connect === 'function') {
        // If it's already a node with a connect method, use it directly
        source = audioSource;
      } else {
        console.error('Unsupported audio source type');
        return;
      }
      
      // Connect the source to the analyser
      source.connect(analyser);
      connected = true;
    } catch (e) {
      console.error('Error connecting audio source:', e);
    }
  }
  
  // Disconnect the audio source
  function disconnectAudio() {
    if (source) {
      try {
        source.disconnect();
      } catch (e) {
        // Ignore
      }
    }
    connected = false;
  }
  
  // Draw the visualizer
  function draw() {
    if (!canvas || !canvasContext || !analyser) return;
    
    // Get the current audio data
    analyser.getByteTimeDomainData(dataArray);
    
    // Draw the visualization based on the selected style
    switch (visualizerStyle) {
      case 'waveform':
        drawWaveform();
        break;
      case 'frequency':
        drawFrequencyBars();
        break;
      case 'circular':
        drawCircularWaveform();
        break;
      default:
        drawWaveform();
    }
    
    // Schedule the next frame if active
    if (active) {
      animationFrame = requestAnimationFrame(draw);
    }
  }
  
  // Draw a waveform visualization
  function drawWaveform() {
    const width = canvas.width;
    const height = canvas.height;
    const bufferLength = analyser.frequencyBinCount;
    
    // Clear the canvas
    canvasContext.clearRect(0, 0, width, height);
    
    // Set up the line style
    canvasContext.lineWidth = 2;
    canvasContext.strokeStyle = '#00FF00';
    
    // Begin the path
    canvasContext.beginPath();
    
    // Calculate the x increment for each data point
    const sliceWidth = width / bufferLength;
    let x = 0;
    
    // Draw the waveform line
    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0; // Convert to a range of 0-2
      const y = v * height / 2;
      
      if (i === 0) {
        canvasContext.moveTo(x, y);
      } else {
        canvasContext.lineTo(x, y);
      }
      
      x += sliceWidth;
    }
    
    // Draw the path
    canvasContext.lineTo(width, height / 2);
    canvasContext.stroke();
    
    // Add a grid background for reference
    drawGrid();
  }
  
  // Draw a frequency bar visualization
  function drawFrequencyBars() {
    const width = canvas.width;
    const height = canvas.height;
    
    // Use frequency data instead of time domain
    analyser.getByteFrequencyData(dataArray);
    
    // Clear the canvas
    canvasContext.clearRect(0, 0, width, height);
    
    // Draw grid first
    drawGrid();
    
    // Calculate the number of bars to display (use a maximum of 64 for better visuals)
    const barCount = Math.min(64, dataArray.length);
    const barWidth = width / barCount;
    const barHeightMultiplier = height / 256;
    
    // Set up the bar style
    canvasContext.fillStyle = '#00FF00';
    
    // Draw the bars
    for (let i = 0; i < barCount; i++) {
      // Use every nth data point to fit the screen
      const index = Math.floor(i * (dataArray.length / barCount));
      const barHeight = dataArray[index] * barHeightMultiplier;
      
      // Draw the bar
      canvasContext.fillRect(i * barWidth, height - barHeight, barWidth - 1, barHeight);
    }
  }
  
  // Draw a circular waveform visualization
  function drawCircularWaveform() {
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3;
    
    // Clear the canvas
    canvasContext.clearRect(0, 0, width, height);
    
    // Draw a reference circle
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2);
    canvasContext.strokeStyle = 'rgba(0, 255, 0, 0.2)';
    canvasContext.lineWidth = 1;
    canvasContext.stroke();
    
    // Draw the waveform as a circle
    canvasContext.beginPath();
    
    for (let i = 0; i < dataArray.length; i += 3) { // Skip some points for performance
      const amplitude = dataArray[i] / 128.0 - 1; // Range -1 to 1
      const adjustedRadius = radius * (1 + amplitude * 0.5);
      
      const angle = (i / dataArray.length) * Math.PI * 2;
      const x = centerX + Math.cos(angle) * adjustedRadius;
      const y = centerY + Math.sin(angle) * adjustedRadius;
      
      if (i === 0) {
        canvasContext.moveTo(x, y);
      } else {
        canvasContext.lineTo(x, y);
      }
    }
    
    canvasContext.closePath();
    canvasContext.strokeStyle = '#00FF00';
    canvasContext.lineWidth = 2;
    canvasContext.stroke();
  }
  
  // Draw a grid background
  function drawGrid() {
    const width = canvas.width;
    const height = canvas.height;
    
    // Set up the grid style
    canvasContext.strokeStyle = 'rgba(0, 255, 0, 0.2)';
    canvasContext.lineWidth = 1;
    
    // Draw horizontal grid lines
    canvasContext.beginPath();
    for (let y = 0; y < height; y += height / 8) {
      canvasContext.moveTo(0, y);
      canvasContext.lineTo(width, y);
    }
    
    // Draw vertical grid lines
    for (let x = 0; x < width; x += width / 16) {
      canvasContext.moveTo(x, 0);
      canvasContext.lineTo(x, height);
    }
    
    canvasContext.stroke();
  }
  
  // Handle style change
  function handleStyleChange() {
    // Update visualization immediately
    if (active && canvasContext) {
      draw();
    }
  }
</script>

<div class="sound-visualizer-container">
  <div class="controls">
    <div class="style-selector">
      <label for="visualizer-style" class="text-codec-light-green font-mono text-xs">Style:</label>
      <select 
        id="visualizer-style" 
        bind:value={visualizerStyle} 
        on:change={handleStyleChange}
        class="bg-codec-dark-green text-codec-light-green border border-codec-green p-1 text-xs font-mono"
      >
        <option value="waveform">Waveform</option>
        <option value="frequency">Frequency</option>
        <option value="circular">Circular</option>
      </select>
    </div>
  </div>
  
  <div class="canvas-container">
    <canvas 
      bind:this={canvas} 
      class="visualizer-canvas"
      class:reducedMotion={reducedMotion}
    ></canvas>
    
    {#if !active}
      <div class="inactive-overlay">
        <p class="font-mono text-codec-green">Visualizer is inactive</p>
      </div>
    {/if}
  </div>
</div>

<style>
  .sound-visualizer-container {
    width: 100%;
    height: 150px;
    position: relative;
    border: 1px solid var(--codec-green, #00FF00);
    background-color: #001100;
    overflow: hidden;
  }
  
  .controls {
    position: absolute;
    top: 4px;
    right: 4px;
    z-index: 5;
    display: flex;
    gap: 8px;
  }
  
  .style-selector {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  
  .style-selector select {
    max-width: 100px;
    font-size: 0.75rem;
  }
  
  .canvas-container {
    width: 100%;
    height: 100%;
    position: relative;
  }
  
  .visualizer-canvas {
    width: 100%;
    height: 100%;
    display: block;
  }
  
  .visualizer-canvas.reducedMotion {
    opacity: 0.8;
  }
  
  .inactive-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.7);
  }
</style>