"use client";

import clsx from "clsx";
import {
  Children,
  ReactNode,
  cloneElement,
  isValidElement,
  useId,
  useState,
} from "react";
import { FiChevronRight } from "react-icons/fi";

export type AccordionProps = {
  heading: ReactNode;
  children: ReactNode;

  // authored on the item, read by AccordionGroup
  itemKey?: string;

  // injected by AccordionGroup
  isOpen?: boolean;
  onToggle?: () => void;
};

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

type AccordionGroupProps = {
  children: ReactNode;
  defaultOpenKey?: string;
  collapsible?: boolean; // allow closing the currently open item
};

export function AccordionGroup({
  children,
  defaultOpenKey,
  collapsible = true,
}: AccordionGroupProps) {
  const baseId = useId();
  const [openKey, setOpenKey] = useState<string | null>(defaultOpenKey ?? null);

  const items = Children.toArray(children).map((child, idx) => {
    if (!isValidElement<AccordionProps>(child)) return child;

    const key = child.props.itemKey ?? `${baseId}-${idx}`;
    const isOpen = openKey === key;

    return cloneElement(child, {
      isOpen,
      onToggle: () => {
        setOpenKey((prev) => {
          if (prev === key) return collapsible ? null : prev;
          return key;
        });
      },
    });
  });

  return <div>{items}</div>;
}
