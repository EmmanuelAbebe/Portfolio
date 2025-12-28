import { ReactNode } from "react";
import { Accordion, AccordionGroup } from "./Accordion";
import { Link } from "react-aria-components";
import { FaGithub } from "react-icons/fa";
import { MdOutlineComputer } from "react-icons/md";

export type ProjectDescription = {
  problemStatement: ReactNode;
  techstack: ReactNode;
  architecture: ReactNode;
  decisions: ReactNode;
};

export type Project = {
  thumbnail?: ReactNode | null;
  title: string;
  description: ProjectDescription;
  githubLink: string;
  demolink: string;
};

export function ProjectCard({
  thumbnail = null,
  title,
  description,
  githubLink,
  demolink,
}: Project) {
  const repoUrl = `https://github.com/EmmanuelAbebe/${githubLink}`;

  return (
    <div className="flex flex-col md:flex-row gap-6 mx-auto">
      <div className="border border-slate-600/20 rounded-md w-full max-w-[320px] aspect-square p-2 flex">
        {thumbnail ? (
          <div className="m-auto">{thumbnail}</div>
        ) : (
          <p className="font-mono m-auto">Demo-thumbnail</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <p className="font-mono text-lg font-bold">{title}</p>
        <div className="font-mono text-xs wrap-break-word whitespace-normal max-w-md">
          <div className="ps-2 flex flex-col gap-2 ">
            <AccordionGroup defaultOpenKey="stack">
              <Accordion
                itemKey="problem-statement"
                heading={"problem statement"}
              >
                <div>{description.problemStatement}</div>
              </Accordion>
              <Accordion
                itemKey="stack"
                heading={"tech stack (languages, frameworks, tools)"}
              >
                <div>{description.techstack}</div>
              </Accordion>
              <Accordion
                itemKey="arch"
                heading={"architecture overview (how components interact)"}
              >
                <div>{description.architecture}</div>
              </Accordion>
              <Accordion
                itemKey="decisions"
                heading={"tradeoffs and decisions"}
              >
                <div>{description.decisions}</div>
              </Accordion>
            </AccordionGroup>
          </div>

          <div className="p-2 mt-5 flex flex-row gap-5">
            <Link
              href={repoUrl}
              className="flex gap-2 items-center hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              <FaGithub size={12} />
              source code <span className="sr-only">(opens in a new tab)</span>
            </Link>
            <Link
              href={demolink}
              className="flex gap-2 items-center hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              <MdOutlineComputer size={12} />
              live demo site
              <span className="sr-only">(opens in a new tab)</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
