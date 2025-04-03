import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(TextPlugin);

let currentTimeline = null; // Store the current animation timeline

/**
 * Creates a typewriter effect for the given text element.
 * @param {HTMLElement} element - The target HTML element to display the text.
 * @param {string} text - The full text to type out.
 * @param {number} [speed=0.05] - The time (in seconds) per character. Default is 50ms.
 * @param {boolean} [prefersReducedMotion=false] - Whether to skip the animation.
 * @param {function} [onComplete] - Optional callback function when typing finishes.
 */
export function typeWriter(element, text, speed = 0.05, prefersReducedMotion = false, onComplete) {
  // Kill any existing animation on this element
  if (currentTimeline) {
    currentTimeline.kill();
  }

  if (prefersReducedMotion) {
    // If reduced motion is preferred, just set the text directly and call onComplete
    element.textContent = text;
    if (onComplete) {
      onComplete();
    }
    return; // Skip animation setup
  }

  // Ensure the element is empty initially for the effect
  element.textContent = '';

  const duration = text.length * speed;

  currentTimeline = gsap.timeline({
    onComplete: () => {
      currentTimeline = null; // Clear the reference when done
      if (onComplete) {
        onComplete();
      }
    }
  });

  currentTimeline.to(element, {
    duration: duration,
    text: {
      value: text,
      delimiter: "" // Type character by character
    },
    ease: 'none'
  });
}

/**
 * Immediately finishes any ongoing typewriter animation on the element.
 */
export function skipTypewriter() {
  if (currentTimeline) {
    currentTimeline.progress(1); // Jump to the end of the animation
    // The onComplete callback in the timeline will handle cleanup
  }
}