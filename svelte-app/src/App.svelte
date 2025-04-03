<script>
  import { onMount } from 'svelte';
  import CodecInterface from './lib/components/CodecInterface.svelte';
  import IncomingCall from './lib/components/IncomingCall.svelte';
  import { frequencies } from './lib/frequencies.js';
  
  // State
  let showIncomingCall = true;
  let showCodecInterface = false;
  let accessibilitySettings = {
    reducedMotion: false,
    highContrast: false,
    disableScanlines: false
  };
  
  // Codec call settings
  let callerName = "SNAKE";
  let incomingFrequency = frequencies[0].value; // Using the first frequency
  
  // Check for user preferences
  onMount(() => {
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      accessibilitySettings.reducedMotion = true;
    }
    
    // Apply scanline settings based on accessibility preferences
    if (accessibilitySettings.disableScanlines) {
      document.body.classList.add('no-scanlines');
    }
    
    // Apply high contrast if needed
    if (accessibilitySettings.highContrast) {
      document.body.classList.add('high-contrast');
    }
    
    // Ensure the incoming call animation plays on load
    document.body.style.overflow = 'hidden'; // Prevent scrolling during intro
  });
  
  // Handle call accepted
  function handleCallAccepted() {
    showIncomingCall = false;
    showCodecInterface = true;
    
    // Re-enable scrolling after call is accepted
    setTimeout(() => {
      document.body.style.overflow = '';
    }, 500);
  }
  
  // Handle accessibility changes
  function updateAccessibility(event) {
    const { setting, value } = event.detail;
    
    if (setting === 'reducedMotion') {
      accessibilitySettings.reducedMotion = value;
    }
    else if (setting === 'highContrast') {
      accessibilitySettings.highContrast = value;
      
      if (value) {
        document.body.classList.add('high-contrast');
      } else {
        document.body.classList.remove('high-contrast');
      }
    }
    else if (setting === 'disableScanlines') {
      accessibilitySettings.disableScanlines = value;
      
      if (value) {
        document.body.classList.add('no-scanlines');
      } else {
        document.body.classList.remove('no-scanlines');
      }
    }
  }
  
  // Skip intro for accessibility (keyboard shortcut)
  function handleKeydown(e) {
    // Skip intro with Escape key
    if (e.key === 'Escape' && showIncomingCall) {
      handleCallAccepted();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown}/>

<main>
  {#if showIncomingCall}
    <IncomingCall 
      active={showIncomingCall} 
      reducedMotion={accessibilitySettings.reducedMotion}
      caller={callerName}
      frequency={incomingFrequency}
      on:callAccepted={handleCallAccepted} 
    />
  {/if}
  
  {#if showCodecInterface}
    <CodecInterface 
      currentFrequency={incomingFrequency}
      reducedMotion={accessibilitySettings.reducedMotion}
      highContrast={accessibilitySettings.highContrast}
      disableScanlines={accessibilitySettings.disableScanlines}
      on:accessibilityChange={updateAccessibility}
    />
  {/if}
  
  <!-- Skip intro button for accessibility -->
  {#if showIncomingCall}
    <button 
      class="skip-intro-button"
      on:click={handleCallAccepted}
      aria-label="Skip intro animation"
    >
      SKIP INTRO
    </button>
  {/if}
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    background-color: black;
    font-family: 'Courier New', monospace;
  }
  
  :global(:root) {
    --codec-green: #00FF00;
    --codec-light-green: #AAFFAA;
    --codec-dark-green: #003300;
    --text-color: var(--codec-green);
    --highlight-color: var(--codec-light-green);
    --border-color: var(--codec-green);
  }
  
  /* Add scanline effect */
  :global(body::before) {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    background: repeating-linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.15),
      rgba(0, 0, 0, 0.15) 1px,
      transparent 1px,
      transparent 2px
    );
    pointer-events: none;
  }
  
  /* Disable scanlines when needed */
  :global(body.no-scanlines::before) {
    display: none;
  }
  
  main {
    width: 100%;
    min-height: 100vh;
    position: relative;
  }
  
  .skip-intro-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: var(--codec-dark-green);
    color: var(--codec-light-green);
    border: 1px solid var(--codec-green);
    padding: 5px 10px;
    font-family: 'Courier New', monospace;
    font-size: 12px;
    z-index: 100;
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.3s;
  }
  
  .skip-intro-button:hover {
    opacity: 1;
    background-color: var(--codec-green);
    color: black;
  }
  
  /* For high contrast accessibility */
  :global(.high-contrast) .skip-intro-button {
    color: white !important;
    border-color: white !important;
    background-color: black !important;
  }
</style>