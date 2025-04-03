<script lang="ts">
  export let imageSrc: string;
  export let side: 'left' | 'right';
  export let altText: string = 'Character Portrait'; // Accessibility
</script>

<div class="character-portrait w-32 h-32 border-2 border-codec-light overflow-hidden bg-codec-mid">
  {#if imageSrc}
    <img
      src={imageSrc}
      alt={altText}
      class="object-cover w-full h-full"
      style="image-rendering: pixelated;"
    />
    {/* Preserve pixel art style if applicable */}
  {:else}
    <!-- Placeholder if no image is provided -->
    <div class="w-full h-full flex items-center justify-center text-codec-dark font-bold text-4xl">
      {side === 'left' ? 'L' : 'R'}
    </div>
  {/if}
</div>

<style>
  /* Add specific styles if needed */
</style>