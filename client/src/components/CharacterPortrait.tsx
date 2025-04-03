import { useEffect, useState } from "react";
import { Character } from "@/lib/characters";

interface CharacterPortraitProps {
  character: Character;
  side: "left" | "right";
  reducedMotion: boolean;
}

export default function CharacterPortrait({ character, side, reducedMotion }: CharacterPortraitProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Fade in character with delay if animations are enabled
  useEffect(() => {
    if (!reducedMotion) {
      setIsVisible(false);
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 300);
      
      return () => clearTimeout(timer);
    } else {
      setIsVisible(true);
    }
  }, [character, reducedMotion]);

  return (
    <div className={`w-full md:w-1/4 p-4 border-b-2 md:border-b-0 ${side === "left" ? "md:border-r-2" : ""} border-codec-light flex justify-center items-center`}>
      <div 
        className={`w-32 h-32 md:w-full md:h-auto max-h-64 relative transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}
      >
        {/* Character portrait SVG - using SVG to avoid binary image restrictions */}
        <div className="w-full h-full bg-codec-dark">
          <svg 
            viewBox="0 0 100 100" 
            className="w-full h-full mix-blend-screen" 
            style={{ filter: "grayscale(1) brightness(0.8)" }}
          >
            <defs>
              <clipPath id={`character-shape-${character.id}`}>
                <rect x="0" y="0" width="100" height="100" />
              </clipPath>
            </defs>
            <rect 
              x="0" 
              y="0" 
              width="100" 
              height="100" 
              fill="#0f380f" 
              clipPath={`url(#character-shape-${character.id})`}
            />
            <g 
              stroke="#8bac0f" 
              strokeWidth="0.5" 
              fill="#8bac0f" 
              clipPath={`url(#character-shape-${character.id})`}
            >
              {/* Character outline - simplified face shape */}
              <path d={character.svgPath} />
            </g>
          </svg>
        </div>
        {/* Character overlay for aesthetic */}
        <div className="absolute inset-0 bg-codec-dark opacity-30 mix-blend-multiply"></div>
        <div className="absolute inset-0 flex items-end p-2">
          <div className="text-xs md:text-sm">{character.title}</div>
        </div>
      </div>
    </div>
  );
}
