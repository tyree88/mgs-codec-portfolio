<script lang="ts">
  import { gsap } from 'gsap';
  import { onMount, onDestroy } from 'svelte'; // Import onDestroy
  import { blinkEffect } from '$lib/animations/ambient.js';
  import { reducedMotion } from '$lib/stores/settings.js'; // Import reducedMotion store

  export let frequency: string = '140.85'; // Default frequency
  export let pttActive: boolean = true; // Push To Talk indicator status

  let displayFrequency = frequency; // The frequency shown in the template
  let frequencyElement: HTMLDivElement;
  let currentTween: gsap.core.Tween | null = null;
  let pttElement: HTMLDivElement; // Reference for PTT element
  let blinkTimeline: gsap.core.Timeline | null = null; // Store blink animation timeline

  // Reactive statement to animate frequency change
  $: if (frequency && frequencyElement) {
    const targetFrequencyNum = parseFloat(frequency);
    const currentDisplayNum = parseFloat(displayFrequency);

    // Only animate if the numeric value actually changes
    if (targetFrequencyNum !== currentDisplayNum && !$reducedMotion) { // Check reducedMotion store
      // Kill previous tween if it exists
      if (currentTween) {
        currentTween.kill();
      }

      // Use a temporary object for GSAP to tween
      let animatedValue = { value: currentDisplayNum };

      currentTween = gsap.to(animatedValue, {
        value: targetFrequencyNum,
        duration: 0.3, // Duration of the rolling effect
        ease: 'power1.inOut',
        onUpdate: () => {
          // Update the displayed text during the animation, simulating rolling numbers
          // Randomize slightly for a more chaotic effect
          const randomOffset = (Math.random() - 0.5) * 2; // Small random offset
          const displayNum = Math.max(100, Math.min(200, animatedValue.value + randomOffset)); // Clamp within a reasonable range
          displayFrequency = displayNum.toFixed(2);
        },
        onComplete: () => {
          // Ensure the final value is exact
          displayFrequency = targetFrequencyNum.toFixed(2);
          currentTween = null;
        }
      });
    } else { // If reduced motion is true OR the number hasn't changed
       if (displayFrequency !== frequency) {
           displayFrequency = frequency; // Update immediately
       }
       // Ensure any previous tween is killed
       if (currentTween) {
           currentTween.kill();
           currentTween = null;
       }
    // This block was duplicated and is removed.
    // The logic is handled correctly by the `else` block starting on line 48.
  }

  // Set initial display frequency on mount
  onMount(() => {
    displayFrequency = frequency;
    // Start the blink effect on the PTT indicator
    // Start the blink effect on the PTT indicator only if motion is not reduced
    if (pttElement && !$reducedMotion) {
      blinkTimeline = blinkEffect(pttElement, 1, 0.5, 0.3, $reducedMotion); // Pass reducedMotion value
    } else if (pttElement) {
      // Ensure PTT is fully visible if motion is reduced
      gsap.set(pttElement, { opacity: 1 });
    }
  });

  onDestroy(() => {
    // Clean up animations on component destroy
    if (currentTween) {
      currentTween.kill();
    }
    if (blinkTimeline) {
      blinkTimeline.kill();
    }
  });

</script>

<div class="frequency-display text-center">
  <!-- PTT Indicator -->
  <div bind:this={pttElement} class="ptt-indicator text-sm mb-1 {pttActive ? 'text-codec-highlight' : 'text-codec-mid'}">
    PTT
  </div>

  <!-- Frequency Number -->
  <div bind:this={frequencyElement} class="frequency-number text-4xl font-bold border-2 border-codec-light px-4 py-1 inline-block tracking-widest min-w-[150px] text-center">
    {displayFrequency}
  </div>

  <!-- Signal Strength Bars (Placeholder) -->
  <div class="signal-bars absolute left-[-2rem] top-1/2 transform -translate-y-1/2 flex flex-col space-y-1">
    {#each { length: 5 } as _, i}
      <div class="w-2 h-1 {i < 4 ? 'bg-codec-light' : 'bg-codec-mid'}"></div>
    {/each}
  </div>
</div>

<style>
  .frequency-display {
    position: relative; /* Needed for absolute positioning of signal bars */
  }
  /* Add specific styles if needed */
</style>