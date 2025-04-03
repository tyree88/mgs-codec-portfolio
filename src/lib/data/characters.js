// src/lib/data/characters.js

// Maps character keys used in frequency store to actual image paths and alt text
export const characterData = {
  snake: {
    src: '/images/characters/snake.png', // Replace with actual path
    alt: 'Solid Snake Portrait'
  },
  colonel: {
    src: '/images/characters/colonel.png', // Replace with actual path
    alt: 'Colonel Roy Campbell Portrait'
  },
  otacon: {
    src: '/images/characters/otacon.png', // Replace with actual path
    alt: 'Otacon Hal Emmerich Portrait'
  },
  mei_ling: {
    src: '/images/characters/mei_ling.png', // Replace with actual path
    alt: 'Mei Ling Portrait'
  },
  rosemary: {
    src: '/images/characters/rosemary.png', // Replace with actual path
    alt: 'Rosemary Portrait'
  },
  // Add more characters as needed
  '?': { // Placeholder for invalid/unknown characters
    src: '/images/characters/unknown.png', // Replace with actual path
    alt: 'Unknown Character'
  }
};

// Function to get character details by key
export function getCharacter(key) {
  return characterData[key] || characterData['?']; // Return unknown if key not found
}