<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import CharacterPortrait from './CharacterPortrait.svelte';
  import DialogueBox from './DialogueBox.svelte';
  import FrequencyDisplay from './FrequencyDisplay.svelte';
  import ProjectShowcase from './ProjectShowcase.svelte';
  import AccessibilityControls from './AccessibilityControls.svelte';
  import StaticEffect from './StaticEffect.svelte';
  import SoundVisualizer from './SoundVisualizer.svelte';
  import VoiceModulator from './VoiceModulator.svelte';
  import EasterEggNotification from './EasterEggNotification.svelte';
  
  import { characters } from '../characters.js';
  import { frequencies } from '../frequencies.js';
  import { dialogues } from '../dialogues.js';
  import { checkForEasterEgg, triggerEasterEgg } from '../easterEggs.js';
  
  const dispatch = createEventDispatcher();
  
  // Props
  export let currentFrequency = frequencies[0].value;
  export let reducedMotion = false;
  export let highContrast = false;
  export let disableScanlines = false;
  
  // State
  let showProjects = false;
  let showVoiceModulator = false;
  let showCodecFeatures = false;
  let leftCharacter = characters.find(c => c.id === 'developer');
  let rightCharacter = characters.find(c => c.id === 'contact');
  let currentDialogue = dialogues.find(d => d.frequency === currentFrequency)?.text || '';
  let audioElement; // Reference to audio element for codec sounds
  
  // Easter Egg State
  let frequencySequence = [];
  let foundEasterEgg = null;
  let showEasterEggNotification = false;
  let activeEasterEggs = new Set();
  
  // Audio output visualizer state
  let audioContext;
  let audioSource;
  let showSoundVisualizer = false;
  let soundVisualizerActive = false;
  
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
    if (frequency !== currentFrequency) {
      playFrequencyChangeSound();
      
      // Add to the sequence for easter egg detection
      frequencySequence.push(frequency);
      
      // Keep only the last 10 frequencies in the sequence
      if (frequencySequence.length > 10) {
        frequencySequence = frequencySequence.slice(-10);
      }
      
      // Check for easter eggs
      checkEasterEggs();
      
      // Update current frequency
      currentFrequency = frequency;
    }
  }
  
  // Check the current frequency sequence for easter eggs
  function checkEasterEggs() {
    const easterEgg = checkForEasterEgg(frequencySequence);
    
    if (easterEgg && !activeEasterEggs.has(easterEgg.id)) {
      foundEasterEgg = easterEgg;
      showEasterEggNotification = true;
      playEasterEggFoundSound();
    }
  }
  
  // Handle easter egg activation
  function handleEasterEggAction(event) {
    const { id, action } = event.detail;
    
    // Add to active easter eggs
    activeEasterEggs.add(id);
    
    // Execute action based on the easter egg type
    switch (action) {
      case 'revealExtraProjects':
        showProjects = true;
        break;
      case 'enableFoxdieSounds':
        // Enable special sound effects
        break;
      case 'psychoMantisEffect':
        // Special visual effect
        document.documentElement.style.filter = 'invert(1)';
        setTimeout(() => {
          document.documentElement.style.filter = '';
        }, 3000);
        break;
      case 'enableRaidenTheme':
        // Toggle theme
        document.body.classList.toggle('raiden-theme');
        break;
      case 'playSnakeEaterTheme':
        // Play theme song
        if (audioElement) {
          audioElement.src = 'audio/snake-eater.mp3';
          audioElement.play();
        }
        break;
    }
  }
  
  // Toggle project showcase
  function toggleProjects() {
    showProjects = !showProjects;
  }
  
  // Toggle sound visualizer
  function toggleSoundVisualizer() {
    showSoundVisualizer = !showSoundVisualizer;
    
    if (showSoundVisualizer && !audioContext) {
      initAudioContext();
    }
    
    soundVisualizerActive = showSoundVisualizer;
  }
  
  // Toggle voice modulator
  function toggleVoiceModulator() {
    showVoiceModulator = !showVoiceModulator;
  }
  
  // Toggle codec features panel
  function toggleCodecFeatures() {
    showCodecFeatures = !showCodecFeatures;
  }
  
  // Initialize audio context for visualizer
  function initAudioContext() {
    if (!audioContext) {
      try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // If there's already an audio element
        if (audioElement) {
          audioSource = audioContext.createMediaElementSource(audioElement);
          audioSource.connect(audioContext.destination);
        }
      } catch (e) {
        console.error('Web Audio API not supported:', e);
      }
    }
  }
  
  // Play frequency change sound
  function playFrequencyChangeSound() {
    if (audioElement) {
      audioElement.src = 'audio/frequency-change.mp3';
      audioElement.play().catch(e => console.error('Error playing audio:', e));
    }
  }
  
  // Play easter egg found sound
  function playEasterEggFoundSound() {
    if (audioElement) {
      audioElement.src = 'audio/easter-egg-found.mp3';
      audioElement.play().catch(e => console.error('Error playing audio:', e));
    }
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
      
      // Shortcut for voice modulator (V key)
      if (e.key === 'v' || e.key === 'V') {
        toggleVoiceModulator();
      }
      
      // Shortcut for sound visualizer (S key)
      if (e.key === 's' || e.key === 'S') {
        toggleSoundVisualizer();
      }
      
      // Shortcuts for frequencies (1-4 keys)
      if (e.key >= '1' && e.key <= '4') {
        const index = parseInt(e.key) - 1;
        if (index >= 0 && index < frequencies.length) {
          handleFrequencyChange(frequencies[index].value);
        }
      }
    };
    
    // Create audio element for sounds
    audioElement = new Audio();
    audioElement.volume = 0.5;
    
    // Add keyboard listener
    window.addEventListener('keydown', handleKeyDown);
    
    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      
      if (audioContext) {
        audioContext.close().catch(() => {});
      }
    };
  });
