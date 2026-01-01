"use client";

import clsx from "clsx";
import { FiChevronRight } from "react-icons/fi";
import { AccordionProps } from "@/types";
import { useId } from "react";

export function Accordion({
  heading,
  children,
  isOpen = false,
  onToggle,
}: AccordionProps) {
  const buttonId = useId();
  const panelId = useId();

  return (
    <div className="overflow-hidden p-0.5 m-0.5">
      <button
        type="button"
        id={buttonId}
        className="flex items-center gap-2 font-mono text-left w-full hover:underline hover:font-bold focus-visible:outline-2 focus-visible:outline-offset-2"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => onToggle?.()}
      >
        <FiChevronRight
          className={clsx("transition-transform", isOpen && "rotate-90")}
        />
        <span className="text-sm">{heading}</span>
      </button>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        hidden={!isOpen}
        className="pl-6 py-2"
      >
        <div className="border-l ps-5">{children}</div>
      </div>
    </div>
  );
}
