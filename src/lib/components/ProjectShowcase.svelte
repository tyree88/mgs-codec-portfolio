<script lang="ts">
  // Placeholder for project data - will be passed as props or fetched later
  export let project: { title: string; description: string; imageUrl?: string; link?: string } | null = null;

  // State to control visibility (e.g., for modal or expansion effect)
  export let isOpen = false; 

  function closeShowcase() {
    isOpen = false;
    // Optionally emit an event
    // dispatch('close'); 
  }
</script>

{#if isOpen && project}
  <!-- Basic Modal Structure - Styling and animation to be added -->
  <div 
    class="project-showcase-overlay fixed inset-0 bg-black bg-opacity-75 z-30 flex items-center justify-center p-4"
    on:click|self={closeShowcase}  
  >
    <div
      class="project-showcase-content bg-codec-dark border-2 border-codec-highlight p-6 max-w-2xl w-full relative text-codec-light font-mono"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-title"
    >
      <button 
        on:click={closeShowcase} 
        class="absolute top-2 right-2 text-codec-light hover:text-codec-highlight text-2xl"
        aria-label="Close project details"
      >
        &times; {/* Close button */}
      </button>
      
      <h2 id="project-title" class="text-2xl font-bold mb-4 text-codec-highlight">{project.title}</h2>
      
      {#if project.imageUrl}
        <img src={project.imageUrl} alt="{project.title} screenshot" class="mb-4 w-full max-h-60 object-contain border border-codec-mid"/>
      {/if}
      
      <p class="mb-4 whitespace-pre-wrap">{project.description}</p>
      
      {#if project.link}
        <a 
          href={project.link} 
          target="_blank" 
          rel="noopener noreferrer"
          class="inline-block px-3 py-1 border border-codec-light hover:bg-codec-mid active:bg-codec-highlight"
        >
          View Project
        </a>
      {/if}
    </div>
  </div>
{/if}

<style>
  /* Add specific styles if needed */
</style>