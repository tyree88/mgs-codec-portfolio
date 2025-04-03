<script>
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  
  // State management
  let isFullyLoaded = false;
  let currentFrequency = "140.85";
  let activeCharacter = "developer";
  let showingProjects = false;
  
  // Accessibility settings
  let reducedMotion = false;
  let highContrast = false;
  let disableScanlines = false;
  
  // Dialogue lines
  const dialogues = {
    "140.85": "Welcome to my portfolio. I'm a web developer specializing in creating interactive experiences.\n\nNavigate through different sections by changing the frequency or using the MEMORY shortcuts.\n\nHOME: 140.85 | ABOUT: 141.12 | PROJECTS: 141.80 | CONTACT: 142.52",
    "141.12": "ABOUT ME\n\nI'm a senior web developer with over 5 years of experience building immersive digital experiences.\n\nMy expertise includes frontend frameworks like React, Svelte, and Vue, with a strong foundation in animation and interactive design.\n\nI believe in creating accessible, performant applications that push creative boundaries while maintaining usability.",
    "141.80": "PROJECT FILES ACCESSED\n\nViewing classified project information. Security clearance confirmed.\n\nScroll down to view the complete project archive or select a specific file for detailed information.",
    "142.52": "SECURE COMMUNICATION CHANNEL ESTABLISHED\n\nContact frequencies:\n- Email: dev@codecportfolio.com\n- Phone: (123) 456-7890\n\nAlternative communication methods:\n- GitHub: github.com/codecdev\n- LinkedIn: linkedin.com/in/codecdev\n\nAwait response..."
  };
  
  // Character SVG paths
  const characters = {
    "developer": {
      name: "DEV-TEAM",
      svg: `<svg viewBox="0 0 100 100" class="w-full h-full">
        <rect x="5" y="5" width="90" height="90" fill="#0f380f" rx="2" />
        <path d="M50,20 C30,20 25,40 25,60 C25,75 35,80 50,80 C65,80 75,75 75,60 C75,40 70,20 50,20 Z M38,45 C40,45 42,47 42,49 C42,51 40,53 38,53 C36,53 34,51 34,49 C34,47 36,45 38,45 Z M62,45 C64,45 66,47 66,49 C66,51 64,53 62,53 C60,53 58,51 58,49 C58,47 60,45 62,45 Z M40,65 Q50,70 60,65 Z" fill="#8bac0f" />
      </svg>`,
    },
    "mentor": {
      name: "MENTOR",
      svg: `<svg viewBox="0 0 100 100" class="w-full h-full">
        <rect x="5" y="5" width="90" height="90" fill="#0f380f" rx="2" />
        <path d="M50,20 C30,20 25,30 25,50 C25,70 30,80 50,80 C70,80 75,70 75,50 C75,30 70,20 50,20 Z M38,40 C40,40 42,42 42,44 C42,46 40,48 38,48 C36,48 34,46 34,44 C34,42 36,40 38,40 Z M62,40 C64,40 66,42 66,44 C66,46 64,48 62,48 C60,48 58,46 58,44 C58,42 60,40 62,40 Z M35,60 Q50,70 65,60 Z" fill="#8bac0f" />
      </svg>`,
    },
    "client": {
      name: "CLIENT",
      svg: `<svg viewBox="0 0 100 100" class="w-full h-full">
        <rect x="5" y="5" width="90" height="90" fill="#0f380f" rx="2" />
        <path d="M50,20 C35,20 30,35 30,50 C30,65 35,80 50,80 C65,80 70,65 70,50 C70,35 65,20 50,20 Z M38,45 C40,45 42,47 42,49 C42,51 40,53 38,53 C36,53 34,51 34,49 C34,47 36,45 38,45 Z M62,45 C64,45 66,47 66,49 C66,51 64,53 62,53 C60,53 58,51 58,49 C58,47 60,45 62,45 Z M40,60 Q50,65 60,60 Z" fill="#8bac0f" />
      </svg>`,
    },
    "contact": {
      name: "CONTACT",
      svg: `<svg viewBox="0 0 100 100" class="w-full h-full">
        <rect x="5" y="5" width="90" height="90" fill="#0f380f" rx="2" />
        <path d="M50,20 C35,20 25,35 25,50 C25,65 35,80 50,80 C65,80 75,65 75,50 C75,35 65,20 50,20 Z M38,40 C40,40 42,42 42,44 C42,46 40,48 38,48 C36,48 34,46 34,44 C34,42 36,40 38,40 Z M62,40 C64,40 66,42 66,44 C66,46 64,48 62,48 C60,48 58,46 58,44 C58,42 60,40 62,40 Z M35,65 Q50,60 65,65 Z" fill="#8bac0f" />
      </svg>`,
    }
  };
  
  // Frequency definitions
  const frequencies = [
    {
      name: "HOME",
      value: "140.85",
      description: "Main frequency for home section"
    },
    {
      name: "ABOUT",
      value: "141.12",
      description: "About me and skills"
    },
    {
      name: "PROJECTS",
      value: "141.80",
      description: "Portfolio projects"
    },
    {
      name: "CONTACT",
      value: "142.52",
      description: "Contact information"
    }
  ];
  
  // Character to frequency mapping
  const frequencyMap = {
    "140.85": "developer",
    "141.12": "mentor",
    "141.80": "client",
    "142.52": "contact"
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
  
  // Keyboard navigation handling
  function handleKeyDown(e) {
    // Up/Down arrows to change frequency
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      
      const freqIndex = frequencies.findIndex(freq => freq.value === currentFrequency);
      let newIndex;
      
      if (e.key === 'ArrowUp') {
        newIndex = (freqIndex - 1 + frequencies.length) % frequencies.length;
      } else {
        newIndex = (freqIndex + 1) % frequencies.length;
      }
      
      changeFrequency(frequencies[newIndex].value);
    }
    
    // Escape key to close projects panel
    if (e.key === 'Escape' && showingProjects) {
      toggleProjects();
    }
    
    // Enter key to open projects
    if (e.key === 'Enter' && !showingProjects) {
      toggleProjects();
    }
  }
  
  // Initialization and startup animation
  onMount(() => {
    // Add keyboard event listeners
    window.addEventListener('keydown', handleKeyDown);
    
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
    
    // Play codec startup sound/effect here if available
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });
</script>

