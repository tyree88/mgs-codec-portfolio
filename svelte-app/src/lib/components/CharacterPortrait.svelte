<script>
  import { onMount, afterUpdate } from 'svelte';
  import { gsap } from 'gsap';
  
  // Props
  export let character;
  export let side = "left";
  export let reducedMotion = false;
  
  // Element reference
  let portraitElement;
  let previousCharacter = null;
  
  // Handle character changes with animation
  $: if (portraitElement && character && previousCharacter !== character.id) {
    if (previousCharacter) {
      animateCharacterTransition();
    }
    previousCharacter = character.id;
  }
  
  onMount(() => {
    if (portraitElement) {
      // Initial animation
      gsap.from(portraitElement, {
        opacity: 0,
        y: 10,
        duration: 0.5,
        ease: "power2.out"
      });
    }
  });
  
  function animateCharacterTransition() {
    if (reducedMotion) return;
    
    // Create static effect before character change
    const tl = gsap.timeline();
    
    // Simulate static distortion
    tl.to(portraitElement, {
      opacity: 0.5,
      filter: "blur(5px) hue-rotate(90deg)",
      duration: 0.2,
      ease: "power1.in"
    });
    
    // Clear distortion and show new character
    tl.to(portraitElement, {
      opacity: 1,
      filter: "blur(0px) hue-rotate(0deg)",
      duration: 0.3,
      ease: "power2.out"
    });
  }
</script>

<div 
  class="character-portrait-container {side === 'left' ? 'portrait-left' : 'portrait-right'}"
>
  <div 
    bind:this={portraitElement}
    class="character-portrait bg-black border-2 border-codec-green p-4 rounded-md"
  >
    <div class="portrait-header text-xs text-codec-light-green font-mono mb-2">
      {character.title.toUpperCase()}
    </div>
    
    <div class="portrait-image w-32 h-32 overflow-hidden flex items-center justify-center">
      <!-- Character SVG path comes from character object -->
      <div class="svgContainer">
        <!-- svgPath can be inserted here with @html which allows rendering SVG strings -->
        {@html character.svgPath}
      </div>
    </div>
    
    <div class="portrait-name mt-2 text-codec-green font-mono text-sm">
      {character.id.toUpperCase()}
    </div>
  </div>
</div>

<style>
  .character-portrait-container {
    display: flex;
  }
  
  .portrait-left {
    justify-content: flex-start;
  }
  
  .portrait-right {
    justify-content: flex-end;
  }
  
  .character-portrait {
    width: 160px;
    position: relative;
  }
  
  .portrait-image {
    background-color: rgba(0, 100, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .svgContainer {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .svgContainer :global(svg) {
    width: 100%;
    height: 100%;
    fill: var(--svg-fill, #00FF00);
  }
  
  /* For high contrast accessibility */
  :global(.high-contrast) .character-portrait {
    color: white !important;
    border-color: white !important;
  }
  
  :global(.high-contrast) .svgContainer :global(svg) {
    fill: white;
  }
</style>