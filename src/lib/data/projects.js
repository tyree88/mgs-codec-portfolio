// src/lib/data/projects.js

export const projects = [
  {
    id: 'project1',
    title: 'Project Alpha',
    description: 'Detailed description of Project Alpha. Built with SvelteKit and Three.js for interactive 3D elements.',
    imageUrl: '/images/projects/alpha-screenshot.png', // Replace with actual path
    link: 'https://example.com/project-alpha', // Replace with actual link
    tags: ['SvelteKit', 'Three.js', 'WebXR']
  },
  {
    id: 'project2',
    title: 'Data Visualization Dashboard',
    description: 'An interactive dashboard for visualizing complex datasets using D3.js and Svelte.',
    imageUrl: '/images/projects/dataviz-screenshot.png', // Replace with actual path
    link: 'https://example.com/dataviz', // Replace with actual link
    tags: ['Svelte', 'D3.js', 'Data Visualization']
  },
  {
    id: 'project3',
    title: 'E-commerce Platform',
    description: 'Full-stack e-commerce solution with custom CMS integration.',
    imageUrl: '/images/projects/ecommerce-screenshot.png', // Replace with actual path
    // link: null, // Example of no live link
    tags: ['React', 'Node.js', 'PostgreSQL', 'Stripe']
  },
  {
    id: 'project4',
    title: 'Mobile Game Companion App',
    description: 'Cross-platform companion app for a popular mobile game, built with React Native.',
    imageUrl: '/images/projects/companion-app.png', // Replace with actual path
    link: 'https://example.com/companion-app', // Replace with actual link
    tags: ['React Native', 'Firebase', 'Mobile App']
  },
  {
    id: 'project5',
    title: 'Generative Art Experiment',
    description: 'Exploring creative coding with p5.js and Svelte to create unique generative art pieces.',
    imageUrl: '/images/projects/gen-art.png', // Replace with actual path
    link: 'https://example.com/gen-art', // Replace with actual link
    tags: ['p5.js', 'Svelte', 'Creative Coding']
  },
  // Add more projects as needed to reach at least 5
];

export function getProjectById(id) {
  return projects.find(p => p.id === id);
}