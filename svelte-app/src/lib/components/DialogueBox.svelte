<script>
  import { onMount, afterUpdate } from 'svelte';
  import { typewriter } from '../useTypewriter.js';
  
  // Props
  export let text = '';
  export let reducedMotion = false;
  
  // State for typewriter effect
  let displayedText = '';
  let dialogueElement;
  let previousText = '';
  
  // Use the typewriter effect when text changes
  $: if (text !== previousText) {
    if (dialogueElement) {
      startTypewriter();
    }
    previousText = text;
  }
  
  function startTypewriter() {
    // If reduced motion is on, just display the full text immediately
    if (reducedMotion) {
      displayedText = text;
      return;
    }
    
    // Start with empty display text
    displayedText = '';
    
    // Use typewriter action directly with our text
    const speed = 30; // milliseconds per character
    let currentIndex = 0;
    
    function type() {
      if (currentIndex < text.length) {
        displayedText += text[currentIndex++];
        setTimeout(type, speed);
      }
    }
    
    type();
  }
  
  onMount(() => {
    startTypewriter();
  });
</script>

<div 
  class="dialogue-box bg-black border-2 border-codec-green p-4 rounded-md"
>
  <div class="dialogue-header text-xs text-codec-light-green font-mono mb-2">
    MESSAGE
  </div>
  
  <div 
    bind:this={dialogueElement}
    class="dialogue-content text-codec-green font-mono min-h-[150px] whitespace-pre-wrap"
  >
    {displayedText}
  </div>
</div>

<style>
  .dialogue-box {
    width: 100%;
  }
  
  .dialogue-content {
    line-height: 1.5;
    position: relative;
  }
  
  /* For high contrast accessibility */
  :global(.high-contrast) .dialogue-box {
    color: white !important;
    border-color: white !important;
  }
  
  :global(.high-contrast) .dialogue-content {
    color: white !important;
  }
</style>