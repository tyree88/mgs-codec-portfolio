import { gsap } from 'gsap';

/**
 * Create a typewriter text effect
 * @param {HTMLElement} element - The element to apply the effect to
 * @param {string} text - The text to display
 * @param {number} speed - Speed in milliseconds per character (default: 50)
 * @returns {gsap.core.Timeline} GSAP timeline
 */
export function typewriterEffect(element, text, speed = 50) {
  const tl = gsap.timeline();
  
  // Clear existing text
  tl.set(element, { text: "" });
  
  // Type each character
  for (let i = 0; i < text.length; i++) {
    tl.to(element, {
      text: text.substring(0, i + 1),
      duration: speed / 1000,
      ease: "none"
    });
  }
  
  return tl;
}

/**
 * Create a static interference effect between transitions
 * @param {HTMLElement} element - The element to apply the effect to
 * @param {number} duration - The duration of the effect in seconds (default: 0.5)
 * @returns {gsap.core.Timeline} GSAP timeline
 */
export function staticInterference(element, duration = 0.5) {
  const tl = gsap.timeline();
  
  tl.set(element, { 
    opacity: 0,
    visibility: "visible" 
  });
  
  // Flicker effect
  tl.to(element, {
    opacity: 0.7,
    duration: duration / 5,
    ease: "power1.inOut"
  });
  
  tl.to(element, {
    opacity: 0.3,
    duration: duration / 5,
    ease: "power1.inOut"
  });
  
  tl.to(element, {
    opacity: 0.6,
    duration: duration / 5,
    ease: "power1.inOut"
  });
  
  tl.to(element, {
    opacity: 0.8,
    duration: duration / 5,
    ease: "power1.inOut"
  });
  
  tl.to(element, {
    opacity: 0,
    duration: duration / 5,
    ease: "power1.inOut",
    onComplete: () => {
      gsap.set(element, { visibility: "hidden" });
    }
  });
  
  return tl;
}

/**
 * Create a portrait transition effect
 * @param {HTMLElement} outElement - The element to fade out
 * @param {HTMLElement} inElement - The element to fade in
 * @param {number} duration - The duration of the transition in seconds (default: 0.3)
 * @returns {gsap.core.Timeline} GSAP timeline
 */
export function portraitTransition(outElement, inElement, duration = 0.3) {
  const tl = gsap.timeline();
  
  // Fade out current portrait
  tl.to(outElement, {
    opacity: 0,
    duration: duration / 2,
    ease: "power1.inOut"
  });
  
  // Fade in new portrait
  tl.to(inElement, {
    opacity: 1,
    duration: duration / 2,
    ease: "power1.inOut"
  }, `>-${duration / 4}`);
  
  return tl;
}

/**
 * Create a frequency change animation
 * @param {HTMLElement} element - The frequency display element
 * @param {string} targetFrequency - The target frequency to display
 * @param {number} duration - The duration of the animation in seconds (default: 0.3)
 * @returns {gsap.core.Timeline} GSAP timeline
 */
export function frequencyChangeAnimation(element, targetFrequency, duration = 0.3) {
  const tl = gsap.timeline();
  const currentText = element.textContent || "";
  const currentFreq = parseFloat(currentText);
  const targetFreq = parseFloat(targetFrequency);
  
  if (isNaN(currentFreq) || isNaN(targetFreq)) {
    // If parsing fails, just set the text directly
    tl.set(element, { innerText: targetFrequency });
    return tl;
  }
  
  // Calculate number of steps based on duration
  const steps = Math.max(3, Math.floor(duration * 10));
  const stepDuration = duration / steps;
  
  // Create a series of steps to "tune" between frequencies
  for (let i = 1; i <= steps; i++) {
    const progress = i / steps;
    const interpolatedValue = currentFreq + (targetFreq - currentFreq) * progress;
    
    // Format to maintain decimal places
    const formattedValue = interpolatedValue.toFixed(2);
    
    tl.to(element, {
      innerText: formattedValue,
      duration: stepDuration,
      ease: "none",
      roundProps: "innerText"
    });
  }
  
  // Ensure final value is exact
  tl.set(element, { innerText: targetFrequency });
  
  return tl;
}