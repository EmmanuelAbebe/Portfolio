import { Link } from "react-aria-components";
import { FaGithub } from "react-icons/fa";
import { MdOutlineComputer } from "react-icons/md";
import { Accordion } from "./Accordion";
import { Project } from "@/types";
import { AccordionGroup } from "./AccordionGroup";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="flex flex-col md:flex-row p-3 pb-3 md:pb-0 gap-6 mx-auto">
      <div className="aspect-square w-75 h-75 p-2 bg-blue-300 rounded-2xl hidden md:flex">
        {project.media?.thumbnail ? (
          <img
            src={project.media.thumbnail}
            alt={project.title}
            className="m-auto max-h-full max-w-full object-contain rounded-xl"
          />
        ) : (
          <p className="font-mono m-auto font-bold">Demo-thumbnail</p>
        )}
      </div>

      <div className="flex flex-col gap-2 min-w-0">
        <p className="font-mono text-lg font-bold">{project.title}</p>
        <p className="font-mono text-sm">{project.oneLiner}</p>

        <ul className="font-mono text-xs list-disc ps-15 whitespace-normal wrap-break-word max-w-md">
          {project.highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>

        {project.details && (
          <div className="mt-2">
            <AccordionGroup defaultOpenKey="stack">
              <Accordion itemKey="problem" heading="problem">
                <p className="font-mono text-xs whitespace-normal wrap-break-word">
                  {project.details.problem ?? ""}
                </p>
              </Accordion>
              <Accordion itemKey="arch" heading="architecture">
                <p className="font-mono text-xs whitespace-normal wrap-break-word">
                  {project.details.architecture ?? ""}
                </p>
              </Accordion>
              <Accordion itemKey="decisions" heading="decisions">
                <ul className="font-mono text-xs list-disc ps-5">
                  {(project.details.decisions ?? []).map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </Accordion>
              <Accordion itemKey="stack" heading="stack">
                <ul className="font-mono text-xs list-disc ps-5">
                  {project.stack.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </Accordion>
            </AccordionGroup>
          </div>
        )}

        <div className="p-2 mt-3 flex flex-row gap-5">
          {project.links.repo && (
            <Link
              href={project.links.repo}
              className="flex gap-2 items-center hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              <FaGithub size={12} />
              source code <span className="sr-only">(opens in a new tab)</span>
            </Link>
          )}
          {project.links.demo && (
            <Link
              href={project.links.demo}
              className="flex gap-2 items-center hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              <MdOutlineComputer size={12} />
              live demo site{" "}
              <span className="sr-only">(opens in a new tab)</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
