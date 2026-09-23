import Image from "next/image";
import { Link } from "react-aria-components";
import { FaGithub } from "react-icons/fa";
import { MdOutlineComputer } from "react-icons/md";
import { Accordion } from "./Accordion";
import { Project } from "@/types";
import { AccordionGroup } from "./AccordionGroup";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="flex flex-col md:flex-row gap-6 border-b border-gray-200 pb-10">
      {project.media?.thumbnail && (
        <div className="aspect-square w-75 h-75 p-2 bg-slate-100 rounded-2xl hidden md:flex shrink-0">
          <Image
            src={project.media.thumbnail}
            alt={project.title}
            width={300}
            height={300}
            className="m-auto max-h-full max-w-full object-contain rounded-xl"
          />
        </div>
      )}

      <div className="flex flex-col gap-3 min-w-0 max-w-3xl">
        <h3 className="font-mono text-lg font-bold">{project.title}</h3>
        <p className="font-mono text-sm">{project.oneLiner}</p>

        {project.note && (
          <p className="font-mono text-xs text-slate-500 italic">{project.note}</p>
        )}

        <ul className="flex flex-wrap gap-2" aria-label="Tech stack">
          {project.stack.map((s) => (
            <li
              key={s}
              className="font-mono text-xs rounded border border-slate-200 bg-slate-50 px-2 py-1 text-slate-700"
            >
              {s}
            </li>
          ))}
        </ul>

        <ul className="font-mono text-xs leading-5 list-disc ps-5 space-y-1 wrap-break-word">
          {project.highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>

        {project.details && (
          <div className="mt-1">
            <AccordionGroup defaultOpenKey="problem">
              <Accordion itemKey="problem" heading="problem">
                <p className="font-mono text-xs leading-5 whitespace-normal wrap-break-word">
                  {project.details.problem ?? ""}
                </p>
              </Accordion>
              <Accordion itemKey="arch" heading="architecture">
                <p className="font-mono text-xs leading-5 whitespace-normal wrap-break-word">
                  {project.details.architecture ?? ""}
                </p>
              </Accordion>
              <Accordion itemKey="decisions" heading="decisions & tradeoffs">
                <ul className="font-mono text-xs leading-5 list-disc ps-5 space-y-1">
                  {(project.details.decisions ?? []).map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </Accordion>
            </AccordionGroup>
          </div>
        )}

        <div className="mt-1 flex flex-row flex-wrap gap-5 font-mono text-sm">
          {project.links.repo && (
            <Link
              href={project.links.repo}
              className="flex gap-2 items-center text-indigo-600 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              <FaGithub size={14} />
              source code <span className="sr-only">(opens in a new tab)</span>
            </Link>
          )}
          {project.links.demo && (
            <Link
              href={project.links.demo}
              className="flex gap-2 items-center text-indigo-600 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              <MdOutlineComputer size={14} />
              live demo <span className="sr-only">(opens in a new tab)</span>
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
