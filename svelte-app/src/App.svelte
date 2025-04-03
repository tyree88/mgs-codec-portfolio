<script>
  import { onMount } from 'svelte';
  import CodecInterface from './lib/components/CodecInterface.svelte';
  import IncomingCall from './lib/components/IncomingCall.svelte';
  
  // State
  let showIncomingCall = true;
  let showCodecInterface = false;
  let accessibilitySettings = {
    reducedMotion: false,
    highContrast: false,
    disableScanlines: false
  };
  
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
  });
  
  // Handle call accepted
  function handleCallAccepted() {
    showIncomingCall = false;
    showCodecInterface = true;
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
</script>

<main>
  {#if showIncomingCall}
    <IncomingCall 
      active={showIncomingCall} 
      reducedMotion={accessibilitySettings.reducedMotion}
      on:callAccepted={handleCallAccepted} 
    />
  {/if}
  
  {#if showCodecInterface}
    <CodecInterface 
      reducedMotion={accessibilitySettings.reducedMotion}
      highContrast={accessibilitySettings.highContrast}
      disableScanlines={accessibilitySettings.disableScanlines}
      on:accessibilityChange={updateAccessibility}
    />
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
</style>