import { SectionProps } from "@/types";

export function Section({ id, className, title, children }: SectionProps) {
  return (
    <section
      id={id}
      className={`min-h-svh snap-start snap-stop-always flex place-items-center px-4 ${className}`}
    >
      <div className="w-full py-8">
        <h2 className="font-mono text-3xl font-bold mb-20">{title}</h2>
        {children}
      </div>
    </section>
  );
}
