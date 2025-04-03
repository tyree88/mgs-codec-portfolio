export interface Frequency {
  name: string;
  value: string;
  description: string;
}

export const frequencies: Frequency[] = [
  {
    name: "HOME",
    value: "140.85",
    description: "Main frequency for home section"
  },
  {
    name: "ABOUT",
    value: "141.12",
    description: "About me and skills"
  },
  {
    name: "PROJECTS",
    value: "141.80",
    description: "Portfolio projects"
  },
  {
    name: "CONTACT",
    value: "142.52",
    description: "Contact information"
  }
];
