"use client";

import { SectionId, SECTIONS } from "@/types";
import { useEffect, useState } from "react";
import { Section } from "@/common/Section";
import Header from "@/common/Header";
import Contacts from "./(sections)/Contacts";
import Projects from "./(sections)/Projects";
import About from "./(sections)/About";

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
        // A section is "active" while it crosses a thin band at mid-screen.
        // threshold 0 so tall sections still register (their ratio stays tiny).
        rootMargin: "-45% 0px -45% 0px",
        threshold: 0,
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
    <div className="min-h-svh">
      <Header active={active} sections={SECTIONS} onNav={onNav} />

      <main className="px-4 mx-0 md:px-16 md:mx-16 pb-16">
        <Section id="about">
          <About />
        </Section>

        <Section id="projects" title="Projects">
          <Projects />
        </Section>

        <Section id="contacts" title="Contacts">
          <Contacts />
        </Section>
      </main>
    </div>
  );
}
