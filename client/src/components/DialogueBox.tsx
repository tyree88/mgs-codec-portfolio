import { useEffect, useRef } from "react";
import useTypewriter from "@/lib/useTypewriter";

interface DialogueBoxProps {
  text: string;
  reducedMotion: boolean;
}

export default function DialogueBox({ text, reducedMotion }: DialogueBoxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { displayText, isTyping } = useTypewriter(text, !reducedMotion, 50);
  
  // Auto-scroll to keep up with typing text
  useEffect(() => {
    if (containerRef.current && isTyping) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [displayText, isTyping]);

  return (
    <div 
      ref={containerRef}
      className="p-4 md:p-6 bg-black border-t-2 border-codec-light codec-scroll"
      style={{ minHeight: "180px", maxHeight: "300px", overflowY: "auto" }}
      aria-live="polite"
    >
      <div className="whitespace-pre-line text-sm md:text-base leading-relaxed">
        {reducedMotion ? (
          // If reduced motion is enabled, show all text at once
          <div>{text}</div>
        ) : (
          // Otherwise show the typewriter effect
          displayText.split('\n').map((line, i) => (
            <div key={i} className="mb-2">
              {line}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
