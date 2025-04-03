import { gsap } from 'gsap';

/**
 * Fades out an element, executes a callback, then fades in the element.
 * Useful for changing content like character portraits.
 * @param {HTMLElement} element - The target HTML element.
 * @param {function} changeContentCallback - Function to execute after fade out (e.g., change image src).
 * @param {number} [duration=0.2] - Duration of fade out/in animation in seconds.
 * @param {boolean} [prefersReducedMotion=false] - Whether to skip the animation.
 */
export function fadeSwap(element, changeContentCallback, duration = 0.2, prefersReducedMotion = false) {
  if (!element) return;

  if (prefersReducedMotion) {
    // Skip animation, just call the callback
    changeContentCallback();
    // Ensure element is visible if it was faded out previously
    gsap.set(element, { opacity: 1 });
    return;
  }

  const tl = gsap.timeline();
  tl.to(element, { opacity: 0, duration: duration / 2, ease: 'power1.in' })
    .call(changeContentCallback)
    .to(element, { opacity: 1, duration: duration / 2, ease: 'power1.out' });
}

/**
 * Slides an element out, executes a callback, then slides it back in.
 * @param {HTMLElement} element - The target HTML element.
 * @param {'left' | 'right' | 'up' | 'down'} direction - Direction to slide out/in from.
 * @param {function} changeContentCallback - Function to execute after slide out.
 * @param {number} [duration=0.3] - Duration of slide out/in animation in seconds.
 * @param {string} [distance='50%'] - Distance to slide out.
 * @param {boolean} [prefersReducedMotion=false] - Whether to skip the animation.
 */
export function slideSwap(element, direction, changeContentCallback, duration = 0.3, distance = '50%', prefersReducedMotion = false) {
  if (!element) return;

  if (prefersReducedMotion) {
    // Skip animation, just call the callback
    changeContentCallback();
     // Ensure element is in its final position if it was moved previously
    gsap.set(element, { x: '0%', y: '0%' });
    return;
  }

  let outVars = { duration: duration / 2, ease: 'power1.in' };
  let inVars = { duration: duration / 2, ease: 'power1.out' };

  switch (direction) {
    case 'left':
      outVars.x = `-${distance}`;
      inVars.x = '0%';
      break;
    case 'right':
      outVars.x = distance;
      inVars.x = '0%';
      break;
    case 'up':
      outVars.y = `-${distance}`;
      inVars.y = '0%';
      break;
    case 'down':
      outVars.y = distance;
      inVars.y = '0%';
      break;
  }

  const tl = gsap.timeline();
  // Set initial position for the 'in' animation before slide out completes
  tl.to(element, outVars)
    .call(() => {
        // Reset position before changing content and sliding in
        gsap.set(element, { x: direction === 'left' ? distance : (direction === 'right' ? `-${distance}` : '0%'), 
                             y: direction === 'up' ? distance : (direction === 'down' ? `-${distance}` : '0%') }); 
        changeContentCallback();
    })
    .to(element, inVars);
}

// Add more transition functions as needed (e.g., frequency number rolling)