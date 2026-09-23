import { ProjectCard } from "@/common/ProjectCard";
import { projects } from "@/lib/projectData";

// Stacked, not a carousel: every project is visible to someone skimming.
export default function Projects() {
  return (
    <div className="flex flex-col gap-10">
      {projects.map((project) => (
        <ProjectCard key={project.slug} project={project} />
      ))}
    </div>
  );
}
