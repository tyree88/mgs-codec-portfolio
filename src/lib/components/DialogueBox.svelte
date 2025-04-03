<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { typeWriter, skipTypewriter } from '$lib/animations/typewriter';
  import { reducedMotion } from '$lib/stores/settings.js'; // Import the store

  export let text: string = ''; // Text content to display
  let dialogueElement: HTMLParagraphElement;

  // Reactive statement to trigger the typewriter effect when the text prop changes
  $: if (dialogueElement && text) {
    // Use tick to ensure the element is mounted before starting animation
    tick().then(() => {
       typeWriter(dialogueElement, text, 0.05, $reducedMotion); // Pass store value
    });
  }

  // Optional: Add a way to skip the animation, e.g., on click
  function handleSkip() {
    skipTypewriter();
  }

  // Ensure cleanup if needed, though typewriter.js handles its own timeline cleanup
  // onDestroy(() => { ... });

</script>

<div class="dialogue-box p-2 h-full overflow-y-auto" on:click={handleSkip} title="Click to skip animation">
  <p bind:this={dialogueElement} class="dialogue-text whitespace-pre-wrap break-words">
    {/* Text will be populated by the typewriter function */}
  </p>
</div>

<style>
  /* Add specific styles if needed, e.g., for scrollbar */
  .dialogue-box::-webkit-scrollbar {
    width: 4px;
  }
  .dialogue-box::-webkit-scrollbar-track {
    background: transparent;
  }
  .dialogue-box::-webkit-scrollbar-thumb {
    background-color: theme('colors.codec-mid');
    border-radius: 2px;
  }
</style>