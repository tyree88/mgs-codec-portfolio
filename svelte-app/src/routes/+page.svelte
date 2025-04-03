<script>
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  
  // State management
  let isFullyLoaded = false;
  let currentFrequency = "140.85";
  let activeCharacter = "snake";
  let showingProjects = false;
  
  // Accessibility settings
  let reducedMotion = false;
  let highContrast = false;
  let disableScanlines = false;
  
  // Dialogue lines
  const dialogues = {
    "140.85": "This is Snake. I've created this CODEC system as a showcase for my development skills. Navigate through the frequencies to learn more about me and my projects.",
    "141.12": "Otacon here. Want to see the technologies I'm proficient with? I've been developing with JavaScript, TypeScript, React, Svelte, and more.",
    "142.30": "This is Campbell. Looking for someone with experience? I've worked on various projects including web applications, APIs, and interactive UIs.",
    "143.80": "Mei Ling. If you're looking for contact information, you can reach me through email or connect on GitHub and LinkedIn.",
    "148.50": "This is Naomi. Want to see my project portfolio? Use the TUNE button to view detailed information about my work."
  };
  
  // Character SVG paths
  const characters = {
    "snake": {
      name: "Snake",
      svg: `<svg viewBox="0 0 100 100" class="w-full h-full">
        <!-- Snake character portrait would go here -->
        <rect x="10" y="10" width="80" height="80" fill="#306230" rx="2" />
        <circle cx="50" cy="40" r="20" fill="#8bac0f" />
        <rect x="30" y="70" width="40" height="10" fill="#8bac0f" rx="2" />
      </svg>`,
    },
    "otacon": {
      name: "Otacon",
      svg: `<svg viewBox="0 0 100 100" class="w-full h-full">
        <!-- Otacon character portrait would go here -->
        <rect x="10" y="10" width="80" height="80" fill="#306230" rx="2" />
        <circle cx="50" cy="40" r="20" fill="#8bac0f" />
        <rect x="30" y="70" width="40" height="10" fill="#8bac0f" rx="2" />
      </svg>`,
    },
    "campbell": {
      name: "Campbell",
      svg: `<svg viewBox="0 0 100 100" class="w-full h-full">
        <!-- Campbell character portrait would go here -->
        <rect x="10" y="10" width="80" height="80" fill="#306230" rx="2" />
        <circle cx="50" cy="40" r="20" fill="#8bac0f" />
        <rect x="30" y="70" width="40" height="10" fill="#8bac0f" rx="2" />
      </svg>`,
    },
    "mei-ling": {
      name: "Mei Ling",
      svg: `<svg viewBox="0 0 100 100" class="w-full h-full">
        <!-- Mei Ling character portrait would go here -->
        <rect x="10" y="10" width="80" height="80" fill="#306230" rx="2" />
        <circle cx="50" cy="40" r="20" fill="#8bac0f" />
        <rect x="30" y="70" width="40" height="10" fill="#8bac0f" rx="2" />
      </svg>`,
    },
    "naomi": {
      name: "Naomi",
      svg: `<svg viewBox="0 0 100 100" class="w-full h-full">
        <!-- Naomi character portrait would go here -->
        <rect x="10" y="10" width="80" height="80" fill="#306230" rx="2" />
        <circle cx="50" cy="40" r="20" fill="#8bac0f" />
        <rect x="30" y="70" width="40" height="10" fill="#8bac0f" rx="2" />
      </svg>`,
    }
  };
  
  // Character to frequency mapping
  const frequencyMap = {
    "140.85": "snake",
    "141.12": "otacon",
    "142.30": "campbell",
    "143.80": "mei-ling",
    "148.50": "naomi"
  };
  
  // Projects data
  const projects = [
    {
      id: 1,
      title: "E-Commerce Platform",
      description: "A full-stack e-commerce application with React, Node.js, and MongoDB",
      image: "ecommerce.png",
      technologies: ["React", "Node.js", "Express", "MongoDB", "JWT"],
      link: "#"
    },
    {
      id: 2,
      title: "Task Management App",
      description: "A productivity application with drag-and-drop tasks and real-time updates",
      image: "tasks.png",
      technologies: ["Vue.js", "Firebase", "Tailwind CSS"],
      link: "#"
    },
    {
      id: 3,
      title: "Weather Dashboard",
      description: "An interactive weather application with forecast visualization",
      image: "weather.png",
      technologies: ["Svelte", "D3.js", "OpenWeather API"],
      link: "#"
    }
  ];
  
  // Function to change frequency
  function changeFrequency(newFreq) {
    if (currentFrequency === newFreq) return;
    
    // Update character and frequency
    currentFrequency = newFreq;
    activeCharacter = frequencyMap[newFreq] || "snake";
    
    if (!reducedMotion) {
      // Animation for frequency change would go here
      const frequencyElement = document.querySelector('.frequency-display');
      gsap.fromTo(
        frequencyElement,
        { opacity: 0.5, scale: 0.98 },
        { opacity: 1, scale: 1, duration: 0.3 }
      );
      
      // Character transition animation
      const portraitElement = document.querySelector('.character-portrait');
      gsap.fromTo(
        portraitElement,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, delay: 0.1 }
      );
    }
  }
  
  // Function to toggle projects display
  function toggleProjects() {
    showingProjects = !showingProjects;
    
    if (showingProjects && !reducedMotion) {
      // Animation for showing projects
      gsap.fromTo(
        '.projects-panel',
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.4 }
      );
    }
  }
  
  // Toggle accessibility settings
  function toggleReducedMotion() {
    reducedMotion = !reducedMotion;
  }
  
  function toggleHighContrast() {
    highContrast = !highContrast;
  }
  
  function toggleScanlines() {
    disableScanlines = !disableScanlines;
  }
  
  // Typewriter effect for dialogue text
  let displayText = "";
  let fullText = "";
  let typeInterval;
  
  function typeWriter() {
    fullText = dialogues[currentFrequency] || "No transmission on this frequency.";
    displayText = "";
    clearInterval(typeInterval);
    
    if (reducedMotion) {
      displayText = fullText;
      return;
    }
    
    let i = 0;
    typeInterval = setInterval(() => {
      if (i < fullText.length) {
        displayText += fullText.charAt(i);
        i++;
      } else {
        clearInterval(typeInterval);
      }
    }, 30);
  }
  
  // Re-run typewriter when frequency changes
  $: {
    if (currentFrequency) {
      typeWriter();
    }
  }
  
  // Initialization and startup animation
  onMount(() => {
    // Use GSAP for initial load animation
    if (!reducedMotion) {
      gsap.fromTo(
        '.codec-container',
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" }
      );
      
      gsap.fromTo(
        '.character-portrait',
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.5, delay: 0.4 }
      );
      
      gsap.fromTo(
        '.dialogue-container',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, delay: 0.6 }
      );
    }
    
    isFullyLoaded = true;
  });
