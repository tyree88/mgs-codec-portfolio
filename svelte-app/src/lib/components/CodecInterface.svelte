<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import CharacterPortrait from './CharacterPortrait.svelte';
  import DialogueBox from './DialogueBox.svelte';
  import FrequencyDisplay from './FrequencyDisplay.svelte';
  import ProjectShowcase from './ProjectShowcase.svelte';
  import AccessibilityControls from './AccessibilityControls.svelte';
  import StaticEffect from './StaticEffect.svelte';
  
  import { characters } from '../characters.js';
  import { frequencies } from '../frequencies.js';
  import { dialogues } from '../dialogues.js';
  
  const dispatch = createEventDispatcher();
  
  // Props
  export let currentFrequency = frequencies[0].value;
  export let reducedMotion = false;
  export let highContrast = false;
  export let disableScanlines = false;
  
  // State
  let showProjects = false;
  let leftCharacter = characters.find(c => c.id === 'developer');
  let rightCharacter = characters.find(c => c.id === 'contact');
  let currentDialogue = dialogues.find(d => d.frequency === currentFrequency)?.text || '';
  
  // Update dialogue and characters based on frequency
  $: {
    currentDialogue = dialogues.find(d => d.frequency === currentFrequency)?.text || '';
    
    // Update the characters displayed based on frequency
    if (currentFrequency === frequencies[0].value) { // HOME
      leftCharacter = characters.find(c => c.id === 'developer');
      rightCharacter = characters.find(c => c.id === 'mentor');
    } else if (currentFrequency === frequencies[1].value) { // ABOUT
      leftCharacter = characters.find(c => c.id === 'developer');
      rightCharacter = characters.find(c => c.id === 'client');
    } else if (currentFrequency === frequencies[2].value) { // PROJECTS
      leftCharacter = characters.find(c => c.id === 'developer');
      rightCharacter = characters.find(c => c.id === 'client');
    } else if (currentFrequency === frequencies[3].value) { // CONTACT
      leftCharacter = characters.find(c => c.id === 'developer');
      rightCharacter = characters.find(c => c.id === 'contact');
    }
  }
  
  // Handle frequency change
  function handleFrequencyChange(frequency) {
    currentFrequency = frequency;
  }
  
  // Toggle project showcase
  function toggleProjects() {
    showProjects = !showProjects;
  }
  
  // Accessibility handlers
  function toggleReducedMotion() {
    reducedMotion = !reducedMotion;
    dispatch('accessibilityChange', { 
      setting: 'reducedMotion', 
      value: reducedMotion 
    });
  }
  
  function toggleHighContrast() {
    highContrast = !highContrast;
    dispatch('accessibilityChange', { 
      setting: 'highContrast', 
      value: highContrast 
    });
  }
  
  function toggleScanlines() {
    disableScanlines = !disableScanlines;
    dispatch('accessibilityChange', { 
      setting: 'disableScanlines', 
      value: disableScanlines 
    });
  }
  
  // Handle keyboard shortcuts
  onMount(() => {
    const handleKeyDown = (e) => {
      // Shortcut for showing/hiding projects (P key)
      if (e.key === 'p' || e.key === 'P') {
        toggleProjects();
      }
      
      // Shortcuts for frequencies (1-4 keys)
      if (e.key >= '1' && e.key <= '4') {
        const index = parseInt(e.key) - 1;
        if (index >= 0 && index < frequencies.length) {
          handleFrequencyChange(frequencies[index].value);
        }
      }
    };
    
    // Add keyboard listener
    window.addEventListener('keydown', handleKeyDown);
    
    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });
</script>

<div class="codec-interface {highContrast ? 'high-contrast' : ''} {disableScanlines ? 'no-scanlines' : ''}">
  <div class="codec-container flex flex-col min-h-screen p-4">
    <div class="codec-header border-b-2 border-codec-green mb-6 pb-1">
      <h1 class="text-codec-green font-mono text-xl">CODEC</h1>
    </div>
    
    <div class="codec-main flex-grow flex flex-col md:flex-row gap-6">
      <div class="codec-left w-full md:w-3/4 flex flex-col">
        <div class="portraits-section flex flex-col md:flex-row justify-between gap-4 mb-6">
          <CharacterPortrait character={leftCharacter} side="left" reducedMotion={reducedMotion} />
          <CharacterPortrait character={rightCharacter} side="right" reducedMotion={reducedMotion} />
        </div>
        
        <DialogueBox text={currentDialogue} reducedMotion={reducedMotion} />
        
        {#if showProjects}
          <div class="projects-section mt-6">
            <ProjectShowcase onClose={toggleProjects} />
          </div>
        {/if}
      </div>
      
      <div class="codec-sidebar w-full md:w-1/4 flex flex-col gap-4">
        <FrequencyDisplay 
          currentFrequency={currentFrequency} 
          onFrequencyChange={handleFrequencyChange}
          reducedMotion={reducedMotion}
        />
        
        <button 
          class="view-projects-btn text-sm bg-codec-dark-green text-codec-light-green px-3 py-2 border border-codec-green rounded hover:bg-codec-green hover:text-black"
          on:click={toggleProjects}
        >
          {showProjects ? 'HIDE PROJECTS' : 'VIEW PROJECTS'}
        </button>
        
        <div class="mt-auto">
          <AccessibilityControls 
            {reducedMotion}
            {highContrast}
            {disableScanlines}
            onToggleReducedMotion={toggleReducedMotion}
            onToggleHighContrast={toggleHighContrast}
            onToggleScanlines={toggleScanlines}
          />
        </div>
      </div>
    </div>
    
    <div class="codec-footer border-t-2 border-codec-green mt-6 pt-2">
      <div class="text-codec-green font-mono text-xs opacity-70">
        KEYBOARD SHORTCUTS: 1-4 for frequencies, P to toggle projects
      </div>
    </div>
  </div>
  
  <!-- Static effect that's toggled by disableScanlines -->
  {#if !disableScanlines}
    <StaticEffect />
  {/if}
</div>

<style>
  .codec-interface {
    background-color: black;
    color: var(--text-color, #00FF00);
    width: 100%;
    height: 100%;
    min-height: 100vh;
  }
  
  .codec-container {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  :global(.high-contrast) {
    --text-color: #FFFFFF !important;
    --highlight-color: #FFFFFF !important;
    --border-color: #FFFFFF !important;
  }
  
  :global(.high-contrast) .codec-header,
  :global(.high-contrast) .codec-footer,
  :global(.high-contrast) .view-projects-btn {
    color: white !important;
    border-color: white !important;
  }
</style>