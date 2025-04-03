import { projects } from "@/lib/projects";

interface ProjectShowcaseProps {
  onClose: () => void;
}

export default function ProjectShowcase({ onClose }: ProjectShowcaseProps) {
  return (
    <div className="mt-4 p-4 bg-codec-dark border-2 border-codec-light rounded-md">
      <h2 className="text-xl md:text-2xl mb-4 border-b border-codec-light pb-2">CLASSIFIED PROJECTS</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project, index) => (
          <div 
            key={project.id}
            className="project-item border border-codec-light p-3 hover:bg-codec-mid transition-colors"
          >
            <div className="flex justify-between mb-2">
              <h3 className="text-lg">{project.title}</h3>
              <span className="text-sm">FILE-{(index + 1).toString().padStart(2, '0')}</span>
            </div>
            <p className="text-sm mb-2">{project.description}</p>
            <div className="flex justify-between text-xs">
              <span>{project.technologies.join(' · ')}</span>
              <button 
                className="text-codec-highlight hover:underline focus:outline-none focus:underline"
                onClick={() => window.open(project.url, '_blank')}
                aria-label={`View details for ${project.title}`}
              >
                VIEW DETAILS ►
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <button 
        className="mt-4 w-full border border-codec-light p-2 hover:bg-codec-mid transition-colors focus:outline-none focus:bg-codec-mid"
        onClick={onClose}
        aria-label="Close project showcase"
      >
        CLOSE TRANSMISSION
      </button>
    </div>
  );
}
