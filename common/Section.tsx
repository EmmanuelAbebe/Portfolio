import { SectionProps } from "@/types";

export function Section({ id, className, title, children }: SectionProps) {
  return (
    <section
      id={id}
      className={`scroll-mt-28 py-10 md:py-14 ${className ?? ""}`}
    >
      {title && (
        <h2 className="font-mono text-2xl md:text-3xl font-bold mb-8">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}
