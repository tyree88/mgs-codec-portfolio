<script>
  import { page } from '$app/stores';
</script>

<div class="hexagonal-bg min-h-screen flex items-center justify-center p-4">
  <div class="codec-container relative w-full max-w-md mx-auto bg-codec-dark border-2 border-codec-mid rounded-lg shadow-2xl overflow-hidden scanline crt-effect p-6">
    <h1 class="text-codec-highlight text-2xl font-mono mb-4 animate-flicker">CODEC ERROR</h1>
    
    <div class="bg-codec-dark border border-codec-mid rounded-md p-4 mb-4 static-effect">
      <p class="text-codec-light font-mono leading-relaxed">
        {$page.status}: {$page.error?.message || 'Frequency not found'}
      </p>
    </div>
    
    <a href="/" class="inline-block px-4 py-2 bg-codec-mid hover:bg-codec-highlight text-black font-mono rounded transition-colors duration-200 uppercase tracking-wider">
      Return to Base
    </a>
  </div>
</div>