import { useState } from "react";

interface AccessibilityControlsProps {
  reducedMotion: boolean;
  highContrast: boolean;
  disableScanlines: boolean;
  onToggleReducedMotion: () => void;
  onToggleHighContrast: () => void;
  onToggleScanlines: () => void;
}

export default function AccessibilityControls({
  reducedMotion,
  highContrast,
  disableScanlines,
  onToggleReducedMotion,
  onToggleHighContrast,
  onToggleScanlines
}: AccessibilityControlsProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="absolute top-2 right-2 z-30">
      <button 
        onClick={() => setIsOpen(prev => !prev)}
        aria-label="Toggle accessibility options"
        aria-expanded={isOpen}
        className="bg-codec-dark border border-codec-light text-codec-light px-2 py-1 rounded text-xs hover:bg-codec-mid focus:outline-none focus:ring-2 focus:ring-codec-light"
      >
        A11Y
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 bg-codec-dark border border-codec-light p-2 rounded text-xs w-48">
          <div className="mb-2">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                className="mr-2"
                checked={reducedMotion}
                onChange={onToggleReducedMotion}
                aria-label="Reduce motion"
              />
              Reduce Motion
            </label>
          </div>
          <div className="mb-2">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                className="mr-2"
                checked={highContrast}
                onChange={onToggleHighContrast}
                aria-label="High contrast mode"
              />
              High Contrast
            </label>
          </div>
          <div>
            <label className="flex items-center">
              <input 
                type="checkbox" 
                className="mr-2"
                checked={disableScanlines}
                onChange={onToggleScanlines}
                aria-label="Disable scanlines"
              />
              Disable Scanlines
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
