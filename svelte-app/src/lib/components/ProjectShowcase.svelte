<script>
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import { projects } from '../projects.js';
  
  // Props
  export let onClose;
  
  // Element references
  let showcaseElement;
  
  // Animation for the showcase opening
  onMount(() => {
    if (showcaseElement) {
      gsap.from(showcaseElement, {
        y: 20,
        opacity: 0,
        duration: 0.4,
        ease: "power2.out"
      });
    }
  });
</script>

<div 
  bind:this={showcaseElement}
  class="project-showcase bg-black bg-opacity-95 border-2 border-codec-green rounded-md p-4 max-h-96 overflow-auto"
>
  <div class="flex justify-between items-center mb-4">
    <h2 class="text-codec-green font-mono text-lg">// PROJECT FILES</h2>
    <button 
      class="close-btn text-xs bg-codec-dark-green text-codec-light-green px-2 py-1 border border-codec-green rounded hover:bg-codec-green hover:text-black"
      on:click={onClose}
    >
      CLOSE
    </button>
  </div>
  
  <div class="projects-grid grid gap-4">
    {#each projects as project}
      <div class="project-card border border-codec-green p-3 rounded-md hover:bg-codec-dark-green transition-colors">
        <h3 class="text-codec-light-green font-mono text-md mb-2">{project.title}</h3>
        <p class="text-codec-green text-sm mb-3">{project.description}</p>
        
        <div class="tech-tags flex flex-wrap gap-2 mb-3">
          {#each project.technologies as tech}
            <span class="tech-tag text-xs border border-codec-green text-codec-green px-2 py-1 rounded">
              {tech}
            </span>
          {/each}
        </div>
        
        <a 
          href={project.url} 
          class="view-project-btn inline-block text-xs bg-codec-dark-green text-codec-light-green px-2 py-1 border border-codec-green rounded hover:bg-codec-green hover:text-black"
          target="_blank" 
          rel="noopener noreferrer"
        >
          VIEW PROJECT
        </a>
      </div>
    {/each}
  </div>
</div>

<style>
  .project-showcase {
    width: 100%;
    z-index: 100;
  }
  
  .projects-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
  
  .project-card {
    transition: background-color 0.2s ease;
  }
  
  .tech-tag {
    white-space: nowrap;
  }
  
  /* For high contrast accessibility */
  :global(.high-contrast) .project-card,
  :global(.high-contrast) .tech-tag,
  :global(.high-contrast) .view-project-btn,
  :global(.high-contrast) .close-btn {
    color: white !important;
    border-color: white !important;
  }
</style>