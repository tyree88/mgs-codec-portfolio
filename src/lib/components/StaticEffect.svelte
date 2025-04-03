<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { gsap } from 'gsap';
  import { reducedMotion } from '$lib/stores/settings.js'; // Import reducedMotion store

  export let isActive = false; // Controls visibility and animation

  let staticElement: HTMLDivElement;
  let animation: gsap.core.Timeline | null = null;

  // Function to generate random noise pattern (simple example)
  function generateNoiseBackground() {
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    const imageData = ctx.createImageData(100, 100);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const randomColor = Math.random() > 0.5 ? 255 : 0; // Black or white noise
      data[i] = randomColor;     // R
      data[i + 1] = randomColor; // G
      data[i + 2] = randomColor; // B
      data[i + 3] = Math.floor(Math.random() * 50 + 20); // Alpha (semi-transparent)
    }
    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL();
  }

  $: if (staticElement) {
    if (isActive) {
      if (!$reducedMotion) {
        // Start animation when active and motion is allowed
        if (animation) animation.kill(); // Kill previous animation
        staticElement.style.backgroundImage = `url(${generateNoiseBackground()})`; // Update noise pattern
        animation = gsap.timeline({ repeat: -1, yoyo: true });
        animation.to(staticElement, {
          opacity: Math.random() * 0.4 + 0.2, // Random opacity between 0.2 and 0.6
          duration: 0.05,
          ease: 'steps(1)',
          onRepeat: () => {
            // Change background slightly on repeat for flicker effect
            staticElement.style.backgroundImage = `url(${generateNoiseBackground()})`;
            animation?.timeScale(Math.random() * 1.5 + 0.5); // Randomize speed slightly
          }
        });
        gsap.to(staticElement, { opacity: 1, duration: 0.1 }); // Fade in quickly
      } else {
         // Reduced motion: Simple fade in, no flicker
         if (animation) animation.kill();
         gsap.to(staticElement, { opacity: 0.6, duration: 0.1 }); // Fade in to a fixed opacity
      }
    } else {
      // Stop animation and fade out when inactive
      // Stop animation and fade out when inactive (works for both modes)
      if (animation) {
        animation.kill();
        animation = null;
      }
      gsap.to(staticElement, { opacity: 0, duration: 0.2 });
    }
  }

  onDestroy(() => {
    if (animation) {
      animation.kill();
    }
  });

</script>

<div
  bind:this={staticElement}
  class="static-effect absolute inset-0 z-20 pointer-events-none opacity-0 bg-repeat"
  style="background-color: rgba(0,0,0,0.1);"
>
  {/* Slight dark overlay */}
  {/* Content can be added here if needed, e.g., specific static patterns */}
</div>

<style>
  .static-effect {
    /* Ensure it covers the whole screen */
    width: 100%;
    height: 100%;
  }
</style>