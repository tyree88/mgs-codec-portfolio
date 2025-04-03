<script lang="ts">
  import { onMount, onDestroy } from 'svelte'; // Import lifecycle functions
  import FrequencyDisplay from './FrequencyDisplay.svelte';
  import CharacterPortrait from './CharacterPortrait.svelte';
  import DialogueBox from './DialogueBox.svelte';
  import ScanlineEffect from './ScanlineEffect.svelte';
  import StaticEffect from './StaticEffect.svelte'; // Import StaticEffect
  import { currentFrequency, currentCodecData, tuneFrequency } from '$lib/stores/frequency.js';
  import { reducedMotion } from '$lib/stores/settings.js'; // Import reducedMotion store
  import { getCharacter } from '$lib/data/characters.js';
  import { fadeSwap } from '$lib/animations/transitions.js'; // Import fadeSwap
  import ProjectShowcase from './ProjectShowcase.svelte'; // Import ProjectShowcase
  import { projects } from '$lib/data/projects.js'; // Import projects data
  import ContactForm from './ContactForm.svelte'; // Import ContactForm

// Reactive declarations to get character data based on the current codec data store
$: leftCharData = getCharacter($currentCodecData.characterLeft);
$: rightCharData = getCharacter($currentCodecData.characterRight);

let isTuning = false; // State to control static effect
let leftPortraitContainer: HTMLDivElement;
let rightPortraitContainer: HTMLDivElement;

// State for Project Showcase
let selectedProject: typeof projects[0] | null = null;
let showcaseOpen = false;

function openProjectShowcase(project: typeof projects[0]) {
  selectedProject = project;
  showcaseOpen = true;
}

function handleTune(direction: 'up' | 'down') {
  if (isTuning) return; // Prevent tuning while already tuning

  isTuning = true;
  // Simulate tuning delay and static effect duration
  // Fade duration for portraits
  const fadeDuration = 0.2;

  // Apply fade effect before changing frequency
  fadeSwap(leftPortraitContainer, () => {}, fadeDuration, $reducedMotion); // Pass reducedMotion
  fadeSwap(rightPortraitContainer, () => { // Fade out right, then change frequency in callback
    tuneFrequency(direction);
  }, fadeDuration, $reducedMotion); // Pass reducedMotion

  // Keep static effect active during fade + a bit after
  setTimeout(() => {
    isTuning = false;
  }, fadeDuration * 1000 + 150); // fadeDuration (ms) + linger time
}

// Keyboard navigation handler
function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'ArrowLeft') {
    handleTune('down');
  } else if (event.key === 'ArrowRight') {
    handleTune('up');
  }
}

onMount(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onDestroy(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>

<div class="codec-container relative w-full min-h-screen bg-codec-dark text-codec-light font-mono overflow-hidden p-2 md:p-4 flex flex-col">
  <!-- Scanline/CRT Effect Overlay -->
  <ScanlineEffect />
  <StaticEffect isActive={isTuning} /> {/* Add StaticEffect */}

  <div class="flex flex-col md:flex-row justify-between items-center md:items-start flex-grow"> {/* Stack vertically on mobile, row on md+ */}
    <!-- Left Character Portrait Area -->
    {/* Order changed for mobile layout: Frequency first */}
    <!-- Center Area (Frequency Display) -->
    <div class="center-area w-full md:w-1/2 order-1 md:order-2 h-auto md:h-full flex flex-col items-center pt-4 md:pt-8">
      <FrequencyDisplay frequency={$currentFrequency} />
    </div>

    {/* Left Portrait - adjust size and order */}
    <div bind:this={leftPortraitContainer} class="portrait-left w-1/2 md:w-1/4 order-2 md:order-1 h-auto md:h-full flex items-center justify-center p-2 md:p-0">
      <CharacterPortrait side="left" imageSrc={leftCharData.src} altText={leftCharData.alt} />
    </div>

      {/* Content moved */}

    <!-- Right Character Portrait Area -->
    {/* Right Portrait - adjust size and order */}
    <div bind:this={rightPortraitContainer} class="portrait-right w-1/2 md:w-1/4 order-3 md:order-3 h-auto md:h-full flex items-center justify-center p-2 md:p-0">
      <CharacterPortrait side="right" imageSrc={rightCharData.src} altText={rightCharData.alt} />
    </div>
  </div>

  <!-- Dialogue Box Area -->
  {/* Adjust dialogue height */}
  <div class="dialogue-area h-1/3 md:h-1/4 border-t-2 border-codec-light pt-2 mt-4 md:mt-0 overflow-y-auto">
    {#if $currentFrequency === '140.96'}
      <!-- Projects Section -->
      <DialogueBox text={$currentCodecData.dialogue} />
      <ul class="mt-2 space-y-1 text-sm pl-2">
        {#each projects as project (project.id)}
          <li>
            <button
              on:click={() => openProjectShowcase(project)}
              class="hover:text-codec-highlight focus:text-codec-highlight outline-none"
            >
              &gt; {project.title}
            </button>
          </li>
        {/each}
      </ul>
    {:else if $currentFrequency === '141.12'}
      <!-- About Section -->
      <DialogueBox text={$currentCodecData.dialogue} />
      <div class="mt-2 pl-2">
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          class="text-sm hover:text-codec-highlight focus:text-codec-highlight outline-none"
        >
          &gt; View Resume (PDF)
        </a>
      </div>
    {:else if $currentFrequency === '141.52'}
      <!-- Contact Section -->
      <DialogueBox text={$currentCodecData.dialogue} />
      <div class="mt-2 pl-2">
         <ContactForm />
      </div>
    {:else}
      <!-- Default Dialogue for other sections (e.g., Home) -->
      <DialogueBox text={$currentCodecData.dialogue} />
    {/if}
  </div>

  <!-- Frequency Memory/Controls (will be added later) -->
  {/* Adjust controls layout */}
  <div class="controls-area text-xs text-center mt-2 flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-4">
     <button
       on:click={() => handleTune('down')}
       class="px-2 py-1 border border-codec-light hover:bg-codec-mid active:bg-codec-highlight disabled:opacity-50"
       disabled={isTuning}
       aria-label="Tune frequency down"
     >
       TUNE DOWN
     </button>
     <button
       on:click={() => handleTune('up')}
       class="px-2 py-1 border border-codec-light hover:bg-codec-mid active:bg-codec-highlight disabled:opacity-50"
       disabled={isTuning}
       aria-label="Tune frequency up"
     >
       TUNE UP
     </button>
     <!-- Memory section placeholder -->
     <div class="memory-area mt-2 md:mt-0">MEMORY: [ ] [ ] [ ]</div>
 </div>
</div>

<!-- Project Showcase Modal -->
<ProjectShowcase bind:isOpen={showcaseOpen} project={selectedProject} />

<style>
  /* Add component-specific styles here if needed */
  .codec-container {
    /* Example: Add hexagonal pattern later */
    /* background-image: url('/images/ui/hex-pattern.svg'); */
  }
</style>