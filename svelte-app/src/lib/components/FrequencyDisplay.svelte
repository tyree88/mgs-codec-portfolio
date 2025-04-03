<script>
  import { onMount, afterUpdate } from 'svelte';
  import { gsap } from 'gsap';
  import { frequencies } from '../frequencies.js';
  
  // Props
  export let currentFrequency = '140.85';
  export let onFrequencyChange;
  export let reducedMotion = false;
  
  // Element references
  let frequencyElement;
  let freqInput;
  
  // State
  let isEditing = false;
  let tempFreq = currentFrequency;
  
  // Handle frequency change with animation
  $: if (frequencyElement && currentFrequency) {
    updateFrequencyDisplay(currentFrequency);
  }
  
  function updateFrequencyDisplay(newFreq) {
    if (reducedMotion) {
      frequencyElement.textContent = newFreq;
      return;
    }
    
    // Animate the frequency transition
    const currentText = frequencyElement.textContent || "";
    const currentFreq = parseFloat(currentText);
    const targetFreq = parseFloat(newFreq);
    
    if (isNaN(currentFreq) || isNaN(targetFreq)) {
      // If parsing fails, just set the text directly
      frequencyElement.textContent = newFreq;
      return;
    }
    
    // Calculate number of steps for the animation
    const duration = 0.3;
    const steps = Math.max(3, Math.floor(duration * 10));
    const stepDuration = duration / steps;
    
    // Create a GSAP timeline
    const tl = gsap.timeline();
    
    // Create a series of steps to "tune" between frequencies
    for (let i = 1; i <= steps; i++) {
      const progress = i / steps;
      const interpolatedValue = currentFreq + (targetFreq - currentFreq) * progress;
      
      // Format to maintain decimal places
      const formattedValue = interpolatedValue.toFixed(2);
      
      tl.to(frequencyElement, {
        innerText: formattedValue,
        duration: stepDuration,
        ease: "none",
        roundProps: "innerText"
      });
    }
    
    // Ensure final value is exact
    tl.set(frequencyElement, { innerText: newFreq });
  }
  
  function handleFrequencySubmit() {
    // Check if the input frequency is valid
    if (tempFreq && tempFreq.match(/^\d{3}\.\d{2}$/)) {
      onFrequencyChange(tempFreq);
    } else {
      // Reset to current frequency if invalid
      tempFreq = currentFrequency;
    }
    
    isEditing = false;
  }
  
  // Select from memory options (preset frequencies)
  function selectFrequency(freq) {
    onFrequencyChange(freq);
  }
  
  // Handle edit mode
  function startEditing() {
    isEditing = true;
    tempFreq = currentFrequency;
    // Focus the input in the next tick
    setTimeout(() => {
      if (freqInput) freqInput.focus();
    }, 0);
  }
  
  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      handleFrequencySubmit();
    } else if (e.key === 'Escape') {
      isEditing = false;
      tempFreq = currentFrequency;
    }
  }
</script>

<div class="frequency-display bg-black border-2 border-codec-green p-4 rounded-md mb-4">
  <div class="flex justify-between items-center mb-2">
    <div class="text-xs text-codec-light-green font-mono">FREQUENCY</div>
    <div>
      <button 
        class="tune-btn text-xs bg-codec-dark-green text-codec-light-green px-2 py-1 border border-codec-green rounded hover:bg-codec-green hover:text-black"
        on:click={startEditing}
      >
        TUNE
      </button>
    </div>
  </div>
  
  <div class="flex items-center justify-center my-2">
    {#if isEditing}
      <input
        bind:this={freqInput}
        bind:value={tempFreq}
        class="bg-black text-codec-green border border-codec-green font-mono text-2xl w-24 text-center py-1"
        pattern="\d{3}\.\d{2}"
        on:blur={handleFrequencySubmit}
        on:keydown={handleKeyDown}
      />
    {:else}
      <div 
        bind:this={frequencyElement}
        class="frequency-value text-2xl font-mono text-codec-green"
        on:click={startEditing}
      >
        {currentFrequency}
      </div>
    {/if}
    <div class="text-codec-green font-mono text-2xl ml-2">MHz</div>
  </div>
  
  <div class="memory-section mt-4">
    <div class="text-xs text-codec-light-green font-mono mb-2">MEMORY</div>
    <div class="grid grid-cols-2 gap-2">
      {#each frequencies as freq}
        <button
          class="memory-btn text-xs border border-codec-green text-codec-green px-2 py-1 rounded hover:bg-codec-dark-green"
          class:active={currentFrequency === freq.value}
          on:click={() => selectFrequency(freq.value)}
        >
          {freq.name}
        </button>
      {/each}
    </div>
  </div>
</div>

<style>
  .frequency-display {
    min-width: 250px;
  }
  
  .frequency-value {
    cursor: pointer;
    min-width: 80px;
    text-align: center;
  }
  
  .memory-btn.active {
    background-color: var(--border-color, #003300);
  }
  
  /* For high contrast accessibility */
  :global(.high-contrast) .frequency-value,
  :global(.high-contrast) .memory-btn,
  :global(.high-contrast) .tune-btn {
    color: white !important;
    border-color: white !important;
  }
  
  :global(.high-contrast) .memory-btn.active {
    background-color: rgba(255, 255, 255, 0.3) !important;
  }
</style>