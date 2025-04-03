<script>
  import { onMount } from 'svelte';
  
  // Element reference
  let staticElement;
  
  // Create a random static/interference effect
  onMount(() => {
    if (!staticElement) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = 200;
    canvas.height = 100;
    
    function drawStatic() {
      if (!ctx) return;
      
      // Fill with transparent black
      ctx.fillStyle = 'rgba(0, 0, 0, 0.01)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw random static pixels
      for (let i = 0; i < 500; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const gray = Math.floor(Math.random() * 255);
        
        ctx.fillStyle = `rgba(${gray}, ${gray}, ${gray}, 0.5)`;
        ctx.fillRect(x, y, 1, 1);
      }
      
      // Convert canvas to image data URL
      staticElement.style.backgroundImage = `url(${canvas.toDataURL()})`;
    }
    
    // Run the static effect
    drawStatic();
    setInterval(drawStatic, 100);
  });
</script>

<div bind:this={staticElement} class="static-effect absolute inset-0 opacity-10 pointer-events-none"></div>

<style>
  .static-effect {
    background-size: cover;
    mix-blend-mode: overlay;
    z-index: 2;
  }
</style>