</script>

<div class="codec-interface {highContrast ? 'high-contrast' : ''} {disableScanlines ? 'no-scanlines' : ''}">
  <div class="codec-container flex flex-col min-h-screen p-4">
    <div class="codec-header border-b-2 border-codec-green mb-6 pb-1 flex justify-between items-center">
      <h1 class="text-codec-green font-mono text-xl">CODEC</h1>
      
      <div class="codec-features-toggle">
        <button 
          class="codec-features-btn text-sm px-2 py-1 border border-codec-green rounded hover:bg-codec-dark-green"
          on:click={toggleCodecFeatures}
        >
          {showCodecFeatures ? 'HIDE FEATURES' : 'ADVANCED FEATURES'}
        </button>
      </div>
    </div>
    
    <!-- Advanced Codec Features Panel -->
    {#if showCodecFeatures}
      <div class="codec-features-panel mb-4 border border-codec-green p-3 bg-codec-dark-green bg-opacity-30">
        <div class="features-header mb-2">
          <h3 class="text-codec-light-green font-mono">ADVANCED CODEC FEATURES</h3>
        </div>
        
        <div class="features-grid grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button 
            class="feature-btn flex items-center gap-2 text-sm bg-codec-dark-green text-codec-light-green px-3 py-2 border border-codec-green rounded hover:bg-codec-green hover:text-black"
            on:click={toggleVoiceModulator}
          >
            <span class="icon">🎤</span>
            <span>{showVoiceModulator ? 'HIDE VOICE MODULATOR' : 'VOICE MODULATOR'}</span>
          </button>
          
          <button 
            class="feature-btn flex items-center gap-2 text-sm bg-codec-dark-green text-codec-light-green px-3 py-2 border border-codec-green rounded hover:bg-codec-green hover:text-black"
            on:click={toggleSoundVisualizer}
          >
            <span class="icon">📊</span>
            <span>{showSoundVisualizer ? 'HIDE SOUND VISUALIZER' : 'SOUND VISUALIZER'}</span>
          </button>
        </div>
        
        <div class="text-codec-green font-mono text-xs mt-3 opacity-70">
          <p>Try entering special frequency combinations to discover hidden easter eggs!</p>
          <p>Current sequence length: {frequencySequence.length}</p>
        </div>
      </div>
    {/if}
    
    <!-- Voice Modulator Component -->
    {#if showVoiceModulator}
      <div class="voice-modulator-container mb-4">
        <VoiceModulator active={true} reducedMotion={reducedMotion} />
      </div>
    {/if}
    
    <!-- Sound Visualizer Component -->
    {#if showSoundVisualizer}
      <div class="sound-visualizer-container mb-4">
        <h3 class="text-codec-light-green font-mono text-sm mb-1">AUDIO WAVEFORM</h3>
        <SoundVisualizer 
          active={soundVisualizerActive} 
          audioSource={audioElement} 
          reducedMotion={reducedMotion}
        />
      </div>
    {/if}
    
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
        KEYBOARD SHORTCUTS: 1-4 for frequencies, P to toggle projects, V for voice modulator, S for sound visualizer
      </div>
    </div>
  </div>
  
  <!-- Easter Egg Notification -->
  <EasterEggNotification 
    easterEgg={foundEasterEgg} 
    visible={showEasterEggNotification} 
    reducedMotion={reducedMotion}
    on:close={() => showEasterEggNotification = false}
    on:action={handleEasterEggAction}
  />
  
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