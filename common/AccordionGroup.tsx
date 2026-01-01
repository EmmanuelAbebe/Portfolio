"use client";

import { AccordionGroupProps, AccordionProps } from "@/types";
import { Children, cloneElement, isValidElement, useId, useState } from "react";

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
