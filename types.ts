import { ReactNode } from "react";

export type SectionId = "about" | "projects" | "resume" | "contacts";

export const SECTIONS: { id: SectionId; label: string }[] = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "resume", label: "Resume" },
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

export type CarouselProps<T> = {
  items: readonly T[];
  render: (item: T) => React.ReactNode;
  ariaLabel?: string;
  controlsVisible?: boolean;
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
