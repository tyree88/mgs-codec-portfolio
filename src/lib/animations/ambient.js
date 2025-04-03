import { gsap } from 'gsap';

/**
 * Creates a simple blinking effect on an element by toggling its opacity.
 * @param {HTMLElement} element - The target HTML element.
 * @param {number} [duration=0.7] - The duration of one blink cycle (fade out + fade in).
 * @param {number} [delay=0] - Initial delay before starting.
 * @param {number} [minOpacity=0.3] - The minimum opacity during the blink.
 * @param {boolean} [prefersReducedMotion=false] - Whether to skip the animation.
 * @returns {gsap.core.Timeline | null} - The GSAP timeline instance or null if skipped.
 */
export function blinkEffect(element, duration = 0.7, delay = 0, minOpacity = 0.3, prefersReducedMotion = false) {
  if (!element) return null;

  if (prefersReducedMotion) {
    // Ensure element is fully visible if reduced motion is preferred
    gsap.set(element, { opacity: 1 });
    return null; // Don't create the animation timeline
  }

  const tl = gsap.timeline({
    repeat: -1, // Repeat indefinitely
    repeatDelay: Math.random() * 1 + 0.5, // Add random delay between repeats
    delay: delay + Math.random() * 0.5, // Add random initial delay
  });

  tl.to(element, {
    opacity: minOpacity,
    duration: duration / 2,
    ease: 'power1.inOut',
  }).to(element, {
    opacity: 1,
    duration: duration / 2,
    ease: 'power1.inOut',
  });

  return tl; // Return the timeline so it can be controlled (e.g., killed on destroy)
}

// Add more ambient animation functions here if needed