import { Carousel } from "@/common/Carousel";
import { ProjectCard } from "@/common/ProjectCard";
import { projects } from "@/lib/projectData";
import { Project } from "@/types";

export default function Projects({ active }: { active: boolean }) {
  return (
    <Carousel
      items={projects}
      ariaLabel="Projects"
      render={(project: Project) => <ProjectCard project={project} />}
      controlsVisible={active}
    />
  );
}
