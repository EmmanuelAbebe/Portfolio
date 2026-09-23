import { ReactNode } from "react";

export type SectionId = "about" | "projects" | "contacts";

export const SECTIONS: { id: SectionId; label: string }[] = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "contacts", label: "Contacts" },
];

export type AccordionProps = {
  heading: ReactNode;
  children: ReactNode;

  // authored on the item, read by AccordionGroup
  itemKey?: string;

  // injected by AccordionGroup
  isOpen?: boolean;
  onToggle?: () => void;
};

export type AccordionGroupProps = {
  children: ReactNode;
  defaultOpenKey?: string;
  collapsible?: boolean; // allow closing the currently open item
};

export type SectionProps = {
  id: string;
  title: string;
  className?: string;
  children: ReactNode;
};

export type Project = {
  slug: string;
  title: string;
  oneLiner: string;
  stack: string[];
  highlights: string[]; // 2–4 bullets, outcome-focused
  note?: string; // honest status, e.g. what the demo does/doesn't cover
  links: {
    demo?: string;
    repo?: string;
  };
  details?: {
    problem?: string;
    architecture?: string;
    decisions?: string[];
  };
  media?: {
    thumbnail?: string; // "/images/x.png"
  };
};