</script>

<svelte:head>
  <title>Metal Gear Codec Portfolio</title>
</svelte:head>

<div class="hexagonal-bg min-h-screen flex items-center justify-center p-4">
  <!-- Main Codec Interface Container -->
  <div class="codec-container relative w-full max-w-4xl mx-auto bg-codec-dark border-2 border-codec-mid rounded-lg shadow-2xl overflow-hidden {!disableScanlines ? 'scanline' : ''} crt-effect">
    
    <!-- Top Bar with Frequency Display -->
    <div class="flex items-center justify-between p-4 border-b border-codec-mid">
      <div class="text-codec-light font-mono text-lg">CODEC SYSTEM</div>
      
      <!-- Frequency Display -->
      <div class="frequency-display flex items-center space-x-4">
        <div class="text-codec-highlight text-2xl font-mono animate-flicker">{currentFrequency}</div>
        <div class="progress-bars w-16">
          <div class="bg-codec-mid w-full"></div>
          <div class="bg-codec-mid w-3/4"></div>
          <div class="bg-codec-mid w-1/2"></div>
        </div>
      </div>
    </div>
    
    <!-- Main Codec Content Area -->
    <div class="grid grid-cols-1 md:grid-cols-5 gap-4 p-6">
      <!-- Left Side - Character Portrait -->
      <div class="md:col-span-2 flex flex-col space-y-4">
        <div class="character-portrait relative border-2 border-codec-mid bg-codec-dark rounded-md p-4 h-64 static-effect">
          {@html characters[activeCharacter]?.svg || characters.snake.svg}
          <div class="absolute bottom-2 left-2 text-codec-light text-sm font-mono">
            {characters[activeCharacter]?.name || "Unknown"}
          </div>
        </div>
        
        <!-- Frequency Controls -->
        <div class="flex flex-col space-y-2">
          <div class="grid grid-cols-3 gap-2">
            {#each Object.keys(frequencyMap) as frequency}
              <button 
                class="px-3 py-2 bg-codec-dark border border-codec-mid hover:border-codec-light 
                       rounded text-sm font-mono transition-colors duration-200
                       {currentFrequency === frequency ? 'frequency-active' : ''}"
                on:click={() => changeFrequency(frequency)}
              >
                {frequency}
              </button>
            {/each}
          </div>
          
          <button 
            class="w-full px-4 py-2 bg-codec-mid hover:bg-codec-highlight text-black font-mono rounded
                   transition-colors duration-200 uppercase tracking-wider"
            on:click={toggleProjects}
          >
            {showingProjects ? 'Hide Projects' : 'View Projects'}
          </button>
        </div>
      </div>
      
      <!-- Right Side - Dialogue and Content -->
      <div class="md:col-span-3 flex flex-col space-y-4">
        <!-- Dialogue Text Box -->
        <div class="dialogue-container border-2 border-codec-mid bg-codec-dark rounded-md p-4 h-48 overflow-y-auto codec-scroll">
          <p class="text-codec-light font-mono leading-relaxed">
            {displayText}
          </p>
        </div>
        
        <!-- Accessibility Controls -->
        <div class="p-4 border border-codec-mid rounded-md bg-codec-dark">
          <h3 class="text-codec-light font-mono mb-2 text-sm uppercase">Accessibility Options</h3>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button 
              class="px-2 py-1 border border-codec-mid rounded text-xs font-mono
                     {reducedMotion ? 'bg-codec-mid text-black' : 'bg-transparent'}"
              on:click={toggleReducedMotion}
            >
              Reduce Motion
            </button>
            
            <button 
              class="px-2 py-1 border border-codec-mid rounded text-xs font-mono
                     {highContrast ? 'bg-codec-mid text-black' : 'bg-transparent'}"
              on:click={toggleHighContrast}
            >
              High Contrast
            </button>
            
            <button 
              class="px-2 py-1 border border-codec-mid rounded text-xs font-mono
                     {disableScanlines ? 'bg-codec-mid text-black' : 'bg-transparent'}"
              on:click={toggleScanlines}
            >
              No Scanlines
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Projects Panel (Conditional) -->
    {#if showingProjects}
      <div class="projects-panel absolute inset-0 bg-codec-dark bg-opacity-95 p-6 overflow-y-auto codec-scroll">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-codec-highlight text-2xl font-mono">PROJECTS</h2>
          <button 
            class="px-3 py-1 bg-codec-mid hover:bg-codec-light text-black font-mono rounded text-sm"
            on:click={toggleProjects}
          >
            Close
          </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          {#each projects as project}
            <div class="border border-codec-mid rounded-md p-4 hover:border-codec-light transition-colors duration-200">
              <h3 class="text-codec-light text-xl font-mono mb-2">{project.title}</h3>
              <p class="text-codec-mid font-mono mb-4">{project.description}</p>
              
              <div class="flex flex-wrap gap-2 mb-4">
                {#each project.technologies as tech}
                  <span class="bg-codec-dark px-2 py-1 text-xs rounded border border-codec-mid text-codec-light">
                    {tech}
                  </span>
                {/each}
              </div>
              
              <a 
                href={project.link} 
                class="inline-block px-3 py-2 bg-codec-mid hover:bg-codec-light text-black font-mono rounded text-sm transition-colors duration-200"
                target="_blank" 
                rel="noopener noreferrer"
              >
                View Project
              </a>
            </div>
          {/each}
        </div>
      </div>
    {/if}
    
    <!-- Loading Indicator (Initially) -->
    {#if !isFullyLoaded}
      <div class="absolute inset-0 bg-codec-dark bg-opacity-90 flex items-center justify-center z-50">
        <div class="text-codec-light text-xl font-mono animate-blink">
          ESTABLISHING CONNECTION...
        </div>
      </div>
    {/if}
  </div>
</div>