<svelte:head>
  <title>Metal Gear Codec Portfolio</title>
</svelte:head>

<div class="hexagonal-bg min-h-screen flex items-center justify-center p-4">
  <!-- Main Codec Interface Container - Authentic MGS2 style -->
  <div class="codec-container relative w-full max-w-4xl mx-auto bg-codec-dark border border-codec-mid rounded overflow-hidden {!disableScanlines ? 'scanline' : ''} crt-effect">
    <!-- Horizontal divider lines that appear in the MGS2 codec -->
    <div class="absolute left-0 w-full h-px bg-codec-mid opacity-30" style="top: 60px;"></div>
    <div class="absolute left-0 w-full h-px bg-codec-mid opacity-30" style="bottom: 100px;"></div>
    
    <!-- Vertical divider lines -->
    <div class="absolute top-60 bottom-100 w-px bg-codec-mid opacity-30" style="left: 33.3%;"></div>
    <div class="absolute top-60 bottom-100 w-px bg-codec-mid opacity-30" style="right: 33.3%;"></div>
    
    <!-- Top Bar with Frequency Display - Matched to MGS2 Reference -->
    <div class="flex items-center justify-between py-2 border-b border-codec-mid">
      <div class="pl-4 text-codec-mid font-mono text-lg opacity-80">CODEC</div>
      
      <!-- Frequency Display -->
      <div class="frequency-display flex items-center">
        <div class="text-codec-highlight text-2xl font-mono animate-flicker tracking-widest mr-2">{currentFrequency}</div>
        <div class="progress-bars w-10 mr-4">
          <div class="bg-codec-mid w-full"></div>
          <div class="bg-codec-mid w-3/4 mt-1"></div>
          <div class="bg-codec-mid w-1/2 mt-1"></div>
        </div>
      </div>
    </div>
    
    <!-- Main Codec Content Area -->
    <div class="grid grid-cols-1 md:grid-cols-7 gap-4 p-6">
      <!-- Left Side - Character Portrait - Matched to MGS2 Reference -->
      <div class="md:col-span-3 flex flex-col space-y-4">
        <div class="character-portrait relative border border-codec-mid bg-codec-darker rounded-sm p-4 h-64 static-effect overflow-hidden">
          <div class="absolute inset-0 opacity-20 bg-static-noise"></div>
          <div class="h-full flex items-center justify-center">
            {@html characters[activeCharacter]?.svg || characters.developer.svg}
          </div>
          <div class="absolute bottom-1 left-1 text-codec-light text-sm font-mono">
            {characters[activeCharacter]?.name || "Unknown"}
          </div>
        </div>
      </div>
      
      <!-- Middle - Frequency Controls - Matched to MGS2 Reference -->
      <div class="md:col-span-1 flex flex-col items-center justify-center">
        <div class="frequency-controls flex flex-col space-y-4 w-full">
          <div class="text-codec-highlight text-center text-sm font-mono opacity-60">PTT</div>
          
          <div class="w-full bg-codec-darker border border-codec-mid rounded">
            <div class="bg-codec-darker p-2">
              <div class="h-36 bg-codec-darker border border-codec-mid rounded relative animate-frequency-scan">
                <div class="absolute top-0 right-0 text-xs text-codec-light font-mono p-1">MAX</div>
                {#each frequencies as freq, i}
                  <div
                    class="absolute left-0 right-0 text-xs text-codec-light cursor-pointer hover:text-codec-highlight transition-colors duration-150"
                    style="top: {4 + i * 20}px;"
                    on:click={() => changeFrequency(freq.value)}
                  >
                    <div class="flex items-center px-2">
                      <div class="h-px w-2 bg-codec-mid"></div>
                      <div class="ml-1 text-sm">{freq.value}</div>
                      {#if currentFrequency === freq.value}
                        <div class="ml-auto animate-blink">⊙</div>
                      {/if}
                    </div>
                  </div>
                {/each}
                <div class="absolute bottom-0 left-0 text-xs text-codec-light font-mono p-1">MIN</div>
              </div>
            </div>
          </div>
          
          <div class="flex justify-between items-center w-full">
            <div class="text-codec-light text-xs font-mono opacity-60">▼MEM.</div>
            <div class="text-codec-light text-xs font-mono opacity-60">◄TUNE►</div>
          </div>
          
          <button 
            class="mgs-button w-full py-2 hover:bg-codec-mid hover:text-black
                   transition-colors duration-200 text-sm tracking-wider"
            on:click={toggleProjects}
          >
            {showingProjects ? 'CLOSE FILES' : 'VIEW PROJECTS'}
          </button>
        </div>
      </div>
      
      <!-- Right Side - Second Character Portrait - Matched to MGS2 Reference -->
      <div class="md:col-span-3 flex flex-col space-y-4">
        <div class="character-portrait relative border border-codec-mid bg-codec-darker rounded-sm p-4 h-64 static-effect overflow-hidden">
          <div class="absolute inset-0 opacity-20 bg-static-noise"></div>
          <div class="h-full flex items-center justify-center">
            {@html characters[activeCharacter === 'developer' ? 'mentor' : 'developer'].svg}
          </div>
          <div class="absolute bottom-1 left-1 text-codec-light text-sm font-mono">
            {characters[activeCharacter === 'developer' ? 'mentor' : 'developer'].name}
          </div>
        </div>
      </div>
    </div>
    
    <!-- Dialogue Area -->
    <div class="border-t border-codec-mid p-6">
      <!-- Dialogue Text Box - More like the MGS2 reference -->
      <div class="dialogue-container border border-codec-mid bg-codec-dark rounded-sm p-4 mb-4">
        <div class="w-full max-w-4xl mx-auto">
          <p class="text-codec-light font-mono leading-relaxed text-center">
            {displayText}
          </p>
        </div>
      </div>
        
      <!-- Accessibility Controls - MGS2 Style Options Panel -->
      <div class="p-1 text-xs font-mono text-codec-mid mb-1">SYSTEM OPTIONS:</div>
      <div class="flex justify-between mt-1 space-x-3">
        <button 
          class="mgs-button flex items-center px-3"
          on:click={toggleReducedMotion}
        >
          <span class="mr-1">{reducedMotion ? '[×]' : '[ ]'}</span>
          <span>REDUCE MOTION</span>
        </button>
        
        <button 
          class="mgs-button flex items-center px-3"
          on:click={toggleHighContrast}
        >
          <span class="mr-1">{highContrast ? '[×]' : '[ ]'}</span>
          <span>HIGH CONTRAST</span>
        </button>
        
        <button 
          class="mgs-button flex items-center px-3"
          on:click={toggleScanlines}
        >
          <span class="mr-1">{disableScanlines ? '[×]' : '[ ]'}</span>
          <span>DISABLE SCANLINES</span>
        </button>
      </div>
      <div class="text-codec-mid text-xs font-mono opacity-80 text-right mt-1">PRESS ESC TO SAVE</div>
    </div>
    
    <!-- Projects Panel (Conditional) - MGS2 Style Data Files -->
    {#if showingProjects}
      <div class="projects-panel absolute inset-0 bg-codec-darker bg-opacity-98 p-6 overflow-y-auto codec-scroll static-effect">
        <!-- Top Interface Bar - Similar to MGS2 UI -->
        <div class="flex justify-between items-center mb-6 border-b border-codec-mid pb-3">
          <div>
            <h2 class="text-codec-highlight text-xl font-mono">PROJECT DATA FILES</h2>
            <div class="text-codec-light text-xs font-mono opacity-75">SECURITY LEVEL: CLASSIFIED</div>
          </div>
          <button 
            class="mgs-button px-4 py-1.5 flex items-center space-x-1"
            on:click={toggleProjects}
          >
            <span class="text-codec-mid">◄</span>
            <span>RETURN TO CODEC</span>
          </button>
        </div>
        
        <!-- Projects Grid Layout - MGS2 File Browser -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          {#each projects as project}
            <div class="border border-codec-mid bg-codec-dark bg-opacity-50 rounded p-4 hover:border-codec-highlight transition-colors duration-200 relative">
              <!-- MGS2-style File Header -->
              <div class="flex justify-between items-start mb-3 pb-2 border-b border-codec-mid border-opacity-50">
                <h3 class="text-codec-highlight text-lg font-mono">{project.title}</h3>
                <div class="flex flex-col items-end">
                  <span class="text-xs text-codec-mid font-mono border border-codec-mid px-1 rounded">ID-{project.id}</span>
                  <span class="text-xs text-codec-light font-mono mt-1 opacity-60">CLEARANCE GRANTED</span>
                </div>
              </div>
              
              <!-- Project Description with MGS2 Terminal Style -->
              <div class="bg-codec-darker p-3 border border-codec-mid border-opacity-30 mb-4">
                <p class="text-codec-light font-mono text-sm leading-relaxed codec-line">
                  {project.description}
                </p>
                <div class="w-full flex justify-start space-x-1 mt-2">
                  <span class="h-1 w-1 bg-codec-highlight animate-blink"></span>
                  <span class="h-1 w-1 bg-codec-highlight animate-blink" style="animation-delay: 0.3s"></span>
                  <span class="h-1 w-1 bg-codec-highlight animate-blink" style="animation-delay: 0.6s"></span>
                </div>
              </div>
              
              <!-- Technologies Used Section -->
              <div class="mb-4">
                <div class="text-xs text-codec-mid font-mono mb-1 opacity-80">TECHNOLOGIES:</div>
                <div class="flex flex-wrap gap-1.5">
                  {#each project.technologies as tech}
                    <span class="bg-codec-darker px-2 py-0.5 text-xs rounded border border-codec-mid text-codec-light">
                      {tech}
                    </span>
                  {/each}
                </div>
              </div>
              
              <!-- Access Project Link Button -->
              <div class="flex justify-between items-center">
                <div class="text-xs text-codec-mid">◄ACCESS►</div>
                <a 
                  href={project.link} 
                  class="mgs-button px-4 py-1 hover:animate-incoming-call"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  VIEW PROJECT
                </a>
              </div>
            </div>
          {/each}
        </div>
        
        <!-- Bottom Status Bar - Similar to MGS2 UI -->
        <div class="mt-6 border-t border-codec-mid pt-3 flex justify-between text-codec-mid text-xs font-mono">
          <div>SYSTEM STATUS: NOMINAL</div>
          <div class="animate-blink">ENCRYPTED CONNECTION ACTIVE</div>
        </div>
      </div>
    {/if}
    
    <!-- Loading Indicator (Initially) -->
    {#if !isFullyLoaded}
      <div class="absolute inset-0 bg-codec-dark bg-opacity-95 flex flex-col items-center justify-center z-50 static-effect">
        <div class="w-16 h-16 mb-4 relative">
          <div class="absolute inset-0 border-4 border-t-codec-highlight border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <div class="absolute inset-0 border-4 border-r-codec-mid border-l-codec-mid border-t-transparent border-b-transparent rounded-full animate-ping opacity-75"></div>
        </div>
        <div class="text-codec-highlight text-xl font-mono mb-2">
          CODEC SYSTEM v2.1
        </div>
        <div class="text-codec-light text-sm font-mono animate-pulse mb-4">
          ESTABLISHING CONNECTION...
        </div>
        <div class="grid grid-cols-3 gap-1 w-64">
          {#each Array(9) as _, i}
            <div class="h-1 bg-codec-mid animate-pulse" style="animation-delay: {i * 100}ms;"></div>
          {/each}
        </div>
        <div class="text-codec-mid text-xs font-mono mt-6">
          ENCRYPTION PROTOCOL: ALPHA
        </div>
      </div>
    {/if}
  </div>
</div>