import { readable } from 'svelte/store';
import { browser } from '$app/environment'; // Ensure code only runs in browser

let mediaQueryList = null;
let initialValue = false;

if (browser) {
  mediaQueryList = window.matchMedia('(prefers-reduced-motion: reduce)');
  initialValue = mediaQueryList.matches;
}

/**
 * A readable Svelte store that reflects the user's preference for reduced motion.
 * It initializes with the system setting and updates if it changes.
 */
export const reducedMotion = readable(initialValue, (set) => {
  if (!browser || !mediaQueryList) {
    // If not in browser or media query failed, do nothing (or set default)
    return () => {}; // No-op cleanup function
  }

  const updatePreference = (event) => {
    set(event.matches);
  };

  // Listen for changes in the media query
  mediaQueryList.addEventListener('change', updatePreference);

  // Return cleanup function to remove listener when store is unsubscribed
  return () => {
    mediaQueryList.removeEventListener('change', updatePreference);
  };
});

// Optional: Add other settings here later if needed
// export const soundEnabled = writable(true);