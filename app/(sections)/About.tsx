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
  FaLinux,
  FaDatabase,
} from "react-icons/fa";
import { RiNextjsLine } from "react-icons/ri";
import {
  SiTypescript,
  SiJavascript,
  SiPostgresql,
  SiPrisma,
  SiSqlalchemy,
  SiFastapi,
  SiTailwindcss,
  SiVercel,
  SiStripe,
  SiClaude,
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
    title: "Languages",
    items: [
      { label: "TypeScript", Icon: SiTypescript, emphasis: true },
      { label: "JavaScript", Icon: SiJavascript },
      { label: "Python", Icon: FaPython },
      { label: "SQL", Icon: FaDatabase },
      { label: "Java", Icon: FaJava, note: "coursework" },
    ],
  },
  {
    title: "Frontend",
    items: [
      { label: "React", Icon: FaReact, emphasis: true },
      { label: "Next.js", Icon: RiNextjsLine, emphasis: true },
      { label: "Tailwind CSS", Icon: SiTailwindcss },
      { label: "HTML", Icon: FaHtml5 },
      { label: "CSS", Icon: FaCss3 },
    ],
  },
  {
    title: "Backend",
    items: [
      { label: "Node.js", Icon: FaNodeJs },
      { label: "FastAPI", Icon: SiFastapi },
      { label: "Flask", Icon: FaFlask },
      { label: "Stripe API", Icon: SiStripe },
    ],
  },
  {
    title: "Data",
    items: [
      { label: "PostgreSQL", Icon: SiPostgresql, emphasis: true },
      { label: "Prisma", Icon: SiPrisma, emphasis: true },
      { label: "SQLAlchemy", Icon: SiSqlalchemy },
    ],
  },
  {
    title: "Tooling",
    items: [
      { label: "Git", Icon: FaGitAlt },
      { label: "Linux", Icon: FaLinux },
      { label: "Docker", Icon: FaDocker },
      { label: "Vercel", Icon: SiVercel },
      { label: "Claude Code", Icon: SiClaude, note: "AI pair programming" },
    ],
  },
];

function SkillPill({ label, Icon, emphasis, note }: Skill) {
  // Static labels, so no hover styling that would suggest they're clickable.
  const iconClass = emphasis ? "text-indigo-600" : "text-slate-400";

  const pillClass =
    "inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2";

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
          <p className="text-sm font-mono">
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
          <p className="text-sm font-mono">
            linkedin.com/in/emmanuel-abebe-50554bb2
          </p>
        </a>
      </div>

      {/* Summary */}
      <div className="space-y-3">
        <p className="text-sm leading-7 text-slate-700">
          Junior software engineer building full-stack TypeScript apps: Next.js
          front ends, typed API routes, PostgreSQL schemas, and auth.
        </p>
        <ul className="text-sm leading-7 list-disc text-slate-700 ps-5 space-y-1">
          <li className="p-1">
            Latest project: an AI chess coach that runs Stockfish in the
            browser, explains mistakes with an LLM, and profiles players with
            a Python ML pipeline.
          </li>
          <li className="p-1">
            Built booking systems with availability logic, double-booking
            prevention, role-based admin dashboards, and Stripe payments.
          </li>
        </ul>
        <div className="text-sm flex-wrap leading-7 text-slate-700 py-2 flex gap-2">
          <span className="font-mono text-sm font-semibold text-indigo-500">
            Target roles
          </span>
          <span className="w-full ps-8">
            Junior full-stack or frontend engineer (React, Next.js, TypeScript,
            PostgreSQL).
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

      {/* Education */}
      <div className="space-y-3">
        <p className="font-mono font-semibold border-b border-gray-300 py-2 text-slate-900">
          Education
        </p>
        <div className="text-sm leading-7 text-slate-700 ps-8">
          <p className="font-semibold">B.S. Computer Science, 2025</p>
          <p>University of Maryland Global Campus</p>
        </div>
      </div>
    </div>
  );
}
