import { useState, useRef, useEffect } from "react";
import CharacterPortrait from "./CharacterPortrait";
import FrequencyDisplay from "./FrequencyDisplay";
import DialogueBox from "./DialogueBox";
import ProjectShowcase from "./ProjectShowcase";
import AccessibilityControls from "./AccessibilityControls";
import StaticEffect from "./StaticEffect";
import { characters } from "@/lib/characters";
import { dialogues } from "@/lib/dialogues";

interface CodecInterfaceProps {
  currentFrequency: string;
  onFrequencyChange: (frequency: string) => void;
  showProjects: boolean;
  onToggleProjects: () => void;
  accessibilitySettings: {
    reducedMotion: boolean;
    highContrast: boolean;
    disableScanlines: boolean;
    onToggleReducedMotion: () => void;
    onToggleHighContrast: () => void;
    onToggleScanlines: () => void;
  };
}

export default function CodecInterface({
  currentFrequency,
  onFrequencyChange,
  showProjects,
  onToggleProjects,
  accessibilitySettings
}: CodecInterfaceProps) {
  const [showStatic, setShowStatic] = useState(false);
  const [leftChar, setLeftChar] = useState(characters.find(c => c.id === "developer")!);
  const [rightChar, setRightChar] = useState(characters.find(c => c.id === "contact")!);
  
  // Get current dialogue based on frequency
  const currentDialogue = dialogues.find(d => d.frequency === currentFrequency)?.text || "";
  
  // Trigger static effect when changing frequency
  useEffect(() => {
    if (!accessibilitySettings.reducedMotion) {
      setShowStatic(true);
      setTimeout(() => {
        setShowStatic(false);
      }, 500);
    }
    
    // Update characters based on frequency
    const frequencyName = currentFrequency.split(".")[0];
    switch (frequencyName) {
      case "140": // HOME
        setLeftChar(characters.find(c => c.id === "developer")!);
        setRightChar(characters.find(c => c.id === "contact")!);
        break;
      case "141": // ABOUT
        setLeftChar(characters.find(c => c.id === "developer")!);
        setRightChar(characters.find(c => c.id === "mentor")!);
        break;
      case "141": // PROJECTS - same first digits, differentiated in the decimals
        if (currentFrequency === "141.80") {
          setLeftChar(characters.find(c => c.id === "developer")!);
          setRightChar(characters.find(c => c.id === "client")!);
        }
        break;
      case "142": // CONTACT
        setLeftChar(characters.find(c => c.id === "developer")!);
        setRightChar(characters.find(c => c.id === "contact")!);
        break;
    }
  }, [currentFrequency, accessibilitySettings.reducedMotion]);

  // Apply accessibility classes based on settings
  const containerClasses = `w-full max-w-5xl mx-auto crt-effect static-effect ${!accessibilitySettings.disableScanlines ? 'scanline' : ''} relative`;
  
  // Apply high contrast if enabled
  const contrastStyle = accessibilitySettings.highContrast 
    ? { filter: 'contrast(1.5) brightness(1.2)' } 
    : {};

  return (
    <div className="bg-black text-codec-light font-codec min-h-screen flex items-center justify-center p-4">
      <main className={containerClasses} style={contrastStyle}>
        {showStatic && !accessibilitySettings.reducedMotion && <StaticEffect />}
        
        <div className="hexagonal-bg border-2 border-codec-light rounded-md overflow-hidden shadow-lg relative">
          {/* Top Bar with PTT Indicator */}
          <div className="bg-codec-dark border-b-2 border-codec-light w-full text-center py-2 px-4 flex justify-between">
            <div className="invisible md:visible">{/* Spacer */}</div>
            <div className="text-xl md:text-2xl tracking-widest animate-blink">P T T</div>
            <div className="invisible md:visible">{/* Spacer */}</div>
          </div>
          
          {/* Main Codec Area */}
          <div className="flex flex-col md:flex-row w-full">
            {/* Left Character Portrait */}
            <CharacterPortrait 
              character={leftChar} 
              side="left" 
              reducedMotion={accessibilitySettings.reducedMotion}
            />
            
            {/* Center Frequency Display */}
            <FrequencyDisplay 
              currentFrequency={currentFrequency}
              onFrequencyChange={onFrequencyChange}
              onTuneClick={onToggleProjects}
              reducedMotion={accessibilitySettings.reducedMotion}
            />
            
            {/* Right Character Portrait */}
            <CharacterPortrait 
              character={rightChar} 
              side="right" 
              reducedMotion={accessibilitySettings.reducedMotion}
            />
          </div>
          
          {/* Dialogue Box */}
          <DialogueBox 
            text={currentDialogue} 
            reducedMotion={accessibilitySettings.reducedMotion}
          />
        </div>
        
        {/* Projects Showcase */}
        {showProjects && (
          <ProjectShowcase onClose={() => onToggleProjects()} />
        )}
        
        {/* Accessibility Controls */}
        <AccessibilityControls 
          reducedMotion={accessibilitySettings.reducedMotion}
          highContrast={accessibilitySettings.highContrast}
          disableScanlines={accessibilitySettings.disableScanlines}
          onToggleReducedMotion={accessibilitySettings.onToggleReducedMotion}
          onToggleHighContrast={accessibilitySettings.onToggleHighContrast}
          onToggleScanlines={accessibilitySettings.onToggleScanlines}
        />
      </main>
    </div>
  );
}
