/**
 * Creates a typewriter effect action for Svelte
 * @param {HTMLElement} node - The DOM node to attach the action to
 * @param {Object} params - Parameters for the action
 * @param {string} params.text - The text to type
 * @param {boolean} params.enabled - Whether the effect is enabled
 * @param {number} params.speed - Speed in milliseconds per character
 * @returns {Object} Action object
 */
export function typewriter(node, { text = '', enabled = true, speed = 50 }) {
  let timeout;
  let currentIndex = 0;
  
  function animate() {
    // Skip if not enabled
    if (!enabled) {
      node.textContent = text;
      return;
    }
    
    // Type one character at a time
    currentIndex++;
    node.textContent = text.slice(0, currentIndex);
    
    // Continue if we haven't reached the end
    if (currentIndex < text.length) {
      timeout = setTimeout(animate, speed);
    }
  }
  
  function start() {
    // Reset
    currentIndex = 0;
    clearTimeout(timeout);
    node.textContent = '';
    
    // Start animation
    if (text && enabled) {
      timeout = setTimeout(animate, speed);
    } else {
      node.textContent = text;
    }
  }
  
  // Initial call
  start();
  
  return {
    update({ text: newText, enabled: newEnabled, speed: newSpeed }) {
      text = newText;
      enabled = newEnabled;
      speed = newSpeed;
      start();
    },
    destroy() {
      clearTimeout(timeout);
    }
  };
}