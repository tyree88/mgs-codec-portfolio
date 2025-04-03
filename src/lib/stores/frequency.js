import { writable } from 'svelte/store';

// Define the available frequencies and their corresponding sections/content
export const frequencies = {
  '140.85': { section: 'Home', characterLeft: 'snake', characterRight: 'colonel', dialogue: 'Welcome to the portfolio. Use TUNE controls to navigate.' },
  '141.12': { section: 'About', characterLeft: 'snake', characterRight: 'otacon', dialogue: 'About section: Skills, experience, and background.' },
  '140.96': { section: 'Projects', characterLeft: 'snake', characterRight: 'mei_ling', dialogue: 'Projects showcase. Select a project for details.' },
  '141.52': { section: 'Contact', characterLeft: 'snake', characterRight: 'rosemary', dialogue: 'Contact information and form.' },
  // Add more frequencies as needed
};

export const availableFrequencies = Object.keys(frequencies);

// Store for the currently selected frequency
export const currentFrequency = writable(availableFrequencies[0]); // Start with the first frequency

// Store for the data associated with the current frequency
export const currentCodecData = writable(frequencies[availableFrequencies[0]]);

// Update codec data when frequency changes
currentFrequency.subscribe(freq => {
  if (frequencies[freq]) {
    currentCodecData.set(frequencies[freq]);
  } else {
    // Handle invalid frequency if necessary
    console.warn(`Invalid frequency selected: ${freq}`);
    // Optionally set to a default state or show an error message
    currentCodecData.set({ section: 'Invalid', characterLeft: '?', characterRight: '?', dialogue: 'Invalid Frequency.' });
  }
});

// Function to tune frequency up or down
export function tuneFrequency(direction: 'up' | 'down') {
  currentFrequency.update(current => {
    const currentIndex = availableFrequencies.indexOf(current);
    let newIndex;
    if (direction === 'up') {
      newIndex = (currentIndex + 1) % availableFrequencies.length;
    } else {
      newIndex = (currentIndex - 1 + availableFrequencies.length) % availableFrequencies.length;
    }
    return availableFrequencies[newIndex];
  });
}