import { useState, useEffect } from "react";

/**
 * Custom hook to create a typewriter effect
 * @param text The text to display with typewriter effect
 * @param enabled Whether the typewriter effect is enabled
 * @param speed Speed in milliseconds per character
 */
export default function useTypewriter(text: string, enabled: boolean = true, speed: number = 50) {
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  useEffect(() => {
    // If typewriter is disabled, show entire text
    if (!enabled) {
      setDisplayText(text);
      setIsTyping(false);
      return;
    }
    
    // Reset when text changes
    setDisplayText("");
    setIsTyping(true);
    
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayText(prev => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, speed);
    
    return () => clearInterval(interval);
  }, [text, enabled, speed]);
  
  return { displayText, isTyping };
}
