"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";
import { BsPersonWorkspace } from "react-icons/bs";
import {
  FaGithub,
  FaFile,
  FaCode,
  FaEnvelope,
  FaPhone,
  FaLinkedin,
} from "react-icons/fa";
import { LuMessageSquare } from "react-icons/lu";
import { RiSendPlaneFill } from "react-icons/ri";

import {
  Button,
  Link,
  TextField,
  Label,
  Input,
  TextArea,
} from "react-aria-components";
import { ProjectCard } from "@/common/ProjectCard";
import { Section } from "@/common/Section";
import { Carousel } from "@/common/Carousel";
import { projectData } from "@/lib/projectData";

type SectionId = "about" | "projects" | "resume" | "contacts";

const SECTIONS: { id: SectionId; label: string }[] = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "resume", label: "Resume" },
  { id: "contacts", label: "Contacts" },
];

export default function Home() {
  const [active, setActive] = useState<SectionId>("about");

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      Boolean
    ) as HTMLElement[];
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0)
          )[0];

        if (!visible?.target?.id) return;
        const id = visible.target.id as SectionId;
        setActive(id);
        history.replaceState(null, "", `#${id}`);
      },
      {
        root: null,
        rootMargin: "-45% 0px -45% 0px",
        threshold: [0.1, 0.25, 0.5, 0.75],
      }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const onNav = (id: SectionId) => {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      id="snap-root"
      role="region"
      aria-label="Main content"
      className="min-h-svh overflow-x-hidden snap-y snap-mandatory scroll-smooth scroll-pt-30 motion-reduce:snap-none motion-reduce:scroll-auto"
    >
      <header className="sticky top-0 z-50 bg-white/10 backdrop-blur px-8 pt-4 md:px-30 md:pt-10">
        <div className="border-b pb-3">
          <div
            className={`${
              active === "about" ? "flex flex-col gap-2" : "hidden"
            } `}
          >
            <p className="font-mono text-4xl font-bold">Emmanuel Abebe</p>
            <p className="font-mono">
              Junior Software Engineer · React · Next.js
            </p>

            <div className="flex flex-row gap-8">
              <Link
                className="flex gap-4 hover:underline"
                href="https://github.com/EmmanuelAbebe"
                target="_blank"
                rel="noreferrer"
              >
                <FaGithub size={16} />
                <p className="text-sm font-mono font-light hidden md:block">
                  github.com/EmmanuelAbebe
                </p>
              </Link>

              <Link
                className="flex gap-4 hover:underline"
                href="https://www.linkedin.com/in/emmanuel-abebe-50554bb2/"
                target="_blank"
                rel="noreferrer"
              >
                <FaLinkedin size={16} />
                <p className="text-sm font-mono font-light hidden md:block">
                  linkedin.com/in/emmanuel-abebe-50554bb2
                </p>
              </Link>
            </div>
          </div>

          <nav className="font-mono text-sm flex items-center gap-2 mt-5">
            {SECTIONS.map((s, i) => (
              <span key={s.id} className="flex items-center gap-2">
                <Link
                  href={`#${s.id}`}
                  aria-current={active === s.id ? "page" : undefined}
                  className={clsx(
                    "flex items-center gap-1 hover:underline",
                    active === s.id && "underline font-semibold"
                  )}
                  onPress={(e) => {
                    onNav(s.id);
                  }}
                >
                  {s.id === "about" && <BsPersonWorkspace size={14} />}
                  {s.id === "projects" && <FaCode size={14} />}
                  {s.id === "resume" && <FaFile size={14} />}
                  {s.id === "contacts" && <LuMessageSquare size={14} />}
                  {s.label}
                </Link>

                {i !== SECTIONS.length - 1 && (
                  <span className="opacity-50">/</span>
                )}
              </span>
            ))}
          </nav>
        </div>
      </header>

      <main className="px-4 mx-0 md:px-16 md:mx-16">
        <Section id="about" title="About">
          <p className="font-mono">some things about myself</p>
        </Section>

        <Section id="projects" title="Projects">
          <Carousel
            items={projectData}
            ariaLabel="Projects"
            render={(project) => <ProjectCard {...project} />}
          />
        </Section>

        <Section id="resume" title="Resume">
          <ul className="font-mono text-sm list-disc pl-6">
            <li>one-page pdf</li>
            <li>Downloadable</li>
          </ul>

          <ul>
            <p>Skills</p>
            <li>Languages</li>
            <li>Frameworks</li>
            <li>Databases</li>
            <li>Tools</li>
            <li>concepts (data strctures, OS, networking, concurrency)</li>
          </ul>
        </Section>

        <Section id="contacts" title="Contacts">
          <div className="flex flex-col md:flex-row justify-between gap-25">
            <div className="min-w-150">
              <p className="font-mono text-lg pb-6 mb-3">Contact me here</p>

              <form className="flex flex-col gap-2">
                <TextField isRequired className="relative p-1.5">
                  <Label className="absolute font-bold left-5 top-0 bg-white px-1 text-xs font-mono text-gray-600 pointer-events-none">
                    Your Name
                  </Label>
                  <Input
                    className="outline-none border p-3 text-sm w-full font-mono"
                    placeholder="Who is sending? Tell me your name"
                  />
                </TextField>

                <TextField isRequired className="relative p-1.5">
                  <Label className="absolute font-bold left-5 top-0 bg-white px-1 text-xs font-mono text-gray-600 pointer-events-none">
                    Your Contact Information
                  </Label>
                  <Input
                    className="outline-1 p-3 text-sm w-full font-mono"
                    placeholder="How can I contact you back? - email or phone"
                  />
                </TextField>

                <TextField isRequired className="relative p-1.5">
                  <Label className="absolute font-bold left-5 top-0 bg-white px-1 text-xs font-mono text-gray-600 pointer-events-none">
                    Message
                  </Label>
                  <TextArea
                    className="outline-1 p-3 text-sm h-50 w-full font-mono"
                    placeholder="I am ready for your message..."
                  />
                </TextField>

                <div className="flex justify-end mt-6 mx-1 px-1">
                  <Button
                    type="submit"
                    className="bg-gray-900/90 hover:bg-gray-900/70 flex items-center gap-2 px-5 py-3"
                  >
                    <RiSendPlaneFill className="text-white" size={16} />
                    <p className="font-mono font-bold text-white">Send</p>
                  </Button>
                </div>
              </form>
            </div>

            <div className="ps-6">
              <p className="font-mono text-lg pb-6 mb-3">Contact Information</p>
              <ul className="font-medium ps-6 w-120 flex flex-col gap-2">
                <li className="flex flex-row items-center gap-4 p-1">
                  <FaEnvelope size={16} />
                  <Link
                    className="text-sm font-mono font-light hover:underline"
                    href="mailto:emmanuelmihret@gmail.com"
                  >
                    emmanuelmihret@gmail.com
                  </Link>
                </li>
                <li className="flex flex-row items-center gap-4 p-1">
                  <FaPhone size={14} />
                  <Link
                    className="text-sm font-mono font-light hover:underline"
                    href="tel:+13018935021"
                  >
                    +1 (301) 893-5021
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </Section>
      </main>
    </div>
  );
}
