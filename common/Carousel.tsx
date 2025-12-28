import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "react-aria-components";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export type CarouselProps<T> = {
  items: T[];
  render: (item: T) => React.ReactNode;
  ariaLabel?: string;

  // optional: show controls only on this section
  sectionIdToShowControls?: string; // e.g. "projects"
  scrollRootId?: string; // e.g. "snap-root"
};

export function Carousel<T>({
  items,
  render,
  ariaLabel = "Projects carousel",
  sectionIdToShowControls = "projects",
  scrollRootId = "snap-root",
}: CarouselProps<T>) {
  const [index, setIndex] = useState(0);
  const [barVisible, setBarVisible] = useState(false);

  const count = items.length;
  const trackId = useRef(
    `carousel-track-${Math.random().toString(36).slice(2)}`
  ).current;
  const liveId = useRef(
    `carousel-live-${Math.random().toString(36).slice(2)}`
  ).current;

  const clamp = (n: number) => {
    if (count === 0) return 0;
    return ((n % count) + count) % count;
  };

  const prev = () => setIndex((i) => clamp(i - 1));
  const next = () => setIndex((i) => clamp(i + 1));
  const goTo = (i: number) => setIndex(clamp(i));

  useEffect(() => {
    setIndex((i) => clamp(i));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  const trackStyle = useMemo(
    () => ({ transform: `translateX(-${index * 100}%)` }),
    [index]
  );

  // Show/hide bottom controls only while a specific section is “active” in the snap scroller.
  useEffect(() => {
    const root = document.getElementById(scrollRootId);
    const target = document.getElementById(sectionIdToShowControls);

    if (!root || !target) {
      setBarVisible(true); // fail open (keeps controls discoverable)
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => setBarVisible(entry.isIntersecting),
      {
        root,
        threshold: 0.35,
        rootMargin: "-120px 0px 0px 0px", // header height compensation
      }
    );

    io.observe(target);
    return () => io.disconnect();
  }, [scrollRootId, sectionIdToShowControls]);

  if (count === 0) return null;

  const slideLabel = `Slide ${index + 1} of ${count}`;

  return (
    <div
      className="w-full"
      role="region"
      aria-label={ariaLabel}
      aria-roledescription="carousel"
      aria-describedby={liveId}
      tabIndex={0}
    >
      {/* Live region announcement for screen readers */}
      <p id={liveId} className="sr-only" aria-live="polite" aria-atomic="true">
        {slideLabel}
      </p>

      <div className="overflow-hidden">
        <div
          id={trackId}
          className="flex transition-transform duration-300 ease-in-out motion-reduce:transition-none"
          style={trackStyle}
        >
          {items.map((item, i) => {
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

      {/* Keep controls in the DOM for discoverability; disable when “not active section” */}
      <div
        className={[
          "fixed bottom-0 left-0 right-0 z-50 m-4 flex items-center justify-center gap-8 py-6",
          barVisible ? "" : "invisible pointer-events-none",
        ].join(" ")}
        aria-hidden={!barVisible}
      >
        <Button
          type="button"
          className="p-2"
          onPress={prev}
          aria-label="Previous slide"
          aria-controls={trackId}
          isDisabled={!barVisible}
        >
          <FaChevronLeft size={16} className="hover:text-amber-600" />
        </Button>

        <div
          className="flex flex-row items-center gap-5"
          role="tablist"
          aria-label="Choose slide"
        >
          {items.map((_, i) => {
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
                  "border transition-all duration-300 motion-reduce:transition-none",
                  "h-3 w-3 rounded-[90%_60%_80%_10%]",
                  selected ? "opacity-100 h-4.5 w-4.5 bg-black" : "opacity-40",
                ].join(" ")}
                isDisabled={!barVisible}
              />
            );
          })}
        </div>

        <Button
          type="button"
          className="p-2"
          onPress={next}
          aria-label="Next slide"
          aria-controls={trackId}
          isDisabled={!barVisible}
        >
          <FaChevronRight size={16} className="hover:text-amber-600" />
        </Button>
      </div>
    </div>
  );
}
