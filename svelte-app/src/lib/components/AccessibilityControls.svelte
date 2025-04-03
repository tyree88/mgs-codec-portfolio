<script>
  // Props
  export let reducedMotion = false;
  export let highContrast = false;
  export let disableScanlines = false;
  export let onToggleReducedMotion;
  export let onToggleHighContrast;
  export let onToggleScanlines;
</script>

<div class="accessibility-controls bg-black border border-codec-green rounded-md p-3 text-codec-green">
  <h3 class="font-mono text-sm mb-2">ACCESSIBILITY</h3>
  
  <div class="controls-grid grid gap-2">
    <label class="flex items-center space-x-2 cursor-pointer">
      <input 
        type="checkbox" 
        checked={reducedMotion}
        on:change={() => onToggleReducedMotion()}
        class="accent-codec-green"
      />
      <span class="text-xs">Reduced Motion</span>
    </label>
    
    <label class="flex items-center space-x-2 cursor-pointer">
      <input 
        type="checkbox"
        checked={highContrast}
        on:change={() => onToggleHighContrast()}
        class="accent-codec-green"
      />
      <span class="text-xs">High Contrast</span>
    </label>
    
    <label class="flex items-center space-x-2 cursor-pointer">
      <input 
        type="checkbox"
        checked={disableScanlines}
        on:change={() => onToggleScanlines()}
        class="accent-codec-green"
      />
      <span class="text-xs">Disable Scanlines</span>
    </label>
  </div>
</div>

<style>
  .accessibility-controls {
    max-width: 250px;
  }
  
  /* For high contrast accessibility */
  :global(.high-contrast) .accessibility-controls {
    color: white !important;
    border-color: white !important;
  }
</style>