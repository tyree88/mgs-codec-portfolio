<script lang="ts">
  import { onMount, onDestroy } from 'svelte'; // Import onDestroy
  import { gsap } from 'gsap';
  import { reducedMotion } from '$lib/stores/settings.js'; // Import reducedMotion store

  export let intensity: number = 0.3;
  export let flickerIntensity: number = 0.05;
  export let movingScanlineOpacity: number = 0.1;
  export let vignetteIntensity: number = 0.4;

  let crtEffectsElement: HTMLDivElement;
  let movingScanlineTween: gsap.core.Tween | null = null;
  let flickerTimeline: gsap.core.Timeline | null = null;

  onMount(() => {
    if (!crtEffectsElement) return;

    // Only start animations if reduced motion is not preferred
    if (!$reducedMotion) {
      // Animate moving scanline
      movingScanlineTween = gsap.to(crtEffectsElement.querySelector('.moving-scanline'), {
        y: '100%',
        duration: 2,
        repeat: -1,
        ease: 'none',
      });

      // Add random flicker
      flickerTimeline = gsap.timeline({ repeat: -1, repeatDelay: Math.random() * 2 + 1 });
      flickerTimeline.to(crtEffectsElement.querySelector('.crt-flicker'), {
        opacity: () => 0.1 + Math.random() * flickerIntensity, // Adjust base opacity and randomness
        duration: 0.05 + Math.random() * 0.1, // Random duration
        repeat: Math.floor(Math.random() * 3) + 1, // Random repeats
        yoyo: true,
        ease: 'power1.inOut',
      });
    } else {
       // Ensure elements are static if reduced motion is preferred
       gsap.set(crtEffectsElement.querySelector('.moving-scanline'), { y: '0%' }); // Reset position
       gsap.set(crtEffectsElement.querySelector('.crt-flicker'), { opacity: 0.1 }); // Set base opacity
    }

    return () => {
      if (flickerTimeline) flickerTimeline.kill();
      if (movingScanlineTween) movingScanlineTween.kill();
    };
  });
</script>

<div bind:this={crtEffectsElement} class="crt-effects pointer-events-none absolute inset-0 z-10 overflow-hidden">
  <!-- Static scanlines -->
  <div class="scanlines absolute inset-0" style="opacity: {intensity};">
    {#each { length: 100 } as _, i}
      <!-- Use percentage for positioning -->
      <div class="scanline absolute w-full h-px bg-black" style="top: {i}%;"></div>
    {/each}
  </div>

  <!-- Moving scanline -->
  <div class="moving-scanline absolute top-0 left-0 w-full h-[3px]" style="background-color: rgba(139, 172, 15, {movingScanlineOpacity});"></div>

  <!-- CRT flicker overlay -->
  <div class="crt-flicker absolute inset-0" style="background-color: rgba(139, 172, 15, {flickerIntensity}); opacity: 0.1;"></div>

  <!-- Vignette -->
  <div class="vignette absolute inset-0" style="background: radial-gradient(circle, transparent 60%, rgba(0, 0, 0, {vignetteIntensity}) 100%);"></div>
</div>

<style>
  /* Ensure scanlines are sharp */
  .scanline {
    transform: scaleY(0.5); /* Make lines thinner */
  }
</style>