"use client";

import { CarouselProps } from "@/types";
import React, { useEffect, useMemo, useId, useState } from "react";
import { Button } from "react-aria-components";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export function Carousel<T>({
  items,
  render,
  ariaLabel = "Projects carousel",
  controlsVisible,
}: CarouselProps<T>) {
  const [index, setIndex] = useState<number>(0);

  const visible: boolean = controlsVisible ?? true;
  const count: number = items.length;

  const uid = useId();
  const trackId = `carousel-track-${uid}`;
  const liveId = `carousel-live-${uid}`;

  const clamp = (n: number): number => {
    if (count === 0) return 0;
    return ((n % count) + count) % count;
  };

  const prev = (): void => setIndex((i) => clamp(i - 1));
  const next = (): void => setIndex((i) => clamp(i + 1));
  const goTo = (i: number): void => setIndex(clamp(i));

  useEffect(() => {
    setIndex((i) => clamp(i));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  const trackStyle = useMemo<React.CSSProperties>(
    () => ({ transform: `translateX(-${index * 100}%)` }),
    [index]
  );

  const slideLabel = `Slide ${count === 0 ? 0 : index + 1} of ${count}`;

  return (
    <div
      className="w-full"
      role="region"
      aria-label={ariaLabel}
      aria-roledescription="carousel"
      aria-describedby={liveId}
      tabIndex={0}
    >
      <p id={liveId} className="sr-only" aria-live="polite" aria-atomic="true">
        {slideLabel}
      </p>

      <div className="overflow-x-hidden">
        <div
          id={trackId}
          className="flex transition-transform duration-500 ease-in-out motion-reduce:transition-none"
          style={trackStyle}
        >
          {items.map((item: T, i: number) => {
            const isActive = i === index;
            return (
              <div
                key={i}
                className="w-full shrink-0"
                role="group"
                aria-roledescription="slide"
                aria-label={`Slide ${i + 1} of ${count}`}
                aria-hidden={!isActive}
                tabIndex={isActive ? 0 : -1}
              >
                <div className="flex px-4 md:px-20 min-w-0">{render(item)}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div
        className={
          visible
            ? "sticky bottom-0 left-0 right-0 z-50 m-4 flex items-center justify-center gap-8 py-6"
            : "hidden"
        }
        aria-hidden={!visible}
      >
        <Button
          type="button"
          className="p-2 me-2"
          onPress={prev}
          aria-label="Previous slide"
          aria-controls={trackId}
          isDisabled={!visible || count <= 1}
        >
          <FaChevronLeft size={16} className="hover:text-amber-600" />
        </Button>

        <div
          className="flex flex-row items-center"
          role="tablist"
          aria-label="Choose slide"
        >
          {items.map((_: T, i: number) => {
            const selected = i === index;
            return (
              <Button
                key={i}
                type="button"
                onPress={() => goTo(i)}
                aria-label={`Go to slide ${i + 1} of ${count}`}
                aria-controls={trackId}
                aria-current={selected ? "true" : undefined}
                className={[
                  "transition-all duration-700 motion-reduce:transition-none outline-none",
                  "h-3.5 w-3.5 rounded-full mx-2",
                  selected
                    ? "opacity-100 h-5 w-5 bg-blue-400"
                    : "opacity-40 bg-gray-400 hover:opacity-80",
                ].join(" ")}
                isDisabled={!visible || count <= 1}
              />
            );
          })}
        </div>

        <Button
          type="button"
          className="p-2 ms-2"
          onPress={next}
          aria-label="Next slide"
          aria-controls={trackId}
          isDisabled={!visible || count <= 1}
        >
          <FaChevronRight size={16} className="hover:text-amber-600" />
        </Button>
      </div>
    </div>
  );
}
