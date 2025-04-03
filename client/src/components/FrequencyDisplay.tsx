import { useState } from "react";
import { frequencies } from "@/lib/frequencies";

interface FrequencyDisplayProps {
  currentFrequency: string;
  onFrequencyChange: (frequency: string) => void;
  onTuneClick: () => void;
  reducedMotion: boolean;
}

export default function FrequencyDisplay({ 
  currentFrequency, 
  onFrequencyChange, 
  onTuneClick,
  reducedMotion
}: FrequencyDisplayProps) {
  const [showMemory, setShowMemory] = useState(true);
  
  const handleFrequencyClick = (frequency: string) => {
    if (frequency !== currentFrequency) {
      onFrequencyChange(frequency);
    }
  };

  return (
    <div className="w-full md:w-2/4 p-4 border-b-2 md:border-b-0 md:border-r-2 border-codec-light flex flex-col justify-center items-center">
      <div className="w-full bg-codec-dark border-2 border-codec-light rounded-sm p-4 relative">
        {/* Signal Strength Bars */}
        <div className="progress-bars absolute left-3 top-1/2 transform -translate-y-1/2">
          <div className="w-12 bg-codec-light"></div>
          <div className="w-10 bg-codec-light"></div>
          <div className="w-8 bg-codec-light"></div>
          <div className="w-6 bg-codec-light"></div>
          <div className="w-4 bg-codec-light"></div>
        </div>
        
        {/* Frequency Display */}
        <div className={`text-right text-3xl md:text-5xl text-codec-highlight ${!reducedMotion ? 'animate-flicker' : ''} tracking-widest`}>
          {currentFrequency}
        </div>

        {/* Frequency Tuning Controls */}
        <div className="flex justify-between items-center mt-4 text-sm">
          <button 
            onClick={() => setShowMemory(prev => !prev)}
            className="hover:text-codec-highlight focus:outline-none focus:text-codec-highlight"
            aria-label="Toggle memory display"
          >
            {showMemory ? "▼ MEM." : "▲ MEM."}
          </button>
          <button 
            onClick={onTuneClick}
            className="hover:text-codec-highlight focus:outline-none focus:text-codec-highlight"
            aria-label="Tune frequency"
          >
            ◄ TUNE ►
          </button>
        </div>
      </div>
      
      {/* Memory Frequencies */}
      {showMemory && (
        <div className="w-full mt-4 bg-codec-dark border-2 border-codec-light rounded-sm p-2 text-sm">
          <div className="text-center mb-1">MEMORY</div>
          <div className="grid grid-cols-2 gap-1 mt-2">
            {frequencies.map((freq) => (
              <div 
                key={freq.value}
                className={`frequency-item cursor-pointer p-1 hover:bg-codec-mid transition-colors ${currentFrequency === freq.value ? 'bg-codec-mid' : ''}`}
                onClick={() => handleFrequencyClick(freq.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleFrequencyClick(freq.value)}
                tabIndex={0}
                role="button"
                aria-pressed={currentFrequency === freq.value}
              >
                {freq.name} - {freq.value}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
