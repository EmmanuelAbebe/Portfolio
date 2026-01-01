"use client";

import type React from "react";
import {
  FaReact,
  FaHtml5,
  FaCss3,
  FaNodeJs,
  FaPython,
  FaJava,
  FaGitAlt,
  FaDocker,
  FaFlask,
  FaGithub,
  FaLinkedin,
} from "react-icons/fa";
import { MdArrowRight } from "react-icons/md";
import { RiNextjsLine } from "react-icons/ri";
import {
  SiTypescript,
  SiPostgresql,
  SiPrisma,
  SiSqlalchemy,
  SiFastapi,
} from "react-icons/si";

type Skill = {
  label: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  emphasis?: boolean;
  note?: string;
};

type Group = {
  title: string;
  items: Skill[];
};

const GROUPS: Group[] = [
  {
    title: "Frontend",
    items: [
      { label: "React", Icon: FaReact, emphasis: true },
      { label: "Next.js", Icon: RiNextjsLine, emphasis: true },
      { label: "TypeScript", Icon: SiTypescript, emphasis: true },
      { label: "HTML", Icon: FaHtml5 },
      { label: "CSS", Icon: FaCss3 },
    ],
  },
  {
    title: "Backend",
    items: [
      { label: "Node.js", Icon: FaNodeJs },
      { label: "Python", Icon: FaPython },
      { label: "Flask", Icon: FaFlask },
      { label: "FastAPI", Icon: SiFastapi },
      { label: "Java", Icon: FaJava, note: "coursework + projects" },
    ],
  },
  {
    title: "Data",
    items: [
      { label: "PostgreSQL", Icon: SiPostgresql, emphasis: true },
      { label: "Prisma", Icon: SiPrisma },
      { label: "SQLAlchemy", Icon: SiSqlalchemy },
    ],
  },
  {
    title: "Tooling",
    items: [
      { label: "Git", Icon: FaGitAlt },
      { label: "Docker", Icon: FaDocker },
    ],
  },
];

function SkillPill({ label, Icon, emphasis, note }: Skill) {
  const iconClass = emphasis
    ? "text-indigo-600"
    : "text-slate-400 group-hover:text-indigo-600";

  const pillClass =
    "group inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 cursor-pointer" +
    "transition-colors duration-150 hover:border-indigo-300";

  return (
    <div className={pillClass} title={note ?? label} aria-label={label}>
      <Icon size={18} className={iconClass} />
      <span className="font-mono text-sm text-slate-800">{label}</span>
    </div>
  );
}

export default function About() {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex md:flex-row flex-col items-baseline gap-4">
        <a
          className="flex gap-4 hover:underline text-indigo-500"
          href="https://github.com/EmmanuelAbebe"
          target="_blank"
          rel="noreferrer"
        >
          <FaGithub size={16} />
          <p className="text-sm font-mono font-light">
            github.com/EmmanuelAbebe
          </p>
        </a>
        <a
          className="flex gap-4 hover:underline text-indigo-500"
          href="https://www.linkedin.com/in/emmanuel-abebe-50554bb2/"
          target="_blank"
          rel="noreferrer"
        >
          <FaLinkedin size={16} />
          <p className="text-sm font-mono font-light">
            linkedin.com/in/emmanuel-abebe-50554bb2
          </p>
        </a>
      </div>

      {/* Summary */}
      <div className="space-y-3">
        <p className="font-mono text-sm leading-6 text-slate-700">
          Emmanuel Abebe — junior software engineer focused on React/Next.js and
          building maintainable UI with clean data flows.
        </p>
        <ul className="font-mono text-sm leading-6 list-disc text-slate-700 ps-5 space-y-3">
          <li className="m-1 p-2">
            Built full-stack web apps with typed APIs, database schemas, and
            CRUD workflows.
          </li>
          <li className="m-1 p-2">
            Implemented interactive UI features (state, navigation, edge cases)
            with performance in mind.
          </li>
        </ul>
        <div className="font-mono text-sm flex-wrap leading-6 text-slate-700 py-2 flex gap-2">
          <span className="font-semibold text-indigo-500">Target roles</span>
          <span className="w-full ps-8">
            Frontend or full-stack (React, Next.js, TypeScript, PostgreSQL).
          </span>
        </div>
      </div>

      {/* Skills */}
      <div className="space-y-5">
        <p className="font-mono font-semibold text-slate-900 border-b border-gray-300 py-2">
          Skills
        </p>

        <div className="grid gap-6 ps-8">
          {GROUPS.map((g) => (
            <section key={g.title} className="space-y-2">
              <p className="font-mono text-xs uppercase tracking-wide text-slate-500">
                {g.title}
              </p>

              <div className="flex flex-wrap gap-2">
                {g.items.map((skill) => (
                  <SkillPill key={skill.label} {...skill} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* Proof (replace with real specifics) */}
      <div className="space-y-3">
        <p className="font-mono font-semibold border-b border-gray-300 py-2 text-slate-900">
          Proof
        </p>
        <ul className="font-mono text-sm leading-6 list-disc text-slate-700 ps-5 space-y-3">
          <li className="m-1 p-2">
            Live demos deployed for projects; source code available on GitHub.
          </li>
          <li className="m-1 p-2">
            Each project documents architecture, tradeoffs, and implementation
            details.
          </li>
        </ul>
      </div>
    </div>
  );
}
