/**
 * Easter Eggs accessible through secret frequency combinations
 * This file contains the definitions for special hidden features
 * that can be activated by entering specific frequency sequences.
 */

// Secret frequency patterns
const secretPatterns = [
  {
    id: 'konami',
    name: 'Konami Code',
    pattern: ['140.96', '140.96', '141.12', '141.12', '141.80', '141.52', '141.80', '141.52', '141.24', '141.80'],
    description: 'The classic Konami cheat code sequence (Up, Up, Down, Down, Left, Right, Left, Right, B, A)'
  },
  {
    id: 'foxdie',
    name: 'FOXDIE Protocol',
    pattern: ['140.15', '141.80', '140.85', '141.52', '141.12', '141.74'],
    description: 'FOXDIE virus activation sequence'
  },
  {
    id: 'mgs1',
    name: 'Shadow Moses',
    pattern: ['141.80', '140.85', '141.12', '140.15', '141.52', '140.15'],
    description: 'Reference to Shadow Moses Island from Metal Gear Solid 1'
  },
  {
    id: 'mgs2',
    name: 'Big Shell',
    pattern: ['141.80', '140.85', '141.52'],
    description: 'Codec frequencies from MGS2 Big Shell incident'
  },
  {
    id: 'snake',
    name: 'Snake Eater',
    pattern: ['141.80', '141.52', '140.85', '140.15', '141.12', '141.74'],
    description: 'The Snake Eater theme sequence'
  }
];

// Easter Egg rewards/effects when a pattern is successfully entered
const easterEggRewards = {
  'konami': {
    type: 'visual',
    name: 'Infinite Bandana',
    description: 'Unlocked stealth developer mode with extra project details',
    action: 'revealExtraProjects',
    icon: '🎮'
  },
  'foxdie': {
    type: 'sound',
    name: 'FOXDIE',
    description: 'Unlocked special sound effects for all interactions',
    action: 'enableFoxdieSounds',
    icon: '🧬'
  },
  'mgs1': {
    type: 'visual',
    name: 'Psycho Mantis',
    description: 'Psycho Mantis can now read your browsing history... or not',
    action: 'psychoMantisEffect',
    icon: '👁️'
  },
  'mgs2': {
    type: 'theme',
    name: 'Raiden Mode',
    description: 'UI transformed to Metal Gear Solid 2 Raiden style',
    action: 'enableRaidenTheme',
    icon: '⚡'
  },
  'snake': {
    type: 'audio',
    name: 'Snake Eater Theme',
    description: 'Plays the iconic Snake Eater theme song',
    action: 'playSnakeEaterTheme',
    icon: '🐍'
  }
};

/**
 * Check if a frequency sequence matches any known pattern
 * @param {string[]} sequence - The array of frequencies that were input
 * @returns {object|null} - The matching easter egg or null if no match
 */
export function checkForEasterEgg(sequence) {
  if (!sequence || sequence.length === 0) return null;
  
  // Check each pattern for a match
  for (const secretPattern of secretPatterns) {
    // Only compare if the sequence has enough entries to match the pattern
    if (sequence.length >= secretPattern.pattern.length) {
      // Get the last N entries where N is the pattern length
      const lastEntries = sequence.slice(-secretPattern.pattern.length);
      
      // Check if the last entries match the pattern
      const matches = lastEntries.every((freq, index) => 
        freq === secretPattern.pattern[index]);
      
      if (matches) {
        // Return the full easter egg info
        return {
          ...secretPattern,
          reward: easterEggRewards[secretPattern.id]
        };
      }
    }
  }
  
  return null;
}

/**
 * Get list of all available easter eggs (for debugging or hints)
 * @returns {Array} - List of all easter eggs
 */
export function getAllEasterEggs() {
  return secretPatterns.map(pattern => ({
    ...pattern,
    reward: easterEggRewards[pattern.id]
  }));
}

/**
 * Execute the appropriate action for an easter egg
 * @param {string} easterEggId - The ID of the easter egg to activate
 * @param {Function} callback - Callback function to handle the easter egg action
 */
export function triggerEasterEgg(easterEggId, callback) {
  if (!easterEggId || !callback) return;
  
  const easterEgg = secretPatterns.find(p => p.id === easterEggId);
  const reward = easterEggRewards[easterEggId];
  
  if (easterEgg && reward) {
    callback({
      id: easterEggId,
      name: easterEgg.name,
      action: reward.action,
      type: reward.type,
      description: reward.description,
      icon: reward.icon
    });
  }
}

/**
 * Get a hint for a specific easter egg
 * @param {string} easterEggId - The ID of the easter egg
 * @returns {string} - A hint for how to activate the easter egg
 */
export function getEasterEggHint(easterEggId) {
  const easterEgg = secretPatterns.find(p => p.id === easterEggId);
  
  if (!easterEgg) return 'No hint available.';
  
  // Create a hint that doesn't directly give away the full pattern
  const firstFreq = easterEgg.pattern[0];
  const length = easterEgg.pattern.length;
  
  return `Start with frequency ${firstFreq} and enter a sequence of ${length} frequencies to unlock the ${easterEgg.name} easter egg.`;
}