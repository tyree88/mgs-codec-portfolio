import { useState, useEffect } from "react";
import CodecInterface from "@/components/CodecInterface";
import { frequencies } from "@/lib/frequencies";

export default function Home() {
  const [currentFrequency, setCurrentFrequency] = useState(frequencies[0].value);
  const [showProjects, setShowProjects] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [disableScanlines, setDisableScanlines] = useState(false);
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Arrow keys for frequency selection
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        
        const currentIndex = frequencies.findIndex(freq => freq.value === currentFrequency);
        let newIndex;
        
        if (e.key === 'ArrowUp') {
          newIndex = (currentIndex - 1 + frequencies.length) % frequencies.length;
        } else {
          newIndex = (currentIndex + 1) % frequencies.length;
        }
        
        setCurrentFrequency(frequencies[newIndex].value);
        
        // Hide projects view when changing frequency (unless going to projects)
        if (frequencies[newIndex].name !== 'PROJECTS') {
          setShowProjects(false);
        } else {
          setShowProjects(true);
        }
      }
      
      // Escape key to close project showcase
      if (e.key === 'Escape' && showProjects) {
        setShowProjects(false);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentFrequency, showProjects]);
  
  // Handle frequency change
  const handleFrequencyChange = (frequency: string) => {
    setCurrentFrequency(frequency);
    
    // Show projects when on PROJECTS frequency
    const freqObj = frequencies.find(f => f.value === frequency);
    if (freqObj?.name === 'PROJECTS') {
      setShowProjects(true);
    } else {
      setShowProjects(false);
    }
  };
  
  // Toggle projects visibility
  const toggleProjects = () => {
    setShowProjects(prev => !prev);
  };
  
  // Accessibility settings
  const accessibilitySettings = {
    reducedMotion,
    highContrast,
    disableScanlines,
    onToggleReducedMotion: () => setReducedMotion(prev => !prev),
    onToggleHighContrast: () => setHighContrast(prev => !prev),
    onToggleScanlines: () => setDisableScanlines(prev => !prev)
  };

  return (
    <CodecInterface
      currentFrequency={currentFrequency}
      onFrequencyChange={handleFrequencyChange}
      showProjects={showProjects}
      onToggleProjects={toggleProjects}
      accessibilitySettings={accessibilitySettings}
    />
  );
}
