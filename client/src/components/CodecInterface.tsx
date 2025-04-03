import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { characters } from '@/lib/characters';
import { frequencies } from '@/lib/frequencies';
import { dialogues } from '@/lib/dialogues';
import { projects } from '@/lib/projects';

// Import reference image
import codecReferenceImage from '@assets/Metal Gear Solid 2 Radio Call.jpg';

interface AccessibilitySettings {
  reducedMotion: boolean;
  highContrast: boolean;
  disableScanlines: boolean;
  onToggleReducedMotion: () => void;
  onToggleHighContrast: () => void;
  onToggleScanlines: () => void;
}

interface CodecInterfaceProps {
  currentFrequency: string;
  onFrequencyChange: (frequency: string) => void;
  showProjects: boolean;
  onToggleProjects: () => void;
  accessibilitySettings: AccessibilitySettings;
}

export default function CodecInterface({
  currentFrequency,
  onFrequencyChange,
  showProjects: showingProjects,
  onToggleProjects: toggleProjects,
  accessibilitySettings
}: CodecInterfaceProps) {
  // State management
  const [activeCharacter, setActiveCharacter] = useState("developer");
  const [isFullyLoaded, setIsFullyLoaded] = useState(false);
  
  // Accessibility settings
  const { reducedMotion, highContrast, disableScanlines } = accessibilitySettings;
  
  // Refs for animation targets
  const codecContainerRef = useRef<HTMLDivElement>(null);
  const characterPortraitRef = useRef<HTMLDivElement>(null);
  const dialogueContainerRef = useRef<HTMLDivElement>(null);
  const frequencyDisplayRef = useRef<HTMLDivElement>(null);
  const projectsPanelRef = useRef<HTMLDivElement>(null);
  
  // Get current dialogue text
  const currentDialogue = dialogues.find(d => d.frequency === currentFrequency)?.text || 
    "No transmission on this frequency.";
  
  // State for typewriter effect
  const [displayText, setDisplayText] = useState(currentDialogue);
  
  // Handle typewriter effect
  useEffect(() => {
    if (reducedMotion) {
      setDisplayText(currentDialogue);
      return;
    }
    
    setDisplayText("");
    let i = 0;
    const speed = 30;
    
    const typeInterval = setInterval(() => {
      if (i < currentDialogue.length) {
        setDisplayText(prev => prev + currentDialogue.charAt(i));
        i++;
      } else {
        clearInterval(typeInterval);
      }
    }, speed);
    
    return () => clearInterval(typeInterval);
  }, [currentDialogue, reducedMotion]);
  
  // Character to frequency mapping
  const frequencyMap = {
    "140.85": "snake",
    "141.12": "otacon",
    "142.30": "campbell",
    "143.80": "mei-ling",
    "148.50": "naomi"
  };
  
  // Function to change frequency
  const changeFrequency = (newFreq: string) => {
    if (currentFrequency === newFreq) return;
    
    // Update character and frequency
    onFrequencyChange(newFreq);
    
    // Convert frequency to character ID based on a simple mapping
    const characterMap: Record<string, string> = {
      "140.85": "developer",
      "141.12": "mentor",
      "141.80": "client",
      "142.52": "contact"
    };
    
    setActiveCharacter(characterMap[newFreq] || "developer");
    
    if (!reducedMotion && frequencyDisplayRef.current && characterPortraitRef.current) {
      // Animation for frequency change
      gsap.fromTo(
        frequencyDisplayRef.current,
        { opacity: 0.5, scale: 0.98 },
        { opacity: 1, scale: 1, duration: 0.3 }
      );
      
      // Character transition animation
      gsap.fromTo(
        characterPortraitRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, delay: 0.1 }
      );
    }
  };
  
  // Function to handle project toggle with animation
  const handleToggleProjects = () => {
    toggleProjects();
    
    if (!showingProjects && !reducedMotion && projectsPanelRef.current) {
      // Animation for showing projects
      gsap.fromTo(
        projectsPanelRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.4 }
      );
    }
  };
  
  // Use accessibility handlers from props
  const { onToggleReducedMotion, onToggleHighContrast, onToggleScanlines } = accessibilitySettings;
  
  // Initialization and startup animation
  useEffect(() => {
    const timeline = gsap.timeline();
    
    if (!reducedMotion && codecContainerRef.current && characterPortraitRef.current && dialogueContainerRef.current) {
      timeline
        .fromTo(
          codecContainerRef.current,
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" }
        )
        .fromTo(
          characterPortraitRef.current,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.5 },
          "-=0.4"
        )
        .fromTo(
          dialogueContainerRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5 },
          "-=0.2"
        );
    }
    
    // Set loaded state after animations
    const timer = setTimeout(() => {
      setIsFullyLoaded(true);
    }, reducedMotion ? 0 : 1000);
    
    return () => clearTimeout(timer);
  }, [reducedMotion]);
  
  // Find the current character
  const currentCharacterData = characters.find(c => c.id === activeCharacter) || characters[0];
  
  return (
    <div className="hexagonal-bg min-h-screen flex items-center justify-center p-4">
      {/* Main Codec Interface Container */}
      <div 
        ref={codecContainerRef}
        className={`codec-container relative w-full max-w-4xl mx-auto bg-codec-dark border-2 border-codec-mid rounded-lg shadow-2xl overflow-hidden ${!disableScanlines ? 'scanline' : ''} crt-effect`}
      >
        {/* Top Bar with Frequency Display */}
        <div className="flex items-center justify-between p-4 border-b border-codec-mid">
          <div className="text-codec-light font-mono text-lg">CODEC SYSTEM</div>
          
          {/* Frequency Display */}
          <div ref={frequencyDisplayRef} className="frequency-display flex items-center space-x-4">
            <div className="text-codec-highlight text-2xl font-mono animate-flicker">{currentFrequency}</div>
            <div className="progress-bars w-16">
              <div className="bg-codec-mid w-full"></div>
              <div className="bg-codec-mid w-3/4"></div>
              <div className="bg-codec-mid w-1/2"></div>
            </div>
          </div>
        </div>
        
        {/* Main Codec Content Area */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-6">
          {/* Left Side - Character Portrait */}
          <div className="md:col-span-2 flex flex-col space-y-4">
            <div 
              ref={characterPortraitRef}
              className="character-portrait relative border-2 border-codec-mid bg-codec-dark rounded-md p-4 h-64 static-effect"
            >
              <div dangerouslySetInnerHTML={{ __html: currentCharacterData.svgPath }} className="w-full h-full" />
              <div className="absolute bottom-2 left-2 text-codec-light text-sm font-mono">
                {currentCharacterData.title}
              </div>
            </div>
            
            {/* Frequency Controls */}
            <div className="flex flex-col space-y-2">
              <div className="grid grid-cols-3 gap-2">
                {frequencies.map((freq) => (
                  <button 
                    key={freq.value}
                    className={`px-3 py-2 bg-codec-dark border border-codec-mid hover:border-codec-light 
                           rounded text-sm font-mono transition-colors duration-200
                           ${currentFrequency === freq.value ? 'frequency-active' : ''}`}
                    onClick={() => changeFrequency(freq.value)}
                  >
                    {freq.value}
                  </button>
                ))}
              </div>
              
              <button 
                className="w-full px-4 py-2 bg-codec-mid hover:bg-codec-highlight text-black font-mono rounded
                       transition-colors duration-200 uppercase tracking-wider"
                onClick={toggleProjects}
              >
                {showingProjects ? 'Hide Projects' : 'View Projects'}
              </button>
            </div>
          </div>
          
          {/* Right Side - Dialogue and Content */}
          <div className="md:col-span-3 flex flex-col space-y-4">
            {/* Dialogue Text Box */}
            <div 
              ref={dialogueContainerRef}
              className="dialogue-container border-2 border-codec-mid bg-codec-dark rounded-md p-4 h-48 overflow-y-auto codec-scroll"
            >
              <p className="text-codec-light font-mono leading-relaxed">
                {displayText}
              </p>
            </div>
            
            {/* Accessibility Controls */}
            <div className="p-4 border border-codec-mid rounded-md bg-codec-dark">
              <h3 className="text-codec-light font-mono mb-2 text-sm uppercase">Accessibility Options</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button 
                  className={`px-2 py-1 border border-codec-mid rounded text-xs font-mono
                         ${reducedMotion ? 'bg-codec-mid text-black' : 'bg-transparent'}`}
                  onClick={onToggleReducedMotion}
                >
                  Reduce Motion
                </button>
                
                <button 
                  className={`px-2 py-1 border border-codec-mid rounded text-xs font-mono
                         ${highContrast ? 'bg-codec-mid text-black' : 'bg-transparent'}`}
                  onClick={onToggleHighContrast}
                >
                  High Contrast
                </button>
                
                <button 
                  className={`px-2 py-1 border border-codec-mid rounded text-xs font-mono
                         ${disableScanlines ? 'bg-codec-mid text-black' : 'bg-transparent'}`}
                  onClick={onToggleScanlines}
                >
                  No Scanlines
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Projects Panel (Conditional) */}
        {showingProjects && (
          <div 
            ref={projectsPanelRef}
            className="projects-panel absolute inset-0 bg-codec-dark bg-opacity-95 p-6 overflow-y-auto codec-scroll"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-codec-highlight text-2xl font-mono">PROJECTS</h2>
              <button 
                className="px-3 py-1 bg-codec-mid hover:bg-codec-light text-black font-mono rounded text-sm"
                onClick={toggleProjects}
              >
                Close
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project) => (
                <div 
                  key={project.id}
                  className="border border-codec-mid rounded-md p-4 hover:border-codec-light transition-colors duration-200"
                >
                  <h3 className="text-codec-light text-xl font-mono mb-2">{project.title}</h3>
                  <p className="text-codec-mid font-mono mb-4">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, i) => (
                      <span 
                        key={i}
                        className="bg-codec-dark px-2 py-1 text-xs rounded border border-codec-mid text-codec-light"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  <a 
                    href={project.url} 
                    className="inline-block px-3 py-2 bg-codec-mid hover:bg-codec-light text-black font-mono rounded text-sm transition-colors duration-200"
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    View Project
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Loading Indicator (Initially) */}
        {!isFullyLoaded && (
          <div className="absolute inset-0 bg-codec-dark bg-opacity-90 flex items-center justify-center z-50">
            <div className="text-codec-light text-xl font-mono animate-blink">
              ESTABLISHING CONNECTION...
            </div>
          </div>
        )}
        
        {/* Debug reference image (remove in production) */}
        {/* <div className="fixed bottom-4 right-4 w-64 border-2 border-white">
          <img src={codecReferenceImage} alt="Metal Gear Solid 2 Codec reference" className="w-full" />
        </div> */}
      </div>
    </div>
  );